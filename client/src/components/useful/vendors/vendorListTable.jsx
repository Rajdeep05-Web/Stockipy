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
    const userResponse = window.confirm(`Are you sure you want to edit ${vendor.name}?`);
    if(userResponse){
      navigate(`/edit-vendor/${vendor._id}`, { state: { vendor } });
    }
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
      <div class="relative overflow-x-auto shadow-md rounded-lg ">
        <table class="w-full text-sm  text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-sm sm:text-base text-gray-200 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
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
