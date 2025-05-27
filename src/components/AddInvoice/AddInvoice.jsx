import React, { useEffect, useState } from "react";
import "./AddInvoice.css";

const AddInvoice = ({ show, onClose, invoice }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  return (
    <>
      <div className={`AddInvoice-container ${isVisible ? "show" : ""}`}>
        <div className="AddInvoice-content">
          <span className="back AddInvoice-back" onClick={onClose}>
            <img src="/left.svg" alt="left" />
            <p>Go Back</p>
          </span>

          <h2 className="section-title">
            AddInvoice <span>#</span>
            {invoice?.id}
          </h2>

          <h3 className="section-subtitle">Bill From</h3>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input className="input-field" />
          </div>
          <div className="grid-3">
            <div className="input-group">
              <label className="input-label">City</label>
              <input className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">PostCode</label>
              <input className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Country</label>
              <input className="input-field" />
            </div>
          </div>

          <h3 className="section-subtitle">Bill To</h3>
          <div className="input-group">
            <label className="input-label">Client's Name</label>
            <input className="input-field-full input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Client's Email</label>
            <input className="input-field-full input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Street Address</label>
            <input className="input-field-full input-field" />
          </div>
          <div className="grid-3">
            <div className="input-group">
              <label className="input-label">City</label>
              <input className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">PostCode</label>
              <input className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Country</label>
              <input className="input-field" />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Invoice Date</label>
              <input className="input-field" type="date" />
            </div>
            <div className="input-group">
              <label className="input-label">Payment Terms</label>
              <select className="input-field">
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 7 Days">Net 7 Days</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Project Description</label>
            <input className="input-field" />
          </div>

          <h3 className="section-item-list-title">Item List</h3>
          <div className="item-row">
            <input className="input-field" placeholder="Item Name" />
            <input className="input-field" type="number" placeholder="Qty" />
            <input className="input-field" type="number" placeholder="Price" />
            <input className="input-field" type="text" readOnly placeholder="Total" />
            <span className="item-delete">
              <img src="/deletee.svg" alt="delete" />
            </span>
          </div>

          <div className="add-item">+ Add New Item</div>

          <div className="AddInvoice-footer">
            <button className="AddInvoice-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="AddInvoice-save">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div
        className={`AddInvoice-overlay ${isVisible ? "show" : ""}`}
        onClick={onClose}
      ></div>
    </>
  );
};

export default AddInvoice;
