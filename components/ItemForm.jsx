"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageShell from "./PageShell";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const blankForm = { name: "", sku: "", categoryId: "", qty: "", reorderLevel: "0", unitCost: "", location: "" };

export default function ItemForm({ itemId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const editing = Boolean(itemId);

  useEffect(() => {
    Promise.all([api("/categories"), editing ? api(`/items/${itemId}`) : Promise.resolve(null)])
      .then(([categoryData, item]) => {
        setCategories(categoryData);
        if (item) setForm({ ...item, categoryId: item.categoryId == null ? "" : String(item.categoryId), qty: String(item.qty), reorderLevel: String(item.reorderLevel), unitCost: String(item.unitCost), location: item.location || "" });
      })
      .catch((requestError) => setError(requestError.message));
  }, [editing, itemId]);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: false }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {
      name: !form.name.trim(),
      sku: !form.sku.trim(),
      qty: form.qty === "" || Number(form.qty) < 0,
      unitCost: form.unitCost === "" || Number(form.unitCost) < 0,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const payload = {
      ...form,
      name: form.name.trim(), sku: form.sku.trim(),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      qty: Number(form.qty), reorderLevel: Number(form.reorderLevel || 0),
      unitCost: Number(form.unitCost), location: form.location.trim(),
    };
    try {
      await api(editing ? `/items/${itemId}` : "/items", { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) });
      toast.success(editing ? "Item updated" : "Item added");
      router.push("/inventory");
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <PageShell>
      <div className="main">
        <div className="topbar"><div><div className="page-title">{editing ? "Edit item" : "Add item"}</div><div className="page-subtitle">{editing ? `Update ${form.name || "inventory item"}` : "Add a new item to inventory"}</div></div></div>
        {error && <p className="error-message">{error}</p>}
        <Card className="form-card">
          <form onSubmit={submit} noValidate>
            <CardContent className="form-card-content">
              <div className="form-grid">
                <Field id="name" label="Item name" invalid={errors.name} error="Item name is required." full><Input id="name" value={form.name} onChange={(event) => change("name", event.target.value)} placeholder="e.g. Wireless Mouse M185" aria-invalid={Boolean(errors.name)} /></Field>
                <Field id="sku" label="SKU" invalid={errors.sku} error="SKU is required."><Input id="sku" value={form.sku} onChange={(event) => change("sku", event.target.value)} placeholder="e.g. ELE-1042" aria-invalid={Boolean(errors.sku)} /></Field>
                <Field id="categoryId" label="Category">
                  <Select value={form.categoryId || "none"} onValueChange={(value) => change("categoryId", value === "none" ? "" : value)}>
                    <SelectTrigger id="categoryId" className="w-full"><SelectValue placeholder="No category" /></SelectTrigger>
                    <SelectContent><SelectItem value="none">No category</SelectItem>{categories.map((category) => <SelectItem value={String(category.id)} key={category.id}>{category.name}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field id="qty" label="Quantity" invalid={errors.qty} error="Enter a quantity of 0 or more."><Input id="qty" type="number" min="0" step="1" value={form.qty} onChange={(event) => change("qty", event.target.value)} placeholder="0" aria-invalid={Boolean(errors.qty)} /></Field>
                <Field id="reorderLevel" label="Reorder level"><Input id="reorderLevel" type="number" min="0" step="1" value={form.reorderLevel} onChange={(event) => change("reorderLevel", event.target.value)} /><span className="hint">Flagged as low stock at or below this.</span></Field>
                <Field id="unitCost" label="Unit cost" invalid={errors.unitCost} error="Enter a valid cost."><div className="input-prefix"><span>$</span><Input id="unitCost" className="pl-7" type="number" min="0" step="0.01" value={form.unitCost} onChange={(event) => change("unitCost", event.target.value)} placeholder="0.00" aria-invalid={Boolean(errors.unitCost)} /></div></Field>
                <Field id="location" label="Storage location"><Input id="location" value={form.location} onChange={(event) => change("location", event.target.value)} placeholder="e.g. A1-03" /></Field>
              </div>
              <div className="form-actions"><Button render={<Link href="/inventory" />} nativeButton={false} variant="outline">Cancel</Button><Button type="submit">{editing ? "Save changes" : "Add item"}</Button></div>
            </CardContent>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}

function Field({ id, label, invalid, error, full, children }) {
  return <div className={`form-field${full ? " full" : ""}` }><Label htmlFor={id}>{label}</Label>{children}{invalid && error && <span className="field-error">{error}</span>}</div>;
}