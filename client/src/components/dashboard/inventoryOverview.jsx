import { useState } from "react";
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, EyeOff, AlertTriangle, Package } from 'lucide-react';

const Inventory = () => {
  // Conversion rate: 1 USD = 83 INR (as an example)
  const USD_TO_INR = 83;
  const inventoryStats = [
    { 
      category: 'Electronics', 
      totalItems: 1247, 
      totalValue: 89432.50 * USD_TO_INR, 
      change: +5.2, 
      lowStock: 23,
    //   icon: '📱',
      color: 'bg-blue-500/20 text-blue-400'
    },
    { 
      category: 'Clothing', 
      totalItems: 2891, 
      totalValue: 45678.90 * USD_TO_INR, 
      change: -2.1, 
      lowStock: 45,
    //   icon: '👕',
      color: 'bg-purple-500/20 text-purple-400'
    },
    { 
      category: 'Home & Garden', 
      totalItems: 856, 
      totalValue: 23456.78 * USD_TO_INR, 
      change: +8.7, 
      lowStock: 12,
    //   icon: '🏠',
      color: 'bg-green-500/20 text-green-400'
    },
    { 
      category: 'Sports', 
      totalItems: 634, 
      totalValue: 34567.89 * USD_TO_INR, 
      change: +3.4, 
      lowStock: 8,
    //   icon: '⚽',
      color: 'bg-orange-500/20 text-orange-400'
    },
  ];
   const [showValues, setShowValues] = useState(true);
  const totalValue = inventoryStats.reduce((sum, stat) => sum + stat.totalValue, 0);
  const totalItems = inventoryStats.reduce((sum, stat) => sum + stat.totalItems, 0);
  const totalLowStock = inventoryStats.reduce((sum, stat) => sum + stat.lowStock, 0);
    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Overview</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time stock levels and valuations</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowValues(!showValues)}
                        className="p-3 bg-white bg-opacity-10 dark:bg-black dark:bg-opacity-10 backdrop-blur-sm rounded-full hover:bg-green-500 hover:bg-opacity-10 transition-colors duration-300"
                    >
                        {showValues ? (
                            <Eye className="w-5 h-5 text-gray-900 dark:text-white" />
                        ) : (
                            <EyeOff className="w-5 h-5 text-gray-900 dark:text-white" />
                        )}
                    </motion.button>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Inventory Value */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg relative overflow-hidden transition-colors duration-300"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 bg-opacity-5 rounded-full blur-2xl" />
                        <div className="relative">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                                    <Package className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Total Value</p>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
                                className="flex items-baseline space-x-2"
                            >
                                <span className="text-3xl font-bold text-green-500">
                                    {showValues ? `₹${totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '••••••••'}
                                </span>
                            </motion.div>
                            <div className="flex items-center space-x-2 mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-green-500 text-sm">+6.2% this month</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Total Items */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg transition-colors duration-300"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                                <Package className="w-5 h-5 text-blue-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Total Items</p>
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
                            className="text-3xl font-bold text-gray-900 dark:text-white"
                        >
                            {totalItems.toLocaleString()}
                        </motion.div>
                        <div className="flex items-center space-x-2 mt-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm">+12 new items</span>
                        </div>
                    </motion.div>

                    {/* Low Stock Alert */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm border border-orange-500 border-opacity-30 rounded-2xl p-6 shadow-lg transition-colors duration-300"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-orange-500 bg-opacity-20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-orange-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Low Stock</p>
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
                            className="text-3xl font-bold text-orange-400"
                        >
                            {totalLowStock}
                        </motion.div>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-orange-400 text-sm">Requires attention</span>
                        </div>
                    </motion.div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {inventoryStats.map((category, index) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-green-500 hover:border-opacity-30 transition-all hover:shadow-xl group duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{category.category}</h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{category.totalItems} items</p>
                                    </div>
                                </div>
                                <div className={`flex items-center space-x-1 ${category.change >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                                    {category.change >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span className="text-sm">{category.change > 0 ? '+' : ''}{category.change}%</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <motion.p
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                    className="text-2xl font-bold text-gray-900 dark:text-white"
                                >
                                    {showValues ? `₹${category.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '••••••'}
                                </motion.p>

                                {category.lowStock > 0 && (
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${category.color} flex items-center space-x-1`}>
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>{category.lowStock} low stock</span>
                                    </div>
                                )}

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(category.totalValue / 100000 * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                        className="h-1 bg-green-500 rounded-full opacity-70"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            `</>
    )
}

export default Inventory;