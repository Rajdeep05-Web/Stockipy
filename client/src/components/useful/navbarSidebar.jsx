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

import UserDropdown from "./UserDropdown";

const NavbarSidebar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    products: false,
    customers: false,
    vendors: false,
    stock: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // Example notification count

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out ${
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
              Stock In
            </Link>
            <Link to="/stock-ins" className="block py-2 text-gray-400 hover:text-white transition-colors">
              Stock Ins
            </Link>
          </NavItem>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <div className="bg-white border-b border-gray-200 z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side */}
              <div className="flex items-center">
                <button
                  id="sidebar-toggle"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                {/* Search bar */}
                <div className="hidden md:block ml-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* User dropdown */}
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 px-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavbarSidebar;