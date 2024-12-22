import React, { useState } from "react";
import { fetchStockIns } from "../../../redux/slices/stock/stockInSlice";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../Loading/loading";
import SuccessAlert from "../alerts/successAlert";
import ErrorAlert from "../alerts/errorAlert";

const Accordion = () => {
  const { stockIns, loading, error } = useSelector((state) => state.stockIns);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  const convertUTC = (dataFromBackend) => {
    const utcDate = new Date(dataFromBackend);
    const istDateString = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
    }).format(utcDate);
    return istDateString;
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorAlert errorMsg={errorMsg} />;
  }
  if (successMsg) {
    return <SuccessAlert successMsg={successMsg} />;
  }

  return (
    <div>
      {stockIns.map((item) => (
        <div key={item._id} id={`accordion-item-${item._id}`} className="mb-4">
          <h2>
            <button
              type="button"
              className="flex gap-1 items-center justify-between w-full p-5 font-medium sm:text-sm md:text-base text-gray-500 bg-green-100 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-gray-800"
              onClick={() => toggleAccordion(item._id)}
              aria-expanded={openAccordions[item._id] || false}
              aria-controls={`accordion-body-${item._id}`}
            >
              <span className="w-full md:w-1/5 flex justify-start items-center mr-3">
                <h4 className="font-bold text-gray-600">Date:</h4>
                &nbsp;
                {convertUTC(item.date)}
              </span>
              <span className="w-full md:w-1/5 flex justify-start items-center  mr-3">
                <h4 className="font-bold text-gray-600">INV no:</h4>
                &nbsp;
                {item.invoiceNo}
              </span>
              <span className="w-full md:w-2/5 flex justify-start items-center mr-3">
                <h4 className="font-bold text-gray-600">Vendor:</h4>
                &nbsp;
                {item.vendor.name}
              </span>
              <span className="w-full md:w-1/5 flex justify-start items-center mr-3">
                <h4 className="font-bold text-gray-600">Amount:</h4>
                &nbsp;
                {item.totalAmount}
              </span>
              <span className="w-full md:w-2/5 flex justify-start items-center mr-3">
                <h4 className="font-bold text-gray-600">GST:</h4>
                &nbsp;
                {item.vendor.gstNo}
              </span>
              <svg
                data-accordion-icon
                className={`w-6 h-6 ${
                  openAccordions[item._id] ? "rotate-180" : ""
                } transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>

          </h2>
          {openAccordions[item._id] && (
            <div
              id={`accordion-body-${item._id}`}
              className="p-5 border border-gray-200 bg-slate-100 rounded-b-lg  dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400">
                {item.content || ""}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
