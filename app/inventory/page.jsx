"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import PageShell from "../../components/PageShell";
import { api } from "../../lib/api";
import { formatCurrency, stockStatus, stockStatusPresentation } from "../../lib/inventory";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [itemData, categoryData] = await Promise.all([api("/items"), api("/categories")]);
      setItems(itemData);
      setCategories(categoryData);
      setError("");
    } catch (requestError) { setError(requestError.message); }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const query = search.trim().toLowerCase();
    return (!query || item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query))
      && (!categoryId || String(item.categoryId) === categoryId)
      && (!status || stockStatus(item) === status);
  }), [items, search, categoryId, status]);

  async function deleteItem() {
    if (!pendingDelete) return;
    try {
      await api(`/items/${pendingDelete.id}`, { method: "DELETE" });
      setPendingDelete(null);
      toast.success("Item deleted");
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <PageShell>
      <div className="main">
        <div className="topbar">
          <div><div className="page-title">Inventory</div><div className="page-subtitle">{filtered.length} of {items.length} items</div></div>
          <div className="topbar-actions"><Button render={<Link href="/items/new" />} nativeButton={false}><Plus aria-hidden="true" />Add item</Button></div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="filter-bar">
          <div className="search-input"><Search size={15} aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or SKU" aria-label="Search by name or SKU" /></div>
          <Select value={categoryId || "all"} onValueChange={(value) => setCategoryId(value === "all" ? "" : value)}>
            <SelectTrigger className="filter-select" aria-label="Filter by category"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((category) => <SelectItem value={String(category.id)} key={category.id}>{category.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
            <SelectTrigger className="filter-select" aria-label="Filter by stock status"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="ok">In stock</SelectItem><SelectItem value="low">Low stock</SelectItem><SelectItem value="out">Out of stock</SelectItem></SelectContent>
          </Select>
        </div>
        <Card className="table-card inventory-table p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>SKU</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead><TableHead>Quantity</TableHead><TableHead>Unit cost</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 ? <TableRow><TableCell colSpan={8}><div className="empty-state"><h3>{error ? "Inventory unavailable" : "No items found"}</h3><p>{error ? "Check the API and database connection." : "Try a different search or filter."}</p></div></TableCell></TableRow> : filtered.map((item) => {
                const badge = stockStatusPresentation(item);
                return <TableRow key={item.id}>
                  <TableCell className="cell-primary">{item.name}</TableCell><TableCell className="sku-tag">{item.sku}</TableCell>
                  <TableCell>{item.categoryName ? <Badge variant="outline">{item.categoryName}</Badge> : "—"}</TableCell>
                  <TableCell>{item.location || "—"}</TableCell><TableCell>{item.qty}</TableCell><TableCell>{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell><Badge variant="outline" className={badge.className}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{badge.label}</Badge></TableCell>
                  <TableCell><div className="row-actions"><Button render={<Link href={`/items/${item.id}/edit`} />} nativeButton={false} variant="ghost" size="icon-sm" title="Edit item" aria-label={`Edit ${item.name}`}><Pencil aria-hidden="true" /></Button><Button variant="ghost" size="icon-sm" title="Delete item" aria-label={`Delete ${item.name}`} onClick={() => setPendingDelete(item)}><Trash2 aria-hidden="true" /></Button></div></TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </Card>
        <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete this item?</AlertDialogTitle><AlertDialogDescription>{pendingDelete && `“${pendingDelete.name}” will be removed from inventory. This can't be undone.`}</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><Button variant="destructive" onClick={deleteItem}>Delete</Button></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageShell>
  );
}