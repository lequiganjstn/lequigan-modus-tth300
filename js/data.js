// Modus — sample in-memory data layer.
// NOTE: this is a static frontend prototype. No backend yet — data is seeded
// on load and kept in memory (window) for the session only, so edits persist
// while navigating between pages via sessionStorage, but reset on full reload
// unless already saved. Next milestone swaps this for a real Node.js API.

const SEED_CATEGORIES = [
  { id: "cat-1", name: "Electronics", color: "#0070f3" },
  { id: "cat-2", name: "Office Supplies", color: "#7928ca" },
  { id: "cat-3", name: "Furniture", color: "#ab570a" },
  { id: "cat-4", name: "Packaging", color: "#0c7a3a" },
  { id: "cat-5", name: "Raw Materials", color: "#c50000" },
];

const SEED_ITEMS = [
  { id: "itm-001", sku: "ELE-1042", name: "Wireless Mouse M185", categoryId: "cat-1", qty: 128, reorderLevel: 30, unitCost: 8.5, location: "A1-03" },
  { id: "itm-002", sku: "ELE-2210", name: "USB-C Hub 7-in-1", categoryId: "cat-1", qty: 12, reorderLevel: 20, unitCost: 15.2, location: "A1-07" },
  { id: "itm-003", sku: "OFF-0093", name: "A4 Copy Paper (Ream)", categoryId: "cat-2", qty: 0, reorderLevel: 50, unitCost: 3.4, location: "B2-01" },
  { id: "itm-004", sku: "OFF-0147", name: "Ballpoint Pens (Box of 12)", categoryId: "cat-2", qty: 340, reorderLevel: 60, unitCost: 2.1, location: "B2-04" },
  { id: "itm-005", sku: "FUR-3301", name: "Ergonomic Task Chair", categoryId: "cat-3", qty: 18, reorderLevel: 5, unitCost: 89.0, location: "C1-01" },
  { id: "itm-006", sku: "FUR-3355", name: "Standing Desk 120cm", categoryId: "cat-3", qty: 6, reorderLevel: 8, unitCost: 145.0, location: "C1-02" },
  { id: "itm-007", sku: "PKG-0421", name: "Corrugated Box (Medium)", categoryId: "cat-4", qty: 890, reorderLevel: 200, unitCost: 0.65, location: "D3-11" },
  { id: "itm-008", sku: "PKG-0433", name: "Bubble Wrap Roll 50m", categoryId: "cat-4", qty: 24, reorderLevel: 25, unitCost: 12.0, location: "D3-14" },
  { id: "itm-009", sku: "RAW-5510", name: "Aluminum Sheet 2mm", categoryId: "cat-5", qty: 3, reorderLevel: 10, unitCost: 34.75, location: "E1-01" },
  { id: "itm-010", sku: "RAW-5522", name: "PLA Filament 1kg", categoryId: "cat-5", qty: 56, reorderLevel: 15, unitCost: 19.9, location: "E1-05" },
  { id: "itm-011", sku: "ELE-2288", name: "27in Monitor 1440p", categoryId: "cat-1", qty: 9, reorderLevel: 10, unitCost: 210.0, location: "A1-11" },
  { id: "itm-012", sku: "OFF-0201", name: "Sticky Notes 3x3 (Pack)", categoryId: "cat-2", qty: 175, reorderLevel: 40, unitCost: 1.15, location: "B2-08" },
];

function loadData() {
  let items = sessionStorage.getItem("modus_items");
  let categories = sessionStorage.getItem("modus_categories");
  items = items ? JSON.parse(items) : SEED_ITEMS.slice();
  categories = categories ? JSON.parse(categories) : SEED_CATEGORIES.slice();
  return { items, categories };
}

function saveData(items, categories) {
  sessionStorage.setItem("modus_items", JSON.stringify(items));
  sessionStorage.setItem("modus_categories", JSON.stringify(categories));
}

function resetData() {
  sessionStorage.removeItem("modus_items");
  sessionStorage.removeItem("modus_categories");
}

function stockStatus(item) {
  if (item.qty <= 0) return "out";
  if (item.qty <= item.reorderLevel) return "low";
  return "ok";
}

function categoryById(categories, id) {
  return categories.find((c) => c.id === id);
}

function formatCurrency(n) {
  return "$" + Number(n).toFixed(2);
}

function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
