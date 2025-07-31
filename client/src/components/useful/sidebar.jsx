import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
 Home,
 Package,
 Users,
 Truck,
 BoxesIcon,
 ChevronDown,
 ChevronRight,
 X,
} from "lucide-react";


const Sidebar = ({ setSidebarOpen, sidebarOpen }) => {
 const navItems = [
   { icon: Home, label: "Dashboard", path: "/dashboard", subFolders: [] },
   {
     icon: Package,
     label: "Products",
     path: "/products",
     subFolders: [
       { label: "Add Product", path: "/add-product" },
       { label: "Products", path: "/products" },
     ],
   },
   {
     icon: Users,
     label: "Customers",
     path: "/customers",
     subFolders: [
       { label: "Add Customer", path: "/add-customer" },
       { label: "Customers", path: "/customers" },
     ],
   },
   {
     icon: Truck,
     label: "Vendors",
     path: "/vendors",
     subFolders: [
       { label: "Add Vendor", path: "/add-vendor" },
       { label: "Vendors", path: "/vendors" },
     ],
   },
   {
     icon: BoxesIcon,
     label: "Stock",
     path: "/stock-ins",
     subFolders: [
       { label: "Add Stock-In", path: "/add-stock-in" },
       { label: "Stock-Ins", path: "/stock-ins" },
     ],
   },
 ];


 const [dropdowns, setDropdowns] = useState({});


 const toggleDropdown = (key) => {
   setDropdowns((prev) => ({
     ...prev,
     [key]: !prev[key],
   }));
 };


 useEffect(() => {
   const handleClickOutside = (event) => {
     const sidebar = document.getElementById("sidebar");
     const toggleButton = document.getElementById("sidebar-toggle");


     if (
       sidebarOpen &&
       sidebar &&
       !sidebar.contains(event.target) &&
       toggleButton &&
       !toggleButton.contains(event.target)
     ) {
       setSidebarOpen(false);
     }
   };


   document.addEventListener("mousedown", handleClickOutside);
   return () => document.removeEventListener("mousedown", handleClickOutside);
 }, [sidebarOpen]);


 return (
   <div
     id="sidebar"
     className={`fixed z-50 inset-y-0 left-0 w-64 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-md border-r border-neutral-200 rounded-r-xl lg:rounded-none dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
       } lg:translate-x-0 lg:static`}
   >
     <div className="p-6 flex">
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stockipy.</h1>
       <button
         id="sidebar-toggle"
         onClick={() => setSidebarOpen(!sidebarOpen)}
         className="ml-auto lg:hidden p-2 rounded-md items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
       >
         <X className="h-5 w-5" />
       </button>
     </div>
     <nav className="mt-4">
       {navItems.map((navitem) => (
         <div key={navitem.label}>
           {!navitem.subFolders.length ? (
             <NavLink
               to={navitem.path}
               className="block px-6 py-3 text-gray-700 dark:text-slate-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
             >
               <div className="flex items-center gap-4">
                 <navitem.icon size={20} />
                 <span className="capitalize font-bold">{navitem.label}</span>
               </div>
             </NavLink>
           ) : (
           <button
             onClick={() =>
               navitem.subFolders.length > 0 && toggleDropdown(navitem.label)
             }
             className="w-full flex items-center justify-between px-6 py-3 dark:text-slate-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
           >
             <div className="flex items-center gap-4">
               <navitem.icon size={20} />
               <span className="capitalize font-bold">{navitem.label}</span>
             </div>
             {navitem.subFolders.length > 0 &&
               (dropdowns[navitem.label] ? (
                 <ChevronDown size={16} />
               ) : (
                 <ChevronRight size={16} />
               ))}
           </button>
         )}
           {/* Subfolder Links */}
           {navitem.subFolders.length > 0 && dropdowns[navitem.label] && (
             <div className="ml-10 space-y-2">
               {navitem.subFolders.map((sub) => (
                 <NavLink
                   key={sub.path}
                   to={sub.path}
                   className={({ isActive }) =>
                     `block py-2 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 transition ${isActive ? "font-semibold text-blue-600 dark:text-lime-400" : ""}`
                   }
                 >
                   <span className="font-medium"> {sub.label}</span>
                 </NavLink>
               ))}
             </div>
           )}
         </div>
       ))}
     </nav>
   </div>
 );
};


export default Sidebar;



