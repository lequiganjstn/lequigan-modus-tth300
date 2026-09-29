"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import PageShell from "../../components/PageShell";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0070f3");
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [categoryData, itemData] = await Promise.all([api("/categories"), api("/items")]);
      setCategories(categoryData);
      setItems(itemData);
      setError("");
    } catch (requestError) { setError(requestError.message); }
  }

  useEffect(() => { load(); }, []);

  function openModal(category = null) {
    setEditing(category);
    setName(category?.name || "");
    setColor(category?.color || "#0070f3");
    setInvalid(false);
    setModalOpen(true);
  }

  async function saveCategory() {
    if (!name.trim()) { setInvalid(true); return; }
    try {
      await api(editing ? `/categories/${editing.id}` : "/categories", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({ name: name.trim(), color }),
      });
      setModalOpen(false);
      toast.success(editing ? "Category updated" : "Category added");
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  async function deleteCategory() {
    if (!pendingDelete) return;
    try {
      await api(`/categories/${pendingDelete.id}`, { method: "DELETE" });
      setPendingDelete(null);
      toast.success("Category deleted");
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <PageShell>
      <div className="main">
        <div className="topbar"><div><div className="page-title">Categories</div><div className="page-subtitle">{categories.length} categories</div></div><div className="topbar-actions"><Button onClick={() => openModal()}><Plus aria-hidden="true" />Add category</Button></div></div>
        {error && <p className="error-message">{error}</p>}
        <div className="category-grid">
          {categories.length === 0 ? <div className="empty-state category-empty"><h3>No categories yet</h3><p>Add a category to start organizing items.</p></div> : categories.map((category) => {
            const count = items.filter((item) => item.categoryId === category.id).length;
            return <Card className="category-card" key={category.id}><CardHeader className="category-card-header"><div className="category-card-top"><div className="category-ident"><span className="category-swatch" style={{ background: category.color }} /><div><div className="category-name">{category.name}</div><div className="category-count">{count} item{count === 1 ? "" : "s"}</div></div></div><div className="category-actions"><Button variant="ghost" size="icon-sm" title="Edit category" aria-label={`Edit ${category.name}`} onClick={() => openModal(category)}><Pencil aria-hidden="true" /></Button><Button variant="ghost" size="icon-sm" title="Delete category" aria-label={`Delete ${category.name}`} onClick={() => setPendingDelete(category)}><Trash2 aria-hidden="true" /></Button></div></div></CardHeader></Card>;
          })}
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle><DialogDescription>Set the category name and color used to organize inventory.</DialogDescription></DialogHeader>
            <div className={`form-field${invalid ? " invalid" : ""}`}>
              <Label htmlFor="category-name">Category name</Label>
              <Input id="category-name" autoFocus value={name} onChange={(event) => { setName(event.target.value); setInvalid(false); }} placeholder="e.g. Electronics" aria-invalid={invalid} />
              {invalid && <span className="field-error">Category name is required.</span>}
            </div>
            <div className="form-field color-field"><Label htmlFor="category-color">Color</Label><Input id="category-color" type="color" className="color-input" value={color} onChange={(event) => setColor(event.target.value)} /></div>
            <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={saveCategory}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete this category?</AlertDialogTitle><AlertDialogDescription>{pendingDelete && (items.some((item) => item.categoryId === pendingDelete.id) ? `“${pendingDelete.name}” has assigned items. Deleting it will leave those items uncategorized.` : `“${pendingDelete.name}” will be removed. This can't be undone.`)}</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><Button variant="destructive" onClick={deleteCategory}>Delete</Button></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageShell>
  );
}