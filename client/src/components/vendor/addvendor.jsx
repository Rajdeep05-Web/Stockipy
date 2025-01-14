import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

//comps
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";
import Loading from "../useful/Loading/loading";
import VendorListTable from "../useful/vendors/vendorListTable";
//redux
import {
  fetchVendors,
  addVendor,
} from "../../redux/slices/vendor/vendorsSlice";

const AddVendor = () => {
  const dispatch = useDispatch();
  const { vendors, loading } = useSelector((state) => state.vendors);
  // const location = useLocation();
  // const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFromStockIn, setIsFromStockIn] = useState(false);

  // useEffect(() => {
  //   if (location.state && location.state.isFromStockIn) {
  //     setIsFromStockIn(true);
  //   }
  // }, [location]);

  const nullify = () => {
    setName("");
    setPhone("");
    setAddress("");
    setGstNo("");
    setEmail("");
  };

  if (loading) {
    return <Loading />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vendorData = { name, phone, address, gstNo, email };
    try {
      await dispatch(addVendor(vendorData)).unwrap();
      nullify();
      setSuccessMsg("Vendor added successfully");
      setTimeout(() => {
        setSuccessMsg("");
        // if (isFromStockIn) {
        //   navigate("/add-stock-in",{state : location.state });
        // }
      }, 3000);
      dispatch(fetchVendors());
    } catch (error) {
      console.log("Failed to add vendor:", error);
      setErrorMsg(error);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };
  return (
    <>
      <form class="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Add Vendor
        </h1>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone no
          </label>
          <input
            type="number"
            id="base-input"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="base-input"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="large-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Address
          </label>
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            required
            id="large-input"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            GST No
          </label>
          <input
            type="string"
            id="base-input"
            onChange={(e) => setGstNo(e.target.value)}
            value={gstNo}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>

      {/** Product List **/}
      <VendorListTable
        setSuccessMsg={setSuccessMsg}
        setErrorMsg={setErrorMsg}
      />

      {/** success message **/}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
      {/** Error message **/}
      {successMsg && <SuccessAlert successMsg={successMsg} />}
    </>
  );
};

export default AddVendor;
