import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  fetchProducts,
} from "../../redux/slices/products/productsSlice";

import Loading from "../useful/Loading/loading";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";

const ModalAddProduct = ({ isModalVisible, setIsModalVisible }) => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [mrp, setMrp] = useState("");
  const [gst, setGst] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nullifyFields = () => {
    setName("");
    setDescription("");
    setRate("");
    setMrp("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { name, rate, description, mrp, gst };
    try {
      await dispatch(addProduct(newProduct)).unwrap();
      setSuccessMsg("Product added successfully");
      setTimeout(() => {
        setSuccessMsg("");
        setIsModalVisible(!isModalVisible);
      }, 3000);
      dispatch(fetchProducts());
      nullifyFields();
    } catch (error) {
      console.log("Failed to add product:", error);
      setErrorMsg(error);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          {successMsg && <SuccessAlert successMsg={successMsg} />}
          {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-md">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Product
              </h3>
              <button
                type="button"
                onClick={() => setIsModalVisible(!isModalVisible)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l12 12M13 1 1 13"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Modal body */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Type product name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Rate (Included GST)
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter rate"
                    onChange={(e) => setRate(parseFloat(e.target.value) || "")}
                    value={rate}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="mrp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    MRP
                  </label>
                  <input
                    type="number"
                    id="mrp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter MRP"
                    onChange={(e) => setMrp(parseFloat(e.target.value) || "")}
                    value={mrp}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="mrp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    GST Percentage(%)
                  </label>
                  <input
                    type="number"
                    id="mrp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter MRP"
                    onChange={(e) => setGst(parseFloat(e.target.value) || "")}
                    value={gst}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Write product description here"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalAddProduct;
