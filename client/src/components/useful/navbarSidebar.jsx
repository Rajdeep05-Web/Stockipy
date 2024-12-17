import React, { useState } from "react";
import { Link } from "react-router-dom";

import UserDropdown from "./userDropDown";

const NavbarSidebar = ({ children }) => { //children coming from App.jsx
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    products: false,
    customers: false,
    vendors: false,
    stock: false,
  });

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div
        className={`fixed flex-auto inset-y-0 left-0 transform bg-gray-800 text-white max-w-64 p-4 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        <h2 className="text-2xl font-bold mb-6">Stockipy</h2>
        <nav>
          {/* Products Dropdown */}
          <div className="">
            {/* <div className="flex "> */}
            <button
              onClick={() => toggleDropdown("products")}
              className="block w-full text-left text-2xl font-semibold text-yellow-300 py-2 px-4 hover:bg-gray-700 rounded"
            >
               {/* <svg class="inline-flex items-center w-5 h-5 mb-2 mr-3 text-blue-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
               </svg> */}
              Products
            </button>
            {/* </div> */}
            {dropdowns.products && (
              <div className="ml-4">
                <Link
                  to="/products"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  All Products
                </Link>
                <Link
                  to="/add-product"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  Add Product
                </Link>
              </div>
            )}
          </div>

          {/* Customers Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("customers")}
              className="block w-full text-left text-2xl text-yellow-300 font-semibold py-2 px-4 hover:bg-gray-700 rounded"
            >
              Customers
            </button>
            {dropdowns.customers && (
              <div className="ml-4">
                <Link
                  to="/customers"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  All Customers
                </Link>
                <Link
                  to="/add-customer"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  Add Customer
                </Link>
              </div>
            )}
          </div>

          {/* Vendors Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("vendors")}
              className="block w-full text-left text-2xl text-yellow-300 font-semibold py-2 px-4 hover:bg-gray-700 rounded"
            >
              Vendors
            </button>
            {dropdowns.vendors && (
              <div className="ml-4">
                <Link
                  to="/vendors"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  All Vendors
                </Link>
                <Link
                  to="/add-vendor"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  Add Vendor
                </Link>
              </div>
            )}
          </div>

          {/* Stock Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("stock")}
              className="block w-full text-left text-2xl text-yellow-300 font-semibold py-2 px-4 hover:bg-gray-700 rounded"
            >
              Stock
            </button>
            {dropdowns.stock && (
              <div className="ml-4">
                <Link
                  to="/stock-in"
                  className="block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  Stock In
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-auto">
        {/* Navbar */}
        <div className="bg-gray-800 text-white px-6 py-4 shadow flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Dashboard</h1>

            <UserDropdown />

        </div>

        {/* Main Content */}
        <div className="p-6 px-44 w-full flex-auto">{children}</div>
      </div>
    </div>
  );
};

export default NavbarSidebar;
