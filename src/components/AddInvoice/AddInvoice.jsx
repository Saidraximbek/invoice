import React, { useEffect, useState } from "react";
import { addInvoice } from "../../requests";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddInvoice.css";

const AddInvoice = ({ show, onClose, invoice }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [sender, setSender] = useState({
    street: "",
    city: "",
    postCode: "",
    country: "",
  });
  const [client, setClient] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
  });
  const [invoiceDetails, setInvoiceDetails] = useState({
    createdAt: "",
    paymentTerms: 30,
    description: "",
  });
  const [items, setItems] = useState([
    { name: "", quantity: 0, price: 0, total: 0 },
  ]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let timeout;
    if (show) setShouldRender(true);
    else timeout = setTimeout(() => setShouldRender(false), 400);
    return () => clearTimeout(timeout);
  }, [show]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].total = newItems[index].quantity * newItems[index].price;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 0, price: 0, total: 0 }]);
  };

  const handleDeleteItem = (indexToRemove) => {
    const updatedItems = items.filter((_, index) => index !== indexToRemove);
    setItems(updatedItems);
  };

  const validateFields = () => {
    const newErrors = {};

    for (const key in sender) {
      if (!sender[key]) newErrors[`sender-${key}`] = true;
    }

    for (const key in client) {
      if (!client[key]) newErrors[`client-${key}`] = true;
    }

    if (!invoiceDetails.createdAt) newErrors.createdAt = true;
    if (!invoiceDetails.description) newErrors.description = true;

    items.forEach((item, i) => {
      if (!item.name) newErrors[`item-name-${i}`] = true;
      if (item.quantity <= 0) newErrors[`item-quantity-${i}`] = true;
      if (item.price <= 0) newErrors[`item-price-${i}`] = true;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status) => {
    if (!validateFields()) {
      toast.error("Write all inputs!");
      return;
    }

    const formattedItems = items.map((item) => ({
      id: crypto.randomUUID(),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

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
      items: formattedItems,
      total: formattedItems.reduce((sum, item) => sum + item.total, 0),
    };

    try {
      await addInvoice(newInvoice);
      toast.success("Success");
      onClose();
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  };

  if (!shouldRender && !show) return null;

  return (
    <>
      <div className={`AddInvoice-container ${show ? "show" : ""}`}>
        <div className="AddInvoice-content">
          <span className="AddInvoice-back" onClick={onClose}>
            <img src="/left.svg" alt="left" />
            <p>Go Back</p>
          </span>

          <h2 className="section-title">New Invoice</h2>

          <h3 className="section-subtitle">Bill From</h3>
          <div className="input-group">
            <label className="input-label">
              Street Address
              {errors["sender-street"] && (
                <span className="error-text"> can't be empty</span>
              )}
            </label>
            <input
              className={`input-field ${
                errors["sender-street"] ? "error" : ""
              }`}
              value={sender.street}
              onChange={(e) => setSender({ ...sender, street: e.target.value })}
            />
          </div>

          <div className="grid-3">
            <div className="input-group">
              <label className="input-label">
                <span className="input-label-title">city</span>
                {errors["sender-city"] && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                className={`input-field ${
                  errors["sender-city"] ? "error" : ""
                }`}
                value={sender.city}
                onChange={(e) => setSender({ ...sender, city: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="input-label-title">postCode</span>
                {errors["sender-postCode"] && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                className={`input-field ${
                  errors["sender-postCode"] ? "error" : ""
                }`}
                value={sender.postCode}
                onChange={(e) =>
                  setSender({ ...sender, postCode: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="input-label-title">country</span>
                {errors["sender-country"] && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                className={`input-field ${
                  errors["sender-country"] ? "error" : ""
                }`}
                value={sender.country}
                onChange={(e) =>
                  setSender({ ...sender, country: e.target.value })
                }
              />
            </div>
          </div>

          <h3 className="section-subtitle">Bill To</h3>
          <div className="input-group">
            <label className="input-label">
              <span className="input-label-title">name</span>
              {errors["client-name"] && (
                <span className="error-text"> can't be empty</span>
              )}
            </label>
            <input
              className={`input-field ${errors["client-name"] ? "error" : ""}`}
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="input-label-title">email</span>
              {errors["client-email"] && (
                <span className="error-text"> can't be empty</span>
              )}
            </label>
            <input
              className={`input-field ${errors["client-email"] ? "error" : ""}`}
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="input-label-title">street</span>
              {errors["client-street"] && (
                <span className="error-text"> can't be empty</span>
              )}
            </label>
            <input
              className={`input-field ${
                errors["client-street"] ? "error" : ""
              }`}
              value={client.street}
              onChange={(e) => setClient({ ...client, street: e.target.value })}
            />
          </div>

          <div className="grid-3">
            <div className="input-group">
              <label className="input-label">
                <span className="input-label-title">city</span>
                {errors["client-city"] && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                className={`input-field ${
                  errors["client-city"] ? "error" : ""
                }`}
                value={client.city}
                onChange={(e) => setClient({ ...client, city: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="input-label-title">postCode</span>
                {errors["client-postCode"] && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                className={`input-field ${
                  errors["client-postCode"] ? "error" : ""
                }`}
                value={client.postCode}
                onChange={(e) =>
                  setClient({ ...client, postCode: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="input-label-title">country</span>
                {errors["client-country"] && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                className={`input-field ${
                  errors["client-country"] ? "error" : ""
                }`}
                value={client.country}
                onChange={(e) =>
                  setClient({ ...client, country: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">
                Invoice Date
                {errors.createdAt && (
                  <span className="error-text"> can't be empty</span>
                )}
              </label>
              <input
                type="date"
                className={`input-field ${errors.createdAt ? "error" : ""}`}
                value={invoiceDetails.createdAt}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    createdAt: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-group">
              <label className="input-label">Payment Terms</label>
              <select
                className="input-field"
                value={invoiceDetails.paymentTerms}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    paymentTerms: e.target.value,
                  })
                }
              >
                <option value={1}>Net 1 Days</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              Project Description
              {errors.description && (
                <span className="error-text"> can't be empty</span>
              )}
            </label>
            <input
              className={`input-field ${errors.description ? "error" : ""}`}
              value={invoiceDetails.description}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  description: e.target.value,
                })
              }
            />
          </div>

          <h3 className="section-item-list-title">Item List</h3>
          <div className="section-item-list-subtitles">
            <p>Item Name</p>
            <p>Qty.</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                className={`input-field ${
                  errors[`item-name-${index}`] ? "error" : ""
                }`}
                placeholder="Item Name"
                value={item.name === 0 ? "" : item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
              />
              <input
                className={`input-field ${
                  errors[`item-quantity-${index}`] ? "error" : ""
                }`}
                type="number"
                placeholder="Qty"
                value={item.quantity === 0 ? "" : item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
              />
              <input
                className={`input-field ${
                  errors[`item-price-${index}`] ? "error" : ""
                }`}
                type="number"
                placeholder="Price"
                value={item.price === 0 ? "" : item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", Number(e.target.value))
                }
              />
              <input
                className="input-field"
                type="text"
                readOnly
                value={item.total}
                placeholder="Total"
              />

              {items.length > 1 ? (
                <img
                  src="/deletee.svg"
                  alt="Delete"
                  onClick={() => handleDeleteItem(index)}
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

          <div className="add-item" onClick={handleAddItem}>
            + Add New Item
          </div>

          <div className="AddInvoice-footer">
            <button className="AddInvoice-cancel" onClick={onClose}>
              Discard
            </button>
            <div className="add-invoice-second">
              <button
                className="AddInvoice-save AddInvoice-save-draft"
                onClick={() => handleSave("draft")}
              >
                Save as Draft
              </button>
              <button
                className="AddInvoice-save"
                onClick={() => handleSave("pending")}
              >
                Save & Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`AddInvoice-overlay ${show ? "show" : ""}`}
        onClick={onClose}
      ></div>

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
