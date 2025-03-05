import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  fetchProducts,
} from "../../redux/slices/products/productsSlice";

//comps
import Loading from "../useful/Loading/loading";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";
import ProductListTable from "../useful/products/productListTable";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState('');
  const [mrp, setMrp] = useState('');
  const [gst, setGst] = useState('');
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (loading) return (
  <Loading />
);

  const nullifyFields = () => {
    setName("");
    setDescription("");
    setRate('');
    setMrp('');
  }
// console.log(typeof rate)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {name, rate, description, mrp, gst};
    try {
      await dispatch(addProduct(newProduct)).unwrap();
      setSuccessMsg("Product added successfully");
      setTimeout(() => {
        setSuccessMsg("");
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

  return (
    <>
      <form
        className="max-w-sm mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Add Product
        </h1>
        <div className="mb-5">
          <label
            for="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Product name
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label
            for="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label
            for="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rate (Included GST)
          </label>
          <input
            type="number"
            id="base-input"
            onChange={(e) => setRate(parseFloat(e.target.value) || '')}
            value={rate} required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label
            for="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            MRP
          </label>
          <input
            type="number"
            id="base-input"
            onChange={(e) => setMrp(parseFloat(e.target.value) || '')}
            value={mrp} required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label
            for="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            GST Percentage(%) 
          </label>
          <input
            type="number"
            id="base-input"
            onChange={(e) => setGst(parseFloat(e.target.value) || '')}
            value={gst} required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
      {/** Product List **/}
      <hr className="my-5 bg-gray-600 border-1 dark:bg-gray-700" />
      <div className="container mt-5 sm:mt-0">
      <ProductListTable products={products} setErrorMsg={setErrorMsg} setSuccessMsg={setSuccessMsg}/>
      </div>
      
      {/** success message **/}
      {successMsg && <SuccessAlert successMsg={successMsg} />}
      {/** Error message **/}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
    </>
  );
};

export default AddProduct;
