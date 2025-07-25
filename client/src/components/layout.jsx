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
    <div className="flex bg-gray-100 dark:bg-slate-900">
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} /> {/* Left navigation bar */}
      <div className="flex-1 flex flex-col min-h-screen overflow-scroll"> {/* Main content area */}
        <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} /> {/* Top navigation bar */}
        <main className="flex-1 w-dvw h-dvh md:w-full bg-[#F25F6] p-6 sm:px-28">
          {authLoading ? <Loading /> : <Outlet />}
        </main>
      </div>

      {/* Dark layer with smooth transition */}
      <div 
        className={`fixed inset-0 bg-black z-40 pointer-events-none transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'bg-opacity-30 backdrop-blur-md pointer-events-auto' : 'bg-opacity-0 backdrop-blur-none'
        }`} 
      />
    </div>
  );
};

export default Layout;
