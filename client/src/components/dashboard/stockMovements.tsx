import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Package, Truck, ShoppingCart, RotateCcw } from 'lucide-react';

// Conversion rate: 1 USD = 83 INR (as an example)
const USD_TO_INR = 83;
const movements = [
  {
    id: 1,
    type: 'inbound',
    quantity: 150,
    product: 'iPhone 15 Pro',
    sku: 'IPH15P-256-BLK',
    supplier: 'Apple Inc.',
    location: 'Warehouse A',
    category: 'Electronics',
    icon: Package,
    time: '2 hours ago',
    value: 149850 * USD_TO_INR,
    status: 'completed'
  },
  {
    id: 2,
    type: 'outbound',
    quantity: 45,
    product: 'Nike Air Max 270',
    sku: 'NAM270-10-WHT',
    supplier: 'Nike Store',
    location: 'Warehouse B',
    category: 'Footwear',
    icon: Truck,
    time: '4 hours ago',
    value: 6750 * USD_TO_INR,
    status: 'in-transit'
  },
  {
    id: 3,
    type: 'adjustment',
    quantity: -12,
    product: 'Samsung Galaxy S24',
    sku: 'SGS24-128-GRY',
    supplier: 'Internal Audit',
    location: 'Warehouse A',
    category: 'Electronics',
    icon: RotateCcw,
    time: '6 hours ago',
    value: -14388 * USD_TO_INR,
    status: 'completed'
  },
  {
    id: 4,
    type: 'outbound',
    quantity: 89,
    product: 'Adidas Ultraboost 22',
    sku: 'AUB22-9-BLK',
    supplier: 'Customer Order',
    location: 'Warehouse C',
    category: 'Footwear',
    icon: ShoppingCart,
    time: '8 hours ago',
    value: 15980 * USD_TO_INR,
    status: 'completed'
  },
  {
    id: 5,
    type: 'inbound',
    quantity: 200,
    product: "Levi's 501 Jeans",
    sku: 'LV501-32-BLU',
    supplier: 'Levi Strauss & Co.',
    location: 'Warehouse B',
    category: 'Clothing',
    icon: Package,
    time: '1 day ago',
    value: 19800 * USD_TO_INR,
    status: 'completed'
  },
];

const movementTypes = {
  inbound: { color: 'text-lime-accent', bg: 'bg-lime-accent/20', icon: ArrowDownLeft },
  outbound: { color: 'text-orange-400', bg: 'bg-orange-500/20', icon: ArrowUpRight },
  adjustment: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: RotateCcw },
};

const statusColors = {
  completed: 'bg-lime-accent/20 text-lime-accent',
  'in-transit': 'bg-orange-500/20 text-orange-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
};

const StockMovements = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Stock Movements</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Latest inventory transactions and adjustments</p>
      </motion.div>

      {/* Movement List */}
      <div className="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg transition-colors duration-300">
        <div className="space-y-4">
          {movements.map((movement, index) => {
            const MovementIcon = movementTypes[movement.type as keyof typeof movementTypes].icon;
            const typeConfig = movementTypes[movement.type as keyof typeof movementTypes];

            return (
              <motion.div
                key={movement.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group relative duration-300"
              >
                {/* Movement Type Icon */}
                <div className={`p-3 rounded-full ${typeConfig.bg}`}>
                  <MovementIcon className={`w-5 h-5 ${typeConfig.color}`} />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{movement.product}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[movement.status as keyof typeof statusColors]}`}>
                      {movement.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>SKU: {movement.sku}</span>
                    <span>•</span>
                    <span>{movement.location}</span>
                    <span>•</span>
                    <span>{movement.supplier}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{movement.category}</span>
                  </div>
                </div>

                {/* Quantity and Value */}
                <div className="text-right">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className="space-y-1"
                  >
                    <p className={`font-bold font-editorial text-lg ${typeConfig.color}`}>
                      {movement.type === 'outbound' || movement.quantity < 0 ? '' : '+'}{movement.quantity} units
                    </p>
                    <p className={`text-sm ${movement.value >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-400'}`}>
                      {movement.value >= 0 ? '+' : ''}₹{Math.abs(movement.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </motion.div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{movement.time}</p>
                </div>

                {/* Hover effect line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className="absolute bottom-0 left-0 h-px bg-green-500 bg-opacity-30"
                />
              </motion.div>
            );
          })}
        </div>

        {/* View More Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white hover:border-green-500 hover:border-opacity-30 hover:text-green-600 transition-all font-medium duration-300"
        >
          View All Movements
        </motion.button>
      </div>
    </div>
  );
}

export default StockMovements;