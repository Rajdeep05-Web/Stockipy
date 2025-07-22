import React, {useState, useEffect, useRef} from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../../context/themeContext';
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
      function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div ref={menuRef} className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1">
      {themes.map((themeOption) => (
        <motion.button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`relative p-2 rounded-full transition-colors sm:block hidden ${
            theme === themeOption.value
              ? 'text-green-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <themeOption.icon className="w-4 h-4" />
          {theme === themeOption.value && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-green-500 bg-opacity-10 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.button>
      ))}
      <div className="relative">
        <motion.button
          className="relative p-2 rounded-full text-green-600 sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {React.createElement(themes.find((themeOption) => themeOption.value === theme)?.icon, { className: 'w-4 h-4' })}
        </motion.button>
        {isMobileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full text-left p-2 rounded-lg transition-colors ${
                  theme === themeOption.value
                    ? 'text-green-600 bg-green-100 dark:bg-green-900'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <themeOption.icon className="w-4 h-4 inline mr-2" />
                {themeOption.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;