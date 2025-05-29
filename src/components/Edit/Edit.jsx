import React, { useEffect, useState } from "react";
import { updateById } from "../../requests";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Edit.css";

const Edit = ({ show, onClose, invoice }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    senderAddress: { street: "", city: "", postCode: "", country: "" },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
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
        clientName: invoice.clientName || "",
        clientEmail: invoice.clientEmail || "",
        createdAt: invoice.createdAt ? invoice.createdAt.slice(0, 10) : "",
        paymentTerms: invoice.paymentTerms || "",
        description: invoice.description || "",
        items: invoice.items ? [...invoice.items] : [],
      });
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, invoice]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? +value : value;
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
      await updateById(invoice.id, form);
      toast.success("Successfully updated");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update invoice");
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
            {invoice?.senderAddress.postCode}
          </h2>

          <h3 className="section-subtitle">Bill From</h3>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input
              className="input-field"
              value={form.senderAddress.street || ""}
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
                <label className="input-label">{field}</label>
                <input
                  className="input-field"
                  value={form.senderAddress[field] || ""}
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

          <h3 className="section-subtitle">Bill To</h3>
          <div className="input-group">
            <label className="input-label">Client Name</label>
            <input
              className="input-field"
              value={form.clientName || ""}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Client Email</label>
            <input
              className="input-field"
              value={form.clientEmail || ""}
              onChange={(e) =>
                setForm({ ...form, clientEmail: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input
              className="input-field"
              value={form.clientAddress.street || ""}
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
                <label className="input-label">{field}</label>
                <input
                  className="input-field"
                  value={form.clientAddress[field] || ""}
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
                value={form.createdAt || ""}
                onChange={(e) =>
                  setForm({ ...form, createdAt: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label className="input-label">Payment Terms</label>
              <select
                className="input-field"
                value={form.paymentTerms || ""}
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
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <h3>Item List</h3>
          <div className="section-item-list-subtitles">
            <p>Item Name</p>
            <p>Qty.</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          {form.items.map((item, id) => (
            <div className="item-row" key={id}>
              <input
                className="input-field"
                value={item.name || ""}
                onChange={(e) => handleItemChange(id, "name", e.target.value)}
              />
              <input
                className="input-field"
                type="number"
                value={item.quantity || 0}
                onChange={(e) =>
                  handleItemChange(id, "quantity", e.target.value)
                }
              />
              <input
                className="input-field"
                type="number"
                value={item.price || 0}
                onChange={(e) => handleItemChange(id, "price", e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                readOnly
                value={(item.quantity * item.price).toFixed(2)}
              />
              {form.items.length > 1 ? (
                <img
                  src="/deletee.svg"
                  alt="Delete"
                  onClick={() => handleItemDelete(id)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <img
                  src="/deletee.svg"
                  alt="Delete"
                  onClick={() =>
                    toast.error("There must be at least one item!!!!!!!")
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          ))}
          <button className="add-item" onClick={handleAddItem}>
            + Add Item
          </button>

          <div className="edit-footer">
            <button onClick={onClose} className="AddInvoice-cancel">
              Cancel
            </button>
            <button onClick={handleSaveChanges} className="AddInvoice-save">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div
        className={`edit-overlay ${isVisible ? "show" : ""}`}
        onClick={onClose}
      ></div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Edit;
