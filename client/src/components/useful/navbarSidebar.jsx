import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Truck,
  BoxesIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  Bell,
  Home
} from "lucide-react";

import UserDropdown from "./UserDropdown.jsx";

const NavbarSidebar = ({ children }) => {
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");
      
      if (sidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          toggleButton && 
          !toggleButton.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const NavItem = ({ icon: Icon, title, isOpen, onClick, children }) => (
    <div className="mb-2">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-100 hover:bg-gray-700 rounded-lg transition-colors duration-150 ease-in-out"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{title}</span>
        </div>
        {children && (
          isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {children && isOpen && (
        <div className="ml-12 mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 ">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out  ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <h2 className="text-2xl font-bold text-white">Stockipy</h2>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-100 hover:bg-gray-700 rounded-lg mb-2">
            <Home className="w-5 h-5 text-gray-400 mr-3" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <NavItem
            icon={Package}
            title="Products"
            isOpen={dropdowns.products}
            onClick={() => toggleDropdown("products")}
          >
            <Link to="/products" className="block py-2 text-gray-400 hover:text-white transition-colors">
              All Products
            </Link>
            <Link to="/add-product" className="block py-2 text-gray-400 hover:text-white transition-colors">
              Add Product
            </Link>
          </NavItem>

          <NavItem
            icon={Users}
            title="Customers"
            isOpen={dropdowns.customers}
            onClick={() => toggleDropdown("customers")}
          >
            <Link to="/customers" className="block py-2 text-gray-400 hover:text-white transition-colors">
              All Customers
            </Link>
            <Link to="/add-customer" className="block py-2 text-gray-400 hover:text-white transition-colors">
              Add Customer
            </Link>
          </NavItem>

          <NavItem
            icon={Truck}
            title="Vendors"
            isOpen={dropdowns.vendors}
            onClick={() => toggleDropdown("vendors")}
          >
            <Link to="/vendors" className="block py-2 text-gray-400 hover:text-white transition-colors">
              All Vendors
            </Link>
            <Link to="/add-vendor" className="block py-2 text-gray-400 hover:text-white transition-colors">
              Add Vendor
            </Link>
          </NavItem>

          <NavItem
            icon={BoxesIcon}
            title="Stock"
            isOpen={dropdowns.stock}
            onClick={() => toggleDropdown("stock")}
          >
            <Link to="/add-stock-in" className="block py-2 text-gray-400 hover:text-white transition-colors">
              Create Stock-In
            </Link>
            <Link to="/stock-ins" className="block py-2 text-gray-400 hover:text-white transition-colors">
              All Stock-Ins
            </Link>
          </NavItem>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        
        {/* Page Content */}
        <main className="flex-1 w-dvw h-dvh md:w-full bg-gray-50 p-6 sm:px-28">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavbarSidebar;