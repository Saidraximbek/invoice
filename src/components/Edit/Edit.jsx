import React, { useEffect, useState } from "react";
import "./Edit.css";

const Edit = ({ show, onClose, invoice }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientName: "",
    clientEmail: "",
    createdAt: "",
    paymentTerms: "",
    description: "",
    items: [],
  });

  useEffect(() => {
    if (show && invoice) {
      setForm({
        senderAddress: { ...invoice.senderAddress },
        clientAddress: { ...invoice.clientAddress },
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        createdAt: invoice.createdAt.slice(0, 10),
        paymentTerms: invoice.paymentTerms,
        description: invoice.description,
        items: [...invoice.items],
      });

      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, invoice]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = field === "quantity" || field === "price" ? +value : value;
    setForm({ ...form, items: updatedItems });
  };

  const handleItemDelete = (index) => {
    const updatedItems = [...form.items];
    updatedItems.splice(index, 1);
    setForm({ ...form, items: updatedItems });
  };

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to update invoice");

      const updatedInvoice = await response.json();
      console.log("Updated:", updatedInvoice);
      onClose(); 
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  return (
    <>
      <div className={`edit-container ${isVisible ? "show" : ""}`}>
        <div className="edit-content">
          <span className="back edit-back" onClick={onClose}>
            <img src="/left.svg" alt="left" />
            <p>Go Back</p>
          </span>

          <h2 className="section-title">
            Edit <span>#</span>
            {invoice?.id}
          </h2>

          {/* BILL FROM */}
          <h3 className="section-subtitle">Bill From</h3>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input
              className="input-field"
              value={form.senderAddress.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  senderAddress: {
                    ...form.senderAddress,
                    street: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid-3">
            {["city", "postCode", "country"].map((field) => (
              <div className="input-group" key={field}>
                <label className="input-label">{field[0].toUpperCase() + field.slice(1)}</label>
                <input
                  className="input-field"
                  value={form.senderAddress[field]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      senderAddress: {
                        ...form.senderAddress,
                        [field]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* BILL TO */}
          <h3 className="section-subtitle">Bill To</h3>
          <div className="input-group">
            <label className="input-label">Client's Name</label>
            <input
              className="input-field-full input-field"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Client's Email</label>
            <input
              className="input-field-full input-field"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input
              className="input-field-full input-field"
              value={form.clientAddress.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  clientAddress: {
                    ...form.clientAddress,
                    street: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid-3">
            {["city", "postCode", "country"].map((field) => (
              <div className="input-group" key={field}>
                <label className="input-label">{field[0].toUpperCase() + field.slice(1)}</label>
                <input
                  className="input-field"
                  value={form.clientAddress[field]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientAddress: {
                        ...form.clientAddress,
                        [field]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Invoice Date</label>
              <input
                className="input-field"
                type="date"
                value={form.createdAt}
                onChange={(e) =>
                  setForm({ ...form, createdAt: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label className="input-label">Payment Terms</label>
              <select
                className="input-field"
                value={form.paymentTerms}
                onChange={(e) =>
                  setForm({ ...form, paymentTerms: e.target.value })
                }
              >
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 7 Days">Net 7 Days</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Project Description</label>
            <input
              className="input-field"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* ITEM LIST */}
          <h3 className="section-item-list-title">Item List</h3>
          {form.items.map((item, idx) => (
            <div className="item-row" key={idx}>
              <input
                className="input-field"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(idx, "name", e.target.value)
                }
              />
              <input
                className="input-field"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(idx, "quantity", e.target.value)
                }
              />
              <input
                className="input-field"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(idx, "price", e.target.value)
                }
              />
              <input
                className="input-field"
                type="text"
                readOnly
                value={(item.quantity * item.price).toFixed(2)}
              />
              <span
                className="item-delete"
                onClick={() => handleItemDelete(idx)}
              >
                <img src="/deletee.svg" alt="delete" />
              </span>
            </div>
          ))}
          <div className="add-item" onClick={handleAddItem}>
            + Add New Item
          </div>

          <div className="edit-footer">
            <button className="edit-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="edit-save" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div
        className={`edit-overlay ${isVisible ? "show" : ""}`}
        onClick={onClose}
      ></div>
    </>
  );
};

export default Edit;
