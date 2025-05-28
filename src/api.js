const baseUrl = "https://json-api.uz/api/project/fn35/invoices";

// Barcha invoicesni olish
export async function getInvoices() {
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  const result = await res.json();
  return result.data;
}

// Bitta invoice ma'lumotini olish
export async function getInvoice(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch invoice");
  return await res.json();
}

// Invoice qo‘shish
export async function addInvoice(data) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add invoice");
  return await res.json();
}

// Invoice yangilash (PATCH)
export async function updateById(id, newData) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error("Failed to update invoice");
  return await res.json();
}

// Invoice o‘chirish
export async function deleteById(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete invoice");
  return "Successfully deleted";
}
