import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import StatusFilter from "../components/StatusFilter/StatusFilter";
import AddInvoice from "../components/AddInvoice/AddInvoice";
import "./Home.css";

function formatDueDate(dateStr, minusDays = 0) {
  const isValidDate = (d) => {
    const date = new Date(d);
    return d && !isNaN(date) && /^\d{4}-\d{2}-\d{2}$/.test(d);
  };

  let date = isValidDate(dateStr) ? new Date(dateStr) : new Date("2021-01-01");
  date.setDate(date.getDate() - minusDays);

  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formatted = date.toLocaleDateString("en-GB", options);

  return `Due ${formatted}`;
}

const Home = () => {
  const { data, pending, error } = useFetch(
    "https://json-api.uz/api/project/fn35/invoices"
  );
  const dataItem = data?.data || [];

  const [selectedStatus, setSelectedStatus] = useState([]);

  const filteredData = selectedStatus.length
    ? dataItem.filter((invoice) => selectedStatus.includes(invoice.status || "draft"))
    : dataItem;

  if (pending) return <h2>Loading...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
      <div className="home-nav">
        <div className="home-titles">
          <h1 className="home-title">Invoices</h1>
          <p className="home-subtitle">
            There are {filteredData.length} filtered invoices
          </p>
          <p className="home-subtitle-mobile">
            {filteredData.length} invoices
          </p>
        </div>

        <div className="filter-add">
          <StatusFilter onChange={setSelectedStatus} />
          <AddInvoice />
        </div>
      </div>

      <div className="home-content">
        {filteredData.length ? (
          filteredData.map((invoice) => (
            <div key={invoice.id} className="invoice-item">
              <div className="invoice-infos">
                <p className="invoise-id">#{invoice.id}</p>
                <p className="invoise-date">
                  {formatDueDate(invoice.createdAt)}
                </p>
                <p className="invoice-client-name">{invoice.clientName}</p>
              </div>

              <div className="invoice-statuces">
                <p className="invoice-total">
                  {Number.isInteger(invoice.total)
                    ? `£${invoice.total}.00`
                    : `£${invoice.total}`}
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
          ))
        ) : (
          <p>No invoices found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
