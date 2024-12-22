import React, { useState } from "react";
import { fetchStockIns } from "../../../redux/slices/stock/stockInSlice";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../Loading/loading";
import SuccessAlert from "../alerts/successAlert";
import ErrorAlert from "../alerts/errorAlert";
import { Product } from "../../../../../server/src/models/productModel";

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
              className="flex w-full p-3 font-medium text-xs md:text-sm lg:text-base text-gray-500 bg-green-100 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-gray-800"
              onClick={() => toggleAccordion(item._id)}
              aria-expanded={openAccordions[item._id] || false}
              aria-controls={`accordion-body-${item._id}`}
            >
              <div className="flex basis-7/12 w-full gap-2">
                <div className="flex-1">
                  <span className=" flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">Date:</h4>
                    &nbsp;
                    {convertUTC(item.date)}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">INV no:</h4>
                    &nbsp;
                    {item.invoiceNo}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center">
                    <h4 className="font-bold text-gray-600">Vendor:</h4>
                    &nbsp;
                    {item.vendor.name}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="flex basis-1/5 justify-start items-center">
                    <h4 className="font-bold text-gray-600">Amount:</h4>
                    &nbsp;
                    {item.totalAmount}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center">
                    <h4 className="font-bold text-gray-600">GST:</h4>
                    &nbsp;
                    {item.vendor.gstNo}
                  </span>
                </div>
              </div>
              <div className=" basis-4/12">
                {" "}
                <span className="w-full flex">
                  <h4 className="font-bold text-gray-600">Description:</h4>
                  &nbsp;
                  {item.description}
                </span>
              </div>
              <div className="flex flex-col justify-between items-center gap-2 basis-1/12 w-full">
                <svg
                  data-accordion-icon
                  className={`w-3 h-3 ${
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
                </svg>{" "}
                <button
                  type="button"
                  onClick={() => handleSubmitStockIn()}
                  class="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg md:text-sm w-full sm:text-xs sm:w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Download
                </button>
              </div>
            </button>
          </h2>
          {openAccordions[item._id] && (
            <div
              id={`accordion-body-${item._id}`}
              className="p-5 border border-gray-200 bg-slate-100 rounded-b-lg  dark:border-gray-700"
            >
              <h4 class="text-2xl font-bold dark:text-white">Details:</h4>
              {/* small details */}
              {/* <div className="mt-2">
              <span className=" flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">Date:</h4>
                    &nbsp;
                    {convertUTC(item.date)}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">INV no:</h4>
                    &nbsp;
                    {item.invoiceNo}
                  </span>
              </div> */}
              {/* product and vendor details */}
              <div className="flex flex-row gap-2 mt-2 mx-4">
                <div className="flex flex-col basis-1/2 border border-gray-300 dark:border-gray-700 rounded-lg p-2">
                  <h6 class="text-lg font-bold dark:text-white">VENDOR</h6>
                  <hr class="h-px my-1 bg-gray-300 border-0 dark:bg-gray-700"></hr>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">Name:</h4>
                    &nbsp;
                    {item.vendor.name || "NA"}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">Email:</h4>
                    &nbsp;
                    {item.vendor.email || "NA"}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">Phone No:</h4>
                    &nbsp;
                    {item.vendor.phone || "NA"}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">Address:</h4>
                    &nbsp;
                    {item.vendor.address || "NA"}
                  </span>
                  <span className="flex basis-1/5 justify-start items-center ">
                    <h4 className="font-bold text-gray-600">GST No:</h4>
                    &nbsp;
                    {item.vendor.gstNo || "NA"}
                  </span>
                </div>

                <div className=" flex flex-col basis-1/2 border border-gray-300 dark:border-gray-700 rounded-lg p-2">
                  <h6 class="text-lg font-bold dark:text-white">PRODUCT</h6>
                  <hr class="h-px my-1 bg-gray-300 border-0 dark:bg-gray-700"></hr>
                  {item.products.map((product) => (
                    <div className="flex justify-between">
                      <span className="flex basis-4/5 justify-start items-center ">
                        <h4 className="font-medium text-gray-600">
                          {item.products.indexOf(product)+1}{")"}
                           &nbsp;
                          {product.product.name}
                        </h4>
                      </span>
                      <span className="flex basis-1/5 justify-start items-center ">
                        <h4 className="font-bold text-gray-600">
                        {"x "}{product.quantity}
                        </h4>
                        {/* &nbsp; */}
                      </span>
                    </div>
                  ))}
                  {/* {console.log(item.products)} */}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
