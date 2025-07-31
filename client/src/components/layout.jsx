import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import Navbar from './navbar';
import Sidebar from './useful/sidebar';
import Loading from "./useful/Loading/loading";


const Layout = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const { loading: authLoading } = useSelector((state) => state.auth);


 return (
   <div className="flex min-h-screen w-full dark:bg-slate-900 relative">
 {/* Sidebar */}
 <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


 {/* Main content wrapper */}
 <div className="flex flex-col flex-1 min-h-0 w-full">
   <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


   <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
     {authLoading ? <Loading /> : <Outlet />}
   </main>
 </div>


 {/* Overlay for mobile sidebar */}
 <div
   className={`fixed inset-0 z-30 transition-all duration-300 ease-in-out ${
     sidebarOpen
       ? "bg-black bg-opacity-30 backdrop-blur-sm pointer-events-auto"
       : "bg-transparent pointer-events-none"
   }`}
   onClick={() => setSidebarOpen(false)}
 />
</div>






 );
};


export default Layout;



