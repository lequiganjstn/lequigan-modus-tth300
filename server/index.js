require("dotenv").config();

const cors = require("cors");
const express = require("express");
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = new Set((process.env.FRONTEND_ORIGINS || `${process.env.FRONTEND_ORIGIN || "http://localhost:3000"},http://localhost:3001`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
}));
app.use(express.json());

function asyncRoute(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}

function validItem(body) {
  return typeof body.name === "string" && body.name.trim()
    && typeof body.sku === "string" && body.sku.trim()
    && Number.isInteger(Number(body.qty)) && Number(body.qty) >= 0
    && Number.isInteger(Number(body.reorderLevel ?? 0)) && Number(body.reorderLevel ?? 0) >= 0
    && Number.isFinite(Number(body.unitCost)) && Number(body.unitCost) >= 0
    && (body.categoryId == null || (Number.isInteger(Number(body.categoryId)) && Number(body.categoryId) > 0));
}

function itemValues(body) {
  return [body.sku.trim(), body.name.trim(), body.categoryId || null, Number(body.qty), Number(body.reorderLevel ?? 0), Number(body.unitCost), String(body.location || "").trim() || null];
}

const itemSelect = `SELECT i.id, i.sku, i.name, i.category_id AS categoryId, c.name AS categoryName,
  i.quantity AS qty, i.reorder_level AS reorderLevel, i.unit_cost AS unitCost, i.location
  FROM items i LEFT JOIN categories c ON c.id = i.category_id`;

app.get("/api/health", asyncRoute(async (_request, response) => {
  await pool.query("SELECT 1");
  response.json({ status: "ok", database: "connected" });
}));

app.get("/api/categories", asyncRoute(async (_request, response) => {
  const [rows] = await pool.query(`SELECT c.id, c.name, c.color, COUNT(i.id) AS itemCount
    FROM categories c LEFT JOIN items i ON i.category_id = c.id
    GROUP BY c.id ORDER BY c.name`);
  response.json(rows.map((row) => ({ ...row, id: Number(row.id), itemCount: Number(row.itemCount) })));
}));

app.post("/api/categories", asyncRoute(async (request, response) => {
  const { name, color } = request.body;
  if (typeof name !== "string" || !name.trim() || !/^#[0-9a-f]{6}$/i.test(color || "")) {
    return response.status(400).json({ error: "Enter a category name and a valid color." });
  }
  const [result] = await pool.execute("INSERT INTO categories (name, color) VALUES (?, ?)", [name.trim(), color]);
  const [rows] = await pool.execute("SELECT id, name, color FROM categories WHERE id = ?", [result.insertId]);
  response.status(201).json({ ...rows[0], id: Number(rows[0].id), itemCount: 0 });
}));

app.put("/api/categories/:id", asyncRoute(async (request, response) => {
  const { name, color } = request.body;
  if (!Number.isInteger(Number(request.params.id)) || typeof name !== "string" || !name.trim() || !/^#[0-9a-f]{6}$/i.test(color || "")) {
    return response.status(400).json({ error: "Enter a category name and a valid color." });
  }
  await pool.execute("UPDATE categories SET name = ?, color = ? WHERE id = ?", [name.trim(), color, request.params.id]);
  const [rows] = await pool.execute("SELECT id, name, color FROM categories WHERE id = ?", [request.params.id]);
  if (!rows.length) return response.status(404).json({ error: "Category not found." });
  response.json({ ...rows[0], id: Number(rows[0].id) });
}));

app.delete("/api/categories/:id", asyncRoute(async (request, response) => {
  const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [request.params.id]);
  if (!result.affectedRows) return response.status(404).json({ error: "Category not found." });
  response.status(204).end();
}));

app.get("/api/items", asyncRoute(async (_request, response) => {
  const [rows] = await pool.query(`${itemSelect} ORDER BY i.name`);
  response.json(rows.map(normalizeItem));
}));

app.get("/api/items/:id", asyncRoute(async (request, response) => {
  const [rows] = await pool.execute(`${itemSelect} WHERE i.id = ?`, [request.params.id]);
  if (!rows.length) return response.status(404).json({ error: "Item not found." });
  response.json(normalizeItem(rows[0]));
}));

app.post("/api/items", asyncRoute(async (request, response) => {
  if (!validItem(request.body)) return response.status(400).json({ error: "Enter a name, SKU, non-negative quantity, reorder level, and unit cost." });
  const [result] = await pool.execute(`INSERT INTO items (sku, name, category_id, quantity, reorder_level, unit_cost, location)
    VALUES (?, ?, ?, ?, ?, ?, ?)`, itemValues(request.body));
  const [rows] = await pool.execute(`${itemSelect} WHERE i.id = ?`, [result.insertId]);
  response.status(201).json(normalizeItem(rows[0]));
}));

app.put("/api/items/:id", asyncRoute(async (request, response) => {
  if (!validItem(request.body)) return response.status(400).json({ error: "Enter a name, SKU, non-negative quantity, reorder level, and unit cost." });
  await pool.execute(`UPDATE items SET sku = ?, name = ?, category_id = ?, quantity = ?,
    reorder_level = ?, unit_cost = ?, location = ? WHERE id = ?`, [...itemValues(request.body), request.params.id]);
  const [rows] = await pool.execute(`${itemSelect} WHERE i.id = ?`, [request.params.id]);
  if (!rows.length) return response.status(404).json({ error: "Item not found." });
  response.json(normalizeItem(rows[0]));
}));

app.delete("/api/items/:id", asyncRoute(async (request, response) => {
  const [result] = await pool.execute("DELETE FROM items WHERE id = ?", [request.params.id]);
  if (!result.affectedRows) return response.status(404).json({ error: "Item not found." });
  response.status(204).end();
}));

function normalizeItem(row) {
  return { ...row, id: Number(row.id), categoryId: row.categoryId == null ? null : Number(row.categoryId), qty: Number(row.qty), reorderLevel: Number(row.reorderLevel), unitCost: Number(row.unitCost) };
}

app.use((error, _request, response, _next) => {
  if (error.code === "ER_DUP_ENTRY") return response.status(409).json({ error: "That SKU or category name is already in use." });
  if (error.code === "ER_NO_REFERENCED_ROW_2") return response.status(400).json({ error: "The selected category does not exist." });
  console.error(error);
  response.status(500).json({ error: "A server error occurred. Check the API and database configuration." });
});

const server = app.listen(port, () => console.log(`Modus API listening on http://localhost:${port}`));

function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);