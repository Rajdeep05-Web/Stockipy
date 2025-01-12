import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  deleteVendor,
  fetchVendors,
} from "../../../redux/slices/vendor/vendorsSlice";

import SearchBar from "../searchBar";

const VendorListTable = ({ setSuccessMsg, setErrorMsg }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendors } = useSelector((state) => state.vendors);

  const [search, setSearch] = useState("");

  const filteredVendors = vendors.filter((vendor) => {
    return vendor.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleEdit = (vendor) => {
    navigate(`/edit-vendor/${vendor._id}`, { state: { vendor } });
  };

  const handleDelete = async (vendor) => {
    try {
      await dispatch(deleteVendor(vendor)).unwrap();
      setSuccessMsg("Vendor deleted successfully");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      dispatch(fetchVendors());
    } catch (error) {
      console.error("Failed to delete vendor:", error);
      setErrorMsg(error);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };
  return (
    <>
      <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        All Vendors
      </h1>
      <SearchBar
        placeholderText={"Search for Vendors"}
        setSearch={setSearch}
        search={search}
      />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-all-search" class="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" class="px-6 py-3">
                Vendor name
              </th>
              <th scope="col" class="px-6 py-3">
                Phone
              </th>
              <th scope="col" class="px-6 py-3">
                Address
              </th>
              <th scope="col" class="px-6 py-3">
                GST No
              </th>
              <th scope="col" class="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr
                key={vendor._id}
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td class="w-4 p-4">
                  <div class="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-table-search-1" class="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {vendor.name}
                </th>
                <td class="px-6 py-4">{vendor.phone}</td>
                <td class="px-6 py-4">{vendor.address}</td>
                <td class="px-6 py-4">{vendor.gstNo}</td>
                <td class="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(vendor)}
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(vendor)}
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

export default VendorListTable;
