export function stockStatus(item) {
  if (Number(item.qty) <= 0) return "out";
  if (Number(item.qty) <= Number(item.reorderLevel)) return "low";
  return "ok";
}

export function stockStatusPresentation(item) {
  const status = stockStatus(item);
  const presentation = {
    ok: { label: "In stock", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    low: { label: "Low stock", className: "border-amber-200 bg-amber-50 text-amber-800" },
    out: { label: "Out of stock", className: "border-red-200 bg-red-50 text-red-700" },
  };
  return presentation[status];
}

export function formatCurrency(value) {
  return `$${Number(value).toFixed(2)}`;
}