import { useState } from "react";
import "./StatusFilter.css"
export default function StatusFilter({ onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const selectMenu = () => setOpen((a) => !a);

  const handleCheckboxChange = (status) => {
    const updated = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];

    setSelected(updated);
    onChange(updated); 
  };

  return (
    <div className="filter-container">
      <button className="filter-btn" onClick={selectMenu}>
        Filter <span className="by-status">by status</span>
        <span>
          {open ? (
            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 6.22803L5.2279 2.00013L9.4558 6.22803" stroke="#7C5DFA" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5.2279 5.2279L9.4558 1" stroke="#7C5DFA" strokeWidth="2" />
            </svg>
          )}
        </span>
      </button>

      {open && (
        <div className="dropdown">
          {["draft", "pending", "paid"].map((status) => (
            <label key={status} className="dropdown-item">
              <input
                type="checkbox"
                checked={selected.includes(status)}
                onChange={() => handleCheckboxChange(status)}
              />
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
