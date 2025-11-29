import {
  Bell,
  Menu, Globe
} from "lucide-react";
import UserDropdown from "./useful/userDropDown";
import {UserDropdownNew} from "./useful/userDropDownNew";
import {Notification} from "./useful/notification";
import { useState } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from "./useful/themeToggle/themeToggle"

const Navbar = ({ setSidebarOpen, sidebarOpen }) => {
  const [notifications, setNotifications] = useState(3); // Example notification count

  return (
    <>
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300"
    >
            {/* Left side */}
            <div className="flex items-center">
              <button
                id="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              {/* toggle */}
             <div className="flex items-center space-x-4">
              <ThemeToggle />
              </div> 
              {/* Encrypted */}
              {/* <div className="items-center space-x-4 hidden md:flex">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full transition-colors duration-300"
                >
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-900 dark:text-white">Encrypted</span>
                </motion.div>
              </div> */}
              {/* Notifications */}
              <Notification />
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-green-500 hover:bg-opacity-10 transition-colors duration-300"
              >
                <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full"
                />
              </motion.button> */}

              {/* User dropdown */}
              <UserDropdownNew />
            </div>
            
      </motion.div>
    </>
  )

}

export default Navbar;