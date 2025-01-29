import react, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
  fetchProducts,
} from "../../redux/slices/products/productsSlice";
import { useNavigate } from "react-router";

//comps
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [mrp, setMrp] = useState("");
  const [gst, setGst] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { id } = useParams();
  const productToUpdate = location.state.product;

  useEffect(() => {
    if (productToUpdate) {
      setName(productToUpdate.name);
      setDescription(productToUpdate.description);
      setRate(productToUpdate.rate);
      setMrp(productToUpdate.mrp);
      setGst(productToUpdate.gstPercentage);
    }
  }, [productToUpdate]); //run only when productToUpdate changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = { name, description, rate, mrp, gst };
    try {
      await dispatch(updateProduct({ id, product: updatedProduct })).unwrap();
      setSuccessMsg("Product updated successfully");
      dispatch(fetchProducts());
      setTimeout(() => {
        setSuccessMsg("");
        navigate(-1);
      }, 3000);
      //   console.log(productToUpdate);
      //  console.log("Product updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
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
          Update Product Details
        </h1>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Product name
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setName(e.target.value)}
            value={name}
            // required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Desc
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rate (Included GST)
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setRate(parseFloat(e.target.value) || "")}
            value={rate}
            required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            MRP
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setMrp(parseFloat(e.target.value) || "")} //''
            value={mrp}
            required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            GST Percentage(%)
          </label>
          <input
            type="number"
            id="base-input"
            onChange={(e) => setGst(parseFloat(e.target.value) || "")}
            value={gst}
            required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update Product
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          class="text-gray-900 bg-white border border-gray-300 w-full sm:w-auto focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 my-2 ml-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Cancel
        </button>
      </form>
      {successMsg && <SuccessAlert successMsg={successMsg} />}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
    </>
  );
};

export default UpdateProduct;
