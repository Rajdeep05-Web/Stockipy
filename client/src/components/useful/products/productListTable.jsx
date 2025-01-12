import React, { useState } from "react";
import { useNavigate } from "react-router";
import { deleteProduct, fetchProducts } from "../../../redux/slices/products/productsSlice";
import { useDispatch } from "react-redux";
import SearchBar from "../searchBar";

const ProductListTable = ({ products=[], setErrorMsg, setSuccessMsg }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (product) => {
    try {
      await dispatch(deleteProduct(product)).unwrap();
      setSuccessMsg("Product deleted successfully");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setErrorMsg(error);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    } finally {
      dispatch(fetchProducts());//fetch products again if delete is successful
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product._id}`, { state: { product } });

  }

  return (
    <>
        <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          All Products
        </h1>
      <SearchBar
          placeholderText={"Search for items"}
          setSearch={setSearch}
          search={search}
        />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-base text-gray-200 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
              </th>
              <th scope="col" class="px-6 py-3">
                Product name
              </th>
              <th scope="col" class="px-6 py-3">
                quantity
              </th>
              <th scope="col" class="px-6 py-3">
                rate
              </th>
              <th scope="col" class="px-6 py-3">
                MRP
              </th>
              <th scope="col" class="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td class="w-4 p-4" >
                </td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" title={product.description}
                >
                  {product.name}
                </th>
                <td class="px-6 py-4">{product.quantity}</td>
                <td class="px-6 py-4">{product.rate}</td>
                <td class="px-6 py-4">{product.mrp}</td>
                <td class="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductListTable;
