import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import "./Invoice.css";
import Loader from "../components/Loader/Loader";
import Edit from "../components/Edit/Edit";
import { toast } from "react-toastify";

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [edit, setEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);
  const { data, pending, error, refetch } = useFetch(
    `https://json-api.uz/api/project/fn36-3/invoices/${id}`
  );

  useEffect(() => {
    if (data && data.items) {
      const totalAll = data.items.reduce((acc, item) => {
        return acc + item.quantity * item.price;
      }, 0);
      setTotal(totalAll);
    }
  }, [data]);

  const markAsPaid = async () => {
    setMarking(true);
    try {
      const response = await fetch(
        `https://json-api.uz/api/project/fn36-3/invoices/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "paid" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error");
      }

      await refetch();
      toast.success("Success");
    } catch (err) {
      console.error(err.message);
      toast.error("Error: " + err.message);
    } finally {
      setMarking(false);
    }
  };

  const deleteInvoice = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `https://json-api.uz/api/project/fn36-3/invoices/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error");
      }

      toast.success("Delete success");
      navigate("/");
    } catch (err) {
      console.error(err.message);
      toast.error("Xatolik: " + err.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (pending) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!data) return <p>Not Invoice</p>;

  return (
    <div className="invoice-container">
      {edit && (
        <Edit invoice={data} onClose={() => setEdit(false)} show={edit} />
      )}

      <Link to={"/"} className="back">
        <img src="/left.svg" alt="left" />
        <p>Go Back</p>
      </Link>

      <div className="invoice-content">
        <div className="invoice-functions">
          <div className="invoice-status">
            <span className="invoice-status-title">Status</span>
            <p
              className="statuse-content invoice-status-info"
              style={{
                color:
                  data.status === "pending"
                    ? "#FF8F00"
                    : data.status === "paid"
                    ? "#33D69F"
                    : "#373B53",
                backgroundColor:
                  data.status === "pending"
                    ? "rgba(255, 143, 0, 0.06)"
                    : data.status === "paid"
                    ? "rgba(51, 214, 159, 0.06)"
                    : "rgba(55, 59, 83, 0.06)",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle
                  cx="4"
                  cy="4"
                  r="4"
                  fill={
                    data.status === "paid"
                      ? "#33D69F"
                      : data.status === "pending"
                      ? "#FF8F00"
                      : "#373B53"
                  }
                />
              </svg>
              {data.status === undefined ? "draft" : data.status}
            </p>
          </div>

          <div className="invoice-change invoice-change-desktop">
            <button className="invoice-edit" onClick={() => setEdit(true)}>
              Edit
            </button>
            <button
              className="invoice-delete"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
            {data.status === "paid" ? (
              <button disabled className="invoice-mark-paid disabled-mark">
                Paid
              </button>
            ) : (
              <button
                className={`invoice-mark-paid ${
                  marking ? "disabled-mark" : ""
                }`}
                onClick={markAsPaid}
                disabled={marking}
              >
                {marking ? "Loading..." : "Mark as Paid"}
              </button>
            )}
          </div>
        </div>

        <div className="invoice-change invoice-change-mobile">
          <button className="invoice-edit" onClick={() => setEdit(true)}>
            Edit
          </button>
          <button
            className="invoice-delete"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
          <button className="invoice-mark-paid" onClick={markAsPaid}>
            Mark as Paid
          </button>
        </div>

        <div className="invoice-all-infos">
          <div className="invoice-all-info-id-loc">
            <div className="invoice-id-type">
              <h2 className="invoice-all-id">
                <span>#</span>
                {data.senderAddress?.postCode}
              </h2>
              <p className="invoice-all-desc">{data.description}</p>
            </div>
            <div className="invoice-all-loc">
              <p>{data.senderAddress?.street}</p>
              <p>{data.senderAddress?.city}</p>
              <p>{data.senderAddress?.postCode}</p>
              <p>{data.senderAddress?.country}</p>
            </div>
          </div>

          <div className="invoice-payment-infos">
            <div className="invoice-payment-data">
              <div className="invoice-payment-data-content">
                <p className="invoice-payment-data-title">Invoice Date</p>
                <p className="invoice-payment-data-date">{data.createdAt}</p>
              </div>
              <div className="invoice-payment-data-content">
                <p className="invoice-payment-data-title">Payment Date</p>
                <p className="invoice-payment-data-date">{data.paymentDue}</p>
              </div>
            </div>

            <div className="invoice-payment-client invoice-payment-data-content">
              <p className="invoice-payment-data-title">Bill To</p>
              <p className="invoice-payment-data-date">{data.clientName}</p>
              <div className="invoice-all-loc invoice-all-client-loc">
                <p>{data.clientAddress?.street}</p>
                <p>{data.clientAddress?.city}</p>
                <p>{data.clientAddress?.postCode}</p>
                <p>{data.clientAddress?.country}</p>
              </div>
            </div>

            <div className="invoice-payment-data-content">
              <p className="invoice-payment-data-title">Sent To</p>
              <p className="invoice-payment-data-date">{data.clientEmail}</p>
            </div>
          </div>

          <div className="invoice-all-items">
            <div className="invoice-all-items-counts">
              <div className="invoice-all-items-counts-names">
                <p className="invoice-all-items-counts-titles">Item Name</p>
                <div className="invoice-all-items-counts-names-second">
                  <p className="invoice-all-items-counts-titles">QTY.</p>
                  <p className="invoice-all-items-counts-titles">Price</p>
                  <p className="invoice-all-items-counts-titles">Total</p>
                </div>
              </div>
              {data.items?.map((i, idx) => (
                <div className="invoice-all-items-item" key={idx}>
                  <p className="invoice-all-items-item-name">{i.name}</p>
                  <div className="invoice-all-items-item-count-price">
                    <p className="item-qyt">{i.quantity}</p>
                    <p className="item-qyt">£{i.price}.00</p>
                    <p className="item-qyt-total">£{i.quantity * i.price}.00</p>
                  </div>

                  <div className="invoice-all-items-item-count-price-mobile">
                    <div className="invoice-name-mob-div">
                      <p className="invoice-all-items-item-name-mob">
                        {i.name}
                      </p>
                      <p>
                        {i.quantity}x£{i.price}.00
                      </p>
                    </div>
                    <p className="item-qyt-total">£{i.quantity * i.price}.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">Confirm Deletion</h3>
                <p className="modal-subtitle">
                  Are you sure you want to delete invoice #
                  {data.senderAddress.postCode} This action cannot be undone.
                </p>
                <div className="modal-buttons">
                  <button
                    className="invoice-edit modal-btns"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="invoice-delete modal-btns"
                    onClick={deleteInvoice}
                    disabled={deleting}
                  >
                    {deleting ? "Delete..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="items-over-total">
            <p>Amount Due</p>
            <h2>{Number.isInteger(total) ? `£${total}.00` : `£${total}`}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
