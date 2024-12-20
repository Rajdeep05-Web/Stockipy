import React, { useState } from "react";
import { fetchStockIns } from "../../../redux/slices/stock/stockInSlice";
import { useDispatch, useSelector } from "react-redux";


import Loading from "../Loading/loading";
import SuccessAlert from "../alerts/successAlert";
import ErrorAlert from "../alerts/errorAlert";

const Accordion = () => {
  const items = [
    { id: 1, title: "Accordion Item 1", content: "Content for item 1" },
    { id: 2, title: "Accordion Item 2", content: "Content for item 2" },
    { id: 3, title: "Accordion Item 3", content: "Content for item 3" },
    { id: 4, title: "Accordion Item 4", content: "Content for item 4" },
  ];

  const [openAccordions, setOpenAccordions] = useState({});

  const toggleAccordion = (id) => {
    setOpenAccordions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} id={`accordion-item-${item.id}`} className="mb-4">
          <h2>
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => toggleAccordion(item.id)}
              aria-expanded={openAccordions[item.id] || false}
              aria-controls={`accordion-body-${item.id}`}
            >
              {/* <span>{item.title}</span> */}
              <span>DAte: 12/12/2024</span>
              <span>INV no: 001</span>
              <span>Vendor: Test vendor me</span>
              <span>Amount: 12000</span>
              <span>GST: NA</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 ${
                  openAccordions[item.id] ? "rotate-180" : ""
                } transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          {openAccordions[item.id] && (
            <div
              id={`accordion-body-${item.id}`}
              className="p-5 border border-gray-200 bg-slate-100 rounded-b-lg  dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
