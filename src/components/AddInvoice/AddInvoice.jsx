import React, { useEffect, useState } from "react";
import { addInvoice } from "../../requests";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddInvoice.css";

const AddInvoice = ({ show, onClose, invoice }) => {
  // Modalni ko‘rsatish uchun holat
  const [shouldRender, setShouldRender] = useState(false);

  // Jo‘natuvchi manzili
  const [sender, setSender] = useState({
    street: "",
    city: "",
    postCode: "",
    country: "",
  });

  // Mijoz ma'lumotlari
  const [client, setClient] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
  });

  // Invoice asosiy tafsilotlari
  const [invoiceDetails, setInvoiceDetails] = useState({
    createdAt: "",
    paymentTerms: 30,
    description: "",
  });

  // Itemlar ro‘yxati
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0, total: 0 }]);

  // Xatoliklar uchun holat
  const [errors, setErrors] = useState({});

  // Modal ko‘rsatilishini nazorat qilish (animation uchun)
  useEffect(() => {
    let timeout;
    if (show) {
      setShouldRender(true);
    } else {
      timeout = setTimeout(() => setShouldRender(false), 400);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  // Item ma'lumotlarini o‘zgartirish funksiyasi
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    // jami narxni hisoblash
    newItems[index].total = newItems[index].quantity * newItems[index].price;
    setItems(newItems);
  };

  // Yangi item qo‘shish funksiyasi
  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0, total: 0 }]);
  };

  // Maydonlarni tekshirish
  const validateFields = () => {
    const newErrors = {};

    // Sender uchun tekshirish
    Object.keys(sender).forEach((key) => {
      if (!sender[key]) newErrors[`sender-${key}`] = true;
    });

    // Client uchun tekshirish
    Object.keys(client).forEach((key) => {
      if (!client[key]) newErrors[`client-${key}`] = true;
    });

    // Invoice tafsilotlari uchun
    if (!invoiceDetails.createdAt) newErrors.createdAt = true;
    if (!invoiceDetails.description) newErrors.description = true;

    // Itemlar uchun tekshirish
    items.forEach((item, index) => {
      if (!item.name) newErrors[`item-name-${index}`] = true;
      if (item.quantity <= 0) newErrors[`item-quantity-${index}`] = true;
      if (item.price <= 0) newErrors[`item-price-${index}`] = true;
    });

    setErrors(newErrors);
    // Xatolik bo‘lmasa true qaytaradi
    return Object.keys(newErrors).length === 0;
  };

  // Saqlash funksiyasi
  const handleSave = async (status) => {
    if (!validateFields()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    // Itemlarni formatlash
    const formattedItems = items.map((item) => ({
      id: crypto.randomUUID(),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    // Yangi invoice obyektini yaratish
    const newInvoice = {
      clientAddress: {
        street: client.street,
        city: client.city,
        postCode: client.postCode,
        country: client.country,
      },
      senderAddress: {
        street: sender.street,
        city: sender.city,
        postCode: sender.postCode,
        country: sender.country,
      },
      status,
      clientName: client.name,
      clientEmail: client.email,
      createdAt: invoiceDetails.createdAt,
      paymentTerms: Number(invoiceDetails.paymentTerms),
      description: invoiceDetails.description,
      name: items[0].name,
      quantity: items[0].quantity,
      price: items[0].price,
      items: formattedItems,
      total: formattedItems.reduce((sum, item) => sum + item.total, 0),
    };

    try {
      await addInvoice(newInvoice);
      toast.success("Invoice saved successfully!");
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    }
  };

  if (!shouldRender && !show) return null;

  return (
    <>
      <div className={`AddInvoice-container ${show ? "show" : ""}`}>
        <div className="AddInvoice-content">
          <span className="back AddInvoice-back" onClick={onClose}>
            <img src="/left.svg" alt="left" />
            <p>Go Back</p>
          </span>

          <h2 className="section-title">
            New Invoice 
          </h2>

          <h3 className="section-subtitle">Bill From</h3>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input
              className={`input-field ${errors["sender-street"] ? "error" : ""}`}
              value={sender.street}
              onChange={(e) => setSender({ ...sender, street: e.target.value })}
            />
          </div>

          <div className="grid-3">
            {["city", "postCode", "country"].map((field) => (
              <div className="input-group" key={field}>
                <label className="input-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className={`input-field ${errors[`sender-${field}`] ? "error" : ""}`}
                  value={sender[field]}
                  onChange={(e) => setSender({ ...sender, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <h3 className="section-subtitle">Bill To</h3>
          {["name", "email", "street"].map((field) => (
            <div className="input-group" key={field}>
              <label className="input-label">Client's {field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                className={`input-field ${errors[`client-${field}`] ? "error" : ""}`}
                value={client[field]}
                onChange={(e) => setClient({ ...client, [field]: e.target.value })}
              />
            </div>
          ))}

          <div className="grid-3">
            {["city", "postCode", "country"].map((field) => (
              <div className="input-group" key={field}>
                <label className="input-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className={`input-field ${errors[`client-${field}`] ? "error" : ""}`}
                  value={client[field]}
                  onChange={(e) => setClient({ ...client, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Invoice Date</label>
              <input
                type="date"
                className={`input-field ${errors.createdAt ? "error" : ""}`}
                value={invoiceDetails.createdAt}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, createdAt: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Payment Terms</label>
              <select
                className="input-field"
                value={invoiceDetails.paymentTerms}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, paymentTerms: e.target.value })}
              >
                <option value={7}>Net 7 Days</option>
                <option value={15}>Net 15 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Project Description</label>
            <input
              className={`input-field ${errors.description ? "error" : ""}`}
              value={invoiceDetails.description}
              onChange={(e) => setInvoiceDetails({ ...invoiceDetails, description: e.target.value })}
            />
          </div>

          <h3 className="section-item-list-title">Item List</h3>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                className={`input-field ${errors[`item-name-${index}`] ? "error" : ""}`}
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
              />
              <input
                className={`input-field ${errors[`item-quantity-${index}`] ? "error" : ""}`}
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
              />
              <input
                className={`input-field ${errors[`item-price-${index}`] ? "error" : ""}`}
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
              />
              <input className="input-field" type="text" readOnly value={item.total} placeholder="Total" />
            </div>
          ))}

          <div className="add-item" onClick={handleAddItem}>
            + Add New Item
          </div>

          <div className="AddInvoice-footer">
            <button className="AddInvoice-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="AddInvoice-save" onClick={() => handleSave("draft")}>
              Save as Draft
            </button>
            <button className="AddInvoice-save" onClick={() => handleSave("pending")}>
              Save & Send
            </button>
          </div>
        </div>
      </div>

      <div className={`AddInvoice-overlay ${show ? "show" : ""}`} onClick={onClose}></div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default AddInvoice;
