import React, { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import { logOutUser, resetAuthState } from "../../redux/slices/auth/authSlice";

const UserDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   const user = JSON.parse(localStorage.getItem("user"));
   setUserEmail(user.email);
   setUserName(user.name);
  }, [])

  const handleLogout = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      await dispatch(logOutUser(userData)).unwrap(); //logouts from db
      setLoading(false);
      dispatch(resetAuthState()); //deletes user from local storage
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  }
  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div className="flex items-center">
      <div className="flex items-center ms-3 relative">
        {/* Profile Button */}
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          aria-expanded={dropdownOpen}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo"
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            className="z-50 absolute right-0 mt-72 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
            id="dropdown-user"
          >
            <div className="px-4 py-3" role="none">
              <p className="text-sm text-gray-900 dark:text-white" role="none">
               {userName}
              </p>
              <p
                className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                role="none"
              >
                {userEmail}
              </p>
            </div>
            <ul className="py-1" role="none">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
