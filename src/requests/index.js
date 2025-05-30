const baseUrl = "https://json-api.uz/api/project/fn36-3/invoices";

export async function getInvoices() {
  const res = await fetch(baseUrl);
  if (res.ok) {
    const result = await res.json();
    return result.data;
  } else {
    throw new Error("Fail");
  }
}

export async function getInvoice(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Fail");
  }
}

export async function deleteById(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    return "Successfully deleted";
  } else {
    throw new Error("Fail");
  }
}

export async function updateById(id, newData) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Fail");
  }
}

export async function addInvoice(data) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Fail");
  }
}
