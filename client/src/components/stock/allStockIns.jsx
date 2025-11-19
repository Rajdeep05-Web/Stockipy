import React, { useEffect, useState, useRef } from "react";
import {
  ListCollapse,
  Download,
  Trash,
  Eye,
  Edit,
} from "lucide-react";
import {useNavigate} from "react-router";
import { PDFDownloadLink } from "@react-pdf/renderer";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "../useful/datePickerReact"
import { StockInPDF } from "../pdf/stockInPdf";
import { fetchStockIns, deleteStockIn } from "../../redux/slices/stock/stockInSlice";
import { fetchProducts } from "../../redux/slices/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../useful/Loading/loading";
import SearchBar from "../useful/searchBar";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";

const AllStockIns = () => {
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stockIns, loading, error } = useSelector((state) => state.stockIns);
  const { products } = useSelector(state => state.products);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  const [filteredStockIns, setFilteredStockIns] = useState([]);
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const [dateReset, setDateReset] = useState(false);

   const [selectedProduct, setSelectedProduct] = useState("");

  const [openAccordions, setOpenAccordions] = useState({});
  const [collapseAll, setCollapseAll] = useState(false);
 
  useEffect(() => {
    if(stockIns.length == Object.entries(openAccordions).length){
      setCollapseAll(true);
    }
  }, [stockIns, openAccordions]);

  useEffect(() => {
    //setting stockin, when stockin data loads
    if (stockIns) {
      setFilteredStockIns(stockIns.filter((item) => {
        return item;
      }));
    }
  }, [stockIns]);

// fetch prods in page load
  useEffect(() => {
    dispatch(fetchProducts());
  }, [])

  const toggleAccordion = (id) => {
    setOpenAccordions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const collapseAllFunction = () => {
    setCollapseAll(!collapseAll);
    if (!collapseAll) {
      let openAccordionsObj = {};
      stockIns.map((item) => {
        openAccordionsObj[item._id] = true;
      });
      setOpenAccordions(openAccordionsObj);
    } else {
      setOpenAccordions({});
    }
  };

  const convertUTC = (dataFromBackend) => {
    const utcDate = new Date(dataFromBackend);
    const istDateString = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
    }).format(utcDate);
    return istDateString;
  };

  const handleOpenInvoice = (url) => {
    window.open(url, "_blank"); // Open the invoice in a new tab
  };

  const handleEditStockIn = (stockIn) => {
    const userResponse = window.confirm(`Are you sure you want to edit stock-in with invoice no. ${stockIn.invoiceNo}?`);
    if(userResponse){
      navigate(`/stock-in/edit/${stockIn._id}`);
    }
  }

  const handleDeleteStockIn = async (stockIn) => {
    const userResponse = window.confirm(`Are you sure you want to delete stock-in with invoice no. ${stockIn.invoiceNo}?`);
    if(userResponse){
      // Delete the stock-in
      await dispatch(deleteStockIn({id: stockIn._id})).unwrap();
      dispatch(fetchStockIns());
      setSuccessMsg(`Stock-in with invoice no. ${stockIn.invoiceNo} deleted successfully`);
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    }
  }
  //filter ---
  const fiilterApplyHandler = () => {
    let textsearchFilteredData;
    if (!stockIns) {
      return;
    }
    textsearchFilteredData = stockIns;

    //search text filtering
      textsearchFilteredData = textsearchFilteredData.filter((item) => {
        const searchLower = search.toLowerCase().trim();
        return (
          (item.vendor?.name?.toLowerCase() || "").includes(searchLower) ||
          item.totalAmount?.toString().includes(searchLower) ||
          (item.invoiceNo?.toLowerCase() || "").includes(searchLower)
        );
      });

      setFilteredStockIns(textsearchFilteredData);

    //search date filter
    if (startDate && endDate) {
      // 1. Adjust the End Date to cover the full day (23:59:59.999 local time)
      // We create a copy so we don't mutate the state variable directly.
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      // 2. Get the universal UTC milliseconds for the filter range
      // JavaScript's .getTime() handles the IST offset correctly when parsing the original date objects.
      const filterStartMillis = new Date(startDate).getTime();
      const filterEndMillis = adjustedEndDate.getTime();

      // console.log("Start Date (User's View):", new Date(startDate).toLocaleString());
      // console.log("End Date (User's View):", adjustedEndDate.toLocaleString());

      // 3. Apply the filter to the data
      const filteredDateResults = [];
      for (let i = 0; i < textsearchFilteredData.length; i++) {
        const item = textsearchFilteredData[i];
        // Data in 'item.date' should be a valid UTC string (e.g., "...Z" or "...+00:00")

        const stockCreateDateMilSec = new Date(item.date).getTime();

        // The comparison works because both sides of the comparison are now UTC milliseconds
        if (stockCreateDateMilSec >= filterStartMillis && stockCreateDateMilSec <= filterEndMillis) {
          filteredDateResults.push(item);
        }
      }
      textsearchFilteredData = filteredDateResults;
    }

    if (selectedProduct) {
      textsearchFilteredData = textsearchFilteredData.reduce((acc, item) => {
        // 1. Iterate over the products array only ONCE.
        const matchingProducts = item.products.filter(
          (prod) => prod.product.name.toString() === selectedProduct
        );

        // 2. If there are any matching products, add a modified item to the accumulator.
        if (matchingProducts.length > 0) {
          const newItem = {
            ...item,
          };
          acc.push(newItem);
        }

        // 3. Return the accumulator array.
        return acc;
      }, []);
    }

  console.log("Filtered prod stockins Ins:", textsearchFilteredData);
  setFilteredStockIns(textsearchFilteredData);
};


const handleStartDateChange = (newDate) => {
    if (newDate) {
      setDateReset(false)
      setStartDate(newDate);
    } else {
      setStartDate("");
    }
  };

  const handleEndDateChange = (newDate) => {
    if (newDate) {
      setDateReset(false)
      setEndDate(newDate);
    } else {
      setEndDate("");
    }
  };

  const resetStartEndDate = () => {
    setStartDate("");
    setEndDate("");
    setDateReset(true);
  }


  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* {alarts} */}
      {successMsg && <SuccessAlert successMsg={successMsg} />}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
      <div className="lg:px-8">
        <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          All Stock-Ins
        </h1>
        <div className="flex justify-between gap-2 flex-col sm:flex-row">
          <div className="flex-1 flex-row">
            <SearchBar
              style={"mb-0"}
              placeholderText={"Search for Stock-ins"}
              setSearch={setSearch}
              search={search}
            />
            <div className="flex flex-col sm:flex-row gap-2 py-2">
              {/* //start */}
              <div className="flex flex-row gap-2">
                <div>
                  <h3 className="font-medium dark:text-white">Start date</h3>
                  <DatePicker onDateChange={handleStartDateChange} dateReset={dateReset} />
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">End date</h3>
                  <DatePicker onDateChange={handleEndDateChange} dateReset={dateReset} />
                </div>
                <button
                  type="button"
                  onClick={() => resetStartEndDate()}
                  className=" text-blue-500 font-medium rounded-lg md:text-sm w-full text-xs sm:w-auto px-0 py-0 text-center transition-all duration-300 items-center"
                >
                  clear
                </button>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                  {/* <Package className="inline w-4 h-4 mr-1" /> */}
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 dark:text-slate-200"
                >
                  <option value="">All Products</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex-none">
            <button
              type="button"
              onClick={() => fiilterApplyHandler()}
              // Standardized classes for consistent height and alignment
              className="flex items-center justify-center h-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
            >
              Apply
            </button>
          </div>

          {/* Collapse All Button */}
          <div className="flex-none">
            <button
              type="button"
              onClick={() => collapseAllFunction()}
              title="Collapse All"
              // Standardized classes for consistent height and alignment
              className="flex items-center justify-center h-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
            >
              {/* Reduced size of icon to fit the standardized button height (h-8) */}
              <ListCollapse size={18} />
            </button>
          </div>
        </div>
        
        {filteredStockIns.reverse().map((item) => (
          <div
            key={item._id}
            id={`accordion-item-${item._id}`}
            className="mb-4 mt-4"
          >
            <button
              type="button"
            className="flex w-full p-3 rounded-md shadow hover:shadow-lg font-medium text-xs md:text-sm lg:text-base text-gray-500 bg-gray-200 border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all duration-500 ease-in-out dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:bg-opacity-60 dark:hover:bg-gray-900"
              onClick={() => toggleAccordion(item._id)}
              aria-expanded={openAccordions[item._id] || false}
              aria-controls={`accordion-body-${item._id}`}
            >
            <div className="flex flex-col basis-5/6">
              <div className="flex basis-6/12 w-full gap-2 text-left">
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
                </div>
                <div className="flex-1">
                  <span className="flex basis-1/5 justify-start items-center">
                    <h4 className="font-bold text-gray-600">Amount:</h4>
                    &nbsp;
                    {item.totalAmount}
                  </span>
                  
                </div>
              </div>
              <div className=" basis-6/12 md:basis-4/12 text-left">
                {" "}
                <span className="flex basis-1/5 justify-start items-center">
                    <h4 className="font-bold text-gray-600">Vendor:</h4>
                    &nbsp;
                    {item.vendor.name}
                  </span>
                  {item.vendor.gstNo && <span className="flex basis-1/5 justify-start items-center">
                    <h4 className="font-bold text-gray-600">GST:</h4>
                    &nbsp;
                    {item.vendor.gstNo}
                  </span>}
                {item.description && <span className="w-full flex">
                  <h4 className="font-bold text-gray-600">Description:</h4>
                  &nbsp;
                  {item.description}
                </span>}
              </div>
            </div>
              <div className="justify-center items-center m-auto asis-1/6">
              <div>
                
              </div>
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
              </div>
            </button>

            <div
              className={`transform transition-all duration-300 ease-in-out origin-top ${
                openAccordions[item._id]
                  ? "opacity-100 scale-y-100 max-h-[1000px]"
                  : "opacity-0 scale-y-0 max-h-0"
              }`}
            >
              <div
                className={`p-5 shadow hover:shadow-lg border border-gray-200 bg-slate-100 rounded-b-lg dark:border-gray-700 dark:bg-gray-900 dark:bg-opacity-70`}
                id={`accordion-body-${item._id}`}
              >
                <div className="flex flex-row justify-between">
                  <div>
                  <h4 className="text-[15px] md:text-2xl font-bold text-gray-900 dark:text-white">Details:</h4>
                  </div>
                  <div name="buttons" className="flex flex-row gap-2">
                    {item.fileCloudUrl && (
                      // View the invoice uploaded during stock-In (In a new tab)
                      <button
                        type="button"
                        onClick={() => handleOpenInvoice(item.fileCloudUrl)}
                        className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg md:text-sm w-full text-xs sm:w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 items-center"
                      >
                        <Eye className="lg:mr-2" size={20} />
                         <span className="hidden lg:inline">View Invoice</span>
                      </button>
                    )}
                    {/* Download stock In details as invoice PDF */}
                    <PDFDownloadLink
                      document={<StockInPDF data={item} />}
                      fileName={`stock-in-${item.invoiceNo}.pdf`}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg md:text-sm w-full text-xs sm:w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 inline-flex items-center"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Download className="lg:mr-2" size={20} />
                            <span className="hidden lg:inline">Download as PDF</span>
                          </span>
                        )
                      }
                    </PDFDownloadLink>
                    <button
                      type="button"
                      onClick={() => handleEditStockIn(item)}
                      className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg md:text-sm w-full text-xs sm:w-auto px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 items-center"
                    >
                      <Edit className="lg:mr-2" size={20} />
                      <span className="hidden lg:inline">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStockIn(item)}
                      className="flex text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg md:text-sm w-full text-xs sm:w-auto px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 transition-all duration-300 items-center"
                    >
                      <Trash className="lg:mr-2" size={20} />
                      <span className="hidden lg:inline ">Delete</span>
                    </button>
                  </div>
                </div>
                {/* product and vendor details */}
                <div className="flex flex-col sm:flex-row gap-2 mt-2 mx-0">
                  <div className="flex flex-col basis-1/2 bg-gray-200 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:bg-opacity-60 rounded-lg p-2">
                    <h6 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                      VENDOR
                    </h6>
                    <hr className="h-px my-1 bg-gray-300 border-0 dark:bg-gray-700" />
                    <div className="text-sm sm:text-lg flex flex-col gap-1">
                      <span className="flex basis-1/5 justify-start items-start">
                        <h4 className="font-bold text-gray-600 dark:text-gray-200">Name:</h4>
                        <span className="text-gray-900 dark:text-gray-100">&nbsp;{item.vendor.name || "NA"}</span>
                      </span>
                      <span className="flex basis-1/5 justify-start items-start">
                        <h4 className="font-bold text-gray-600 dark:text-gray-200">Email:</h4>
                        <span className="text-gray-900 dark:text-gray-100">&nbsp;{item.vendor.email || "NA"}</span>
                      </span>
                      <span className="flex basis-1/5 justify-start items-start">
                        <h4 className="font-bold text-gray-600 dark:text-gray-200">Phone No:</h4>
                        <span className="text-gray-900 dark:text-gray-100">&nbsp;{item.vendor.phone || "NA"}</span>
                      </span>
                      <span className="flex basis-1/5 justify-start items-start">
                        <h4 className="font-bold text-gray-600 dark:text-gray-200">Address:</h4>
                        <span className="text-gray-900 dark:text-gray-100">&nbsp;{item.vendor.address || "NA"}</span>
                      </span>
                      <span className="flex basis-1/5 justify-start items-start">
                        <h4 className="font-bold text-gray-600 dark:text-gray-200">GST No:</h4>
                        <span className="text-gray-900 dark:text-gray-100">&nbsp;{item.vendor.gstNo || "NA"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col basis-1/2 bg-gray-200 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:bg-opacity-60 rounded-lg p-2 overflow-x-auto">
                    <div className="flex justify-between">
                      <h6 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white basis-[40%] min-w-[150px]">
                        PRODUCT
                      </h6>
                      <h6 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white border-l border-gray-300 dark:border-gray-700 pl-2 basis-[15%] min-w-[100px]">
                        P. Rate
                      </h6>
                      <h6 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white border-l border-gray-300 dark:border-gray-700 pl-2 basis-[15%] min-w-[100px]">
                        Qnty.
                      </h6>
                    </div>
                    <hr className="h-px my-1 bg-gray-300 border-0 w-full dark:bg-gray-700" />
                    {/* //w-screen overflow-x-visible --- Learning*/}
                    <div className="">
                      {item.products.map((product) => (
                        <div
                          key={product.product._id} // Add a key for performance
                          className="flex justify-between text-sm sm:text-base dark:border-gray-700"
                        >
                          <span className="flex basis-[40%] min-w-[150px] items-start">
                            <h4 className="font-medium text-gray-600 dark:text-gray-200 text-ellipsis overflow-hidden whitespace-nowrap"
                              title={product.product.name}
                            >
                              {item.products.indexOf(product) + 1}
                              {")"}&nbsp;{product.product.name}
                            </h4>
                          </span>
                          <span className="flex basis-[15%] min-w-[100px] items-start border-gray-300 dark:border-gray-700 pl-2">
                            <h4 className="font-semibold text-gray-600 dark:text-gray-200">
                              {"Rs. "}
                              {product.productPurchaseRate}
                            </h4>
                          </span>
                          <span className="flex basis-[15%] min-w-[100px] items-start border-gray-300 dark:border-gray-700 pl-2">
                            <h4 className="font-semibold text-gray-600 dark:text-gray-200">
                              {"x "}
                              {product.quantity}
                              {product.quantity > 1 ? " pcs" : " pc"}
                            </h4>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between order-last mt-auto font-semibold text-gray-900 border-t pt-2 border-gray-300 dark:border-gray-700 dark:text-gray-100">
                      <span className="flex basis-[40%] min-w-[150px] items-start">
                        Total Amount
                      </span>
                      <span className="flex basis-[15%] min-w-[100px] items-start">
                        Rs. {item.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllStockIns;
