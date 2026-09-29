"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PageShell from "../components/PageShell";
import { api } from "../lib/api";
import { stockStatus, stockStatusPresentation } from "../lib/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/items"), api("/categories")])
      .then(([itemData, categoryData]) => {
        setItems(itemData);
        setCategories(categoryData);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const lowStock = items.filter((item) => stockStatus(item) === "low");
  const outStock = items.filter((item) => stockStatus(item) === "out");
  const attention = items
    .filter((item) => stockStatus(item) !== "ok")
    .sort((first, second) => first.qty - second.qty)
    .slice(0, 8);
  const totalUnits = items.reduce((sum, item) => sum + Number(item.qty), 0);

  return (
    <PageShell>
      <div className="main">
        <div className="topbar">
          <div><div className="page-title">Dashboard</div><div className="page-subtitle">Overview of your current stock</div></div>
          <div className="topbar-actions"><Button render={<Link href="/items/new" />} nativeButton={false}><Plus aria-hidden="true" />Add item</Button></div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="stat-grid">
          <Stat label="Total items" value={items.length} detail={`${categories.length} categories`} />
          <Stat label="Units in stock" value={totalUnits.toLocaleString()} detail="Across all locations" />
          <Stat label="Low stock" value={lowStock.length} detail="At or below reorder level" tone="warn" />
          <Stat label="Out of stock" value={outStock.length} detail="Needs restock now" tone="danger" />
        </div>
        <div className="topbar section-heading">
          <div className="page-title">Low &amp; out of stock</div>
          <Button render={<Link href="/inventory" />} nativeButton={false} variant="outline" size="sm">View all items</Button>
        </div>
        <Card className="table-card p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>SKU</TableHead><TableHead>Category</TableHead><TableHead>Quantity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {attention.length === 0 ? (
                <TableRow><TableCell colSpan={5}><div className="empty-state"><h3>{error ? "Inventory unavailable" : "Everything's stocked"}</h3><p>{error ? "Check the API and database connection." : "No items are low or out of stock right now."}</p></div></TableCell></TableRow>
              ) : attention.map((item) => {
                const badge = stockStatusPresentation(item);
                return <TableRow key={item.id}>
                  <TableCell className="cell-primary">{item.name}</TableCell><TableCell className="sku-tag">{item.sku}</TableCell>
                  <TableCell>{item.categoryName ? <Badge variant="outline">{item.categoryName}</Badge> : "—"}</TableCell>
                  <TableCell>{item.qty}</TableCell><TableCell><Badge variant="outline" className={badge.className}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{badge.label}</Badge></TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageShell>
  );
}

function Stat({ label, value, detail, tone = "" }) {
  return <Card className="stat-card"><CardHeader className="stat-card-header"><CardTitle className="stat-label">{label}</CardTitle></CardHeader><CardContent className="stat-card-content"><div className={`stat-value ${tone}`}>{value}</div><div className="stat-delta">{detail}</div></CardContent></Card>;
}