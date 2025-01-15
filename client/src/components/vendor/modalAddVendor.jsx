import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addVendor,
  fetchVendors,
} from "../../redux/slices/vendor/vendorsSlice";

import Loading from "../useful/Loading/loading";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";

const ModalAddVendor = ({ isModalVisible, setIsModalVisible }) => {
  const dispatch = useDispatch();
  const { vendors, loading } = useSelector((state) => state.vendors);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nullifyFields = () => {
    setName("");
    setPhone("");
    setAddress("");
    setGstNo("");
    setEmail("");
  }; 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const vendorData = { name, phone, address, gstNo, email };
    try {
      await dispatch(addVendor(vendorData)).unwrap();
      setSuccessMsg("Vendor added successfully");
      nullifyFields();
      setTimeout(() => {
        setSuccessMsg(""); // Clear success message after 3 seconds
        setIsModalVisible(!isModalVisible); // Close modal
      }, 3000);
      dispatch(fetchVendors());
    } catch (error) {
      setErrorMsg(error || "Failed to add vendor");
      setTimeout(() => {
        setErrorMsg(""); 
      }, 3000);
    }
  };
  

  return (
    <>
      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          {loading && <Loading />}
          {successMsg && <SuccessAlert successMsg={successMsg} />}
          {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-md">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Vendor
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
                    placeholder="Type vendor name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone no
                  </label>
                  <input
                    type="phone"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter phone no"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="mrp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter vendor address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    required
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="gstno"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    GST No
                  </label>
                  <input
                    type="number"
                    id="gstno"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter GST no"
                    onChange={(e) => setGstNo(e.target.value)}
                    value={gstNo}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Vendor
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalAddVendor;
