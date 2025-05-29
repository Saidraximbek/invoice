import React from "react";
import "./ConfirmModalDelete.css";

const ConfirmModalDelete = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Siz rostdan ham ushbu invoice ni o'chirmoqchimisiz?</h3>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Bekor qilish
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModalDelete;
