import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../../context/themeContext';
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1">
      {themes.map((themeOption) => (
        <motion.button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`relative p-2 rounded-full transition-colors ${
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
    </div>
  );
};

export default ThemeToggle;