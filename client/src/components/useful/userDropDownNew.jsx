import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, User, Settings, LogOut, Camera, Shield, Award, Clock } from 'lucide-react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../useful/themeToggle/themeToggle"
import { logOutUser, resetAuthState, setLoader } from "../../redux/slices/auth/authSlice";
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@Stockipy.com',
  role: 'Admin',
  lastLogin: 'Today at 9:30 AM'
};

export const UserDropdownNew = ({ onNavigate, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserEmail(user.email);
    setUserName(user.name);
    setUserProfilePicture(user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=ffffff`); // Fallback to generated avatar based on name
  }, [])

  const handleLogout = async () => {
    //global state loading is set to true
    dispatch(setLoader());
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      await dispatch(logOutUser(userData)).unwrap(); //logouts from db
      dispatch(resetAuthState()); //deletes user from local storage
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      dispatch(setLoader()); //global state loading is set to false
      setDropdownOpen(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (section) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(section);
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { detail: section }));
    }
  };

  const handleSignOut = () => {
    setIsOpen(false);
    console.log('Signing out...');
  };

  const getInitials = () => {
    if(userName.includes(' ')) {
      const [firstname] = userName.split(' ')[0] || " ";
      const [lastName] = userName.split(' ')[1] || " ";
      return `${firstname.toUpperCase()}${lastName?.toUpperCase()}`;
    } else {
      return userName.charAt(0).toUpperCase();
    }

  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* User Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* User Info - Hidden on mobile, shown on desktop */}
        <div className="hidden xl:block text-right">
          <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
            {userName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{userData.role}</div>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm font-medium">
            {userProfilePicture ? (
              <img src={userProfilePicture} alt="User Avatar" className="w-full h-full rounded-full" />
            ) : (
              getInitials()
            )}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-64 sm:w-72 lg:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
        >
          {/* User Info Header */}
          <div className="px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm sm:text-lg font-medium">
                    {userProfilePicture ? (
                      <img src={userProfilePicture} alt="User Avatar" className="w-full h-full rounded-full" />
                    ) : (
                      getInitials()
                    )}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-medium truncate">
                  {userName || `${userData.firstName} ${userData.lastName}`}
                </div>
                <div className="text-xs sm:text-sm opacity-90 truncate">
                  {userEmail || userData.email}
                </div>
                <div className="text-xs opacity-75">{userData.role}</div>
              </div>
            </div>
            <div className="mt-2 text-xs opacity-75">
              Last login: {userData.lastLogin}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <motion.button
              onClick={() => handleNavigation('profile')}
              className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
              whileHover={{ x: 4 }}
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  View Profile
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Personal account information
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleNavigation('account-settings')}
              className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
              whileHover={{ x: 4 }}
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  Account Settings
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Privacy, security, and preferences
                </div>
              </div>
            </motion.button>

            {/* Quick Stats */}
            {/* <div className="px-3 sm:px-4 py-2 border-t border-gray-200 dark:border-gray-600 mt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Stats</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm font-bold text-green-600">2.5</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Years</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm font-bold text-blue-500">847</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Orders</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm font-bold text-purple-500">98%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          {/* <div className="md:hidden border-t border-gray-200 dark:border-gray-600 px-3 sm:px-4 py-2 w-full">
            <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
            <div className="flex justify-items-start w-full">
              <ThemeToggle />
            </div> 
          </div> */}

          {/* Sign Out */}
          <div className="border-t border-gray-200 dark:border-gray-600 py-2">
            <motion.button
              onClick={handleLogout}
              className="w-full px-3 sm:px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 flex items-center space-x-3 group transition-colors"
              whileHover={{ x: 4 }}
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-red-600" />
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600">
                  Sign Out
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Securely log out of your account
                </div>
              </div>
            </motion.button>
          </div>

        </motion.div>
      )}
    </div>
  );
};