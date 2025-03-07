import {
    Bell,
    Menu,
  } from "lucide-react";
import UserDropdown from './UserDropdown';
import {useState } from 'react';

const Navbar = ({setSidebarOpen, sidebarOpen}) => {
      const [notifications, setNotifications] = useState(3); // Example notification count
      
    return (
        <>
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
              </div>
          {/* Right side */}
          <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
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
        </>
    )
}

export default Navbar;