import React, {useEffect, useState} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/> {/* Left navigation bar */}
      <div className="flex-1 flex flex-col min-h-screen overflow-scroll"> {/* Main content area */}
        <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/> {/* Top navigation bar */}
        <main className="flex-1 w-dvw h-dvh md:w-full bg-[#F25F6] p-6 sm:px-28">
          <Outlet /> {/* This renders different page components */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
