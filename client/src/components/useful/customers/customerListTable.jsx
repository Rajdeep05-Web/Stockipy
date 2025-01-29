import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import SearchBar from "../searchBar";

import { deleteCustomer, fetchCustomers } from "../../../redux/slices/customers/customersSlice";

const CustomerListTable = ({ customers = [], setSuccessMsg, setErrorMsg }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (customer) => {
    const userResponse = window.confirm(`Are you want to edit ${customer.name}?`);
    if(userResponse){
      navigate(`/edit-customer/${customer._id}`, { state: { customer } });
    } 
  };

  const handleDelete = async (customer) => {
    try {
      await dispatch(deleteCustomer(customer)).unwrap();
      setSuccessMsg("Customer deleted successfully");
      setTimeout(() => { setSuccessMsg("") }, 3000);
    } catch (error) {
      console.error("Failed to delete customer:", error);
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    } finally {
      dispatch(fetchCustomers());//fetch customers again if delete is successful
    }
  };

  return (
    <>
      <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        All Customers
      </h1>
      <SearchBar
          placeholderText={"Search Customers"}
          setSearch={setSearch}
          search={search}
        />
      <div class="relative overflow-x-auto shadow-md rounded-lg ">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-sm sm:text-base text-gray-200 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Customer name
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
            {filteredCustomers.map((customer) => (
              <tr
                key={customer._id}
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {customer.name}
                </th>
                <td class="px-6 py-4">{customer.phone}</td>
                <td class="px-6 py-4">{customer.address}</td>
                <td class="px-6 py-4">{customer.gstNo}</td>
                <td class="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(customer)}
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(customer)}
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

export default CustomerListTable;
