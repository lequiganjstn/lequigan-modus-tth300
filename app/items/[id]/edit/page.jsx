"use client";

import { useParams } from "next/navigation";
import ItemForm from "../../../../components/ItemForm";

export default function EditItemPage() {
  const params = useParams();
  return <ItemForm itemId={params.id} />;
}