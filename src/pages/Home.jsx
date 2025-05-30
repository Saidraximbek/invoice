import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import StatusFilter from "../components/StatusFilter/StatusFilter";
import AddInvoice from "../components/AddInvoice/AddInvoice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";
import Loader from "../components/Loader/Loader";

const Home = () => {
  const { data, pending, error } = useFetch(
    "https://json-api.uz/api/project/fn36-3/invoices"
  );
  const navigate = useNavigate();
  const dataItem = data?.data || [];

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const filteredData = selectedStatus.length
    ? dataItem.filter((invoice) =>
        selectedStatus.includes(invoice.status || "draft")
      )
    : dataItem;

  if (pending) return <Loader />;
  if (error) return <p>{error}</p>;

  let totalItem = 0
  return (
    <div className="home-container">
      <div className="home-nav">
        <div className="home-titles">
          <h1 className="home-title">Invoices</h1>
          <p className="home-subtitle">
            There are {filteredData.length} filtered invoices
          </p>
          <p className="home-subtitle-mobile">{filteredData.length} invoices</p>
        </div>

        <div className="filter-add">
          <StatusFilter onChange={setSelectedStatus} />
          <button
            className="add-button-invoice"
            onClick={() => setShowAdd(true)}
          >
            <img src="/plus.svg" alt="" />
            <p>
              New <span>Invoice</span>{" "}
            </p>
          </button>
          {showAdd && (
            <AddInvoice
              invoice={filteredData}
              show={showAdd}
              onClose={() => setShowAdd(false)}
            />
          )}
        </div>
      </div>

      <div className="home-content">
        {filteredData.length ? (
          filteredData.map((invoice) => (
            <Link to={`/invoices/${invoice.id}`} key={invoice.id}>
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-infos">
                  <p className="invoise-id">
                    #{invoice.senderAddress?.postCode}
                  </p>
                  <p className="invoise-date">{invoice.createdAt}</p>
                  <p className="invoice-client-name">{invoice.clientName}</p>
                </div>

                <div className="invoice-statuces">
                  <p className="invoice-total">
                    {invoice.items.map((i)=>{
                       totalItem +=i.price*i.quantity
                    })}
                   
                      {`£${totalItem}.00`}
                  </p>
                  <div className="statuce-div">
                    <p
                      className="statuse-content"
                      style={{
                        color:
                          invoice.status === "pending"
                            ? "#FF8F00"
                            : invoice.status === "paid"
                            ? "#33D69F"
                            : "#373B53",
                        backgroundColor:
                          invoice.status === "pending"
                            ? "rgba(255, 143, 0, 0.06)"
                            : invoice.status === "paid"
                            ? "rgba(51, 214, 159, 0.06)"
                            : "rgba(55, 59, 83, 0.06)",
                      }}
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="4"
                          cy="4"
                          r="4"
                          fill={
                            invoice.status === "paid"
                              ? "#33D69F"
                              : invoice.status === "pending"
                              ? "#FF8F00"
                              : "#373B53"
                          }
                        />
                      </svg>
                      {invoice.status === undefined ? "draft" : invoice.status}
                    </p>
                    <img src="./right.svg" alt="right" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="not-found-div">
            <img
              src="./notFound.png"
              alt="not found png"
              width={241}
              height={200}
            />
            <div className="not-found-contend">
              <h2 className="not-found-title">There is nothing here</h2>
              <p className="not-found-subtitle">
                Create an invoice by clicking the New Invoice button and get
                started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
