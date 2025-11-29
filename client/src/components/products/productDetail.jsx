import React from 'react';
import { 
  Package, DollarSign, TrendingUp, Calendar, 
  Clock, Hash, FileText, ArrowUpRight, 
  AlertTriangle, Archive, Edit3, Trash2
} from 'lucide-react';

const ProductDetail = () => {
  // --- MOCK DATA (Based on your JSON) ---
  const data = {
    _id: "691de1bdb79ae8ab41c93649",
    userId: "687f4609b25188a3599dad64",
    name: "P 6",
    quantity: 20,
    rate: 5400, // Selling Price
    productPurchaseRate: 3800, // Cost Price
    prevProductPurchaseRate: [],
    mrp: 6000,
    prevMrp: [],
    productStockIns: [
      "691de22bb79ae8ab41c93670",
      "69236c6179d8750165d2651e",
      "6925d6a5eba11fc7ced772e4"
    ],
    description: "",
    gstPercentage: 18,
    createdAt: "2025-11-19T15:26:53.026Z",
    updatedAt: "2025-11-25T16:17:41.378Z",
    __v: 3
  };

  // --- CALCULATIONS ---
  const profitPerUnit = data.rate - data.productPurchaseRate;
  const profitMargin = ((profitPerUnit / data.rate) * 100).toFixed(1);
  const totalStockValue = data.quantity * data.productPurchaseRate; // Cost value
  const totalSalesPotential = data.quantity * data.rate; // Sales value
  
  // Formatters
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 font-sans dark:bg-gray-900 dark:text-gray-100">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 dark:text-gray-400">
              <Hash size={14} />
              <span className="font-mono">{data._id}</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium dark:bg-blue-900/40 dark:text-blue-200">Active</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.name}</h1>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
              <Edit3 size={18} />
              <span>Edit Details</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition dark:bg-blue-500 dark:hover:bg-blue-600">
              <Archive size={18} />
              <span>Adjust Stock</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2. PRIMARY STATS (Top Row) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stock Quantity */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between dark:bg-gray-900 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</p>
              <h3 className={`text-3xl font-bold mt-2 ${data.quantity < 10 ? 'text-red-500 dark:text-red-300' : 'text-gray-900 dark:text-gray-100'}`}>
                {data.quantity} <span className="text-sm font-normal text-gray-400 dark:text-gray-500">units</span>
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${data.quantity < 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'}`}>
              <Package size={24} />
            </div>
          </div>

          {/* Purchase Rate */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between dark:bg-gray-900 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2 dark:text-gray-100">{formatCurrency(data.productPurchaseRate)}</h3>
              <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">Cost Price (Excl. Tax)</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <DollarSign size={24} />
            </div>
          </div>

          {/* Selling Rate */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between dark:bg-gray-900 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Selling Rate</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-2 dark:text-blue-400">{formatCurrency(data.rate)}</h3>
              <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">MRP: {formatCurrency(data.mrp)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              <TrendingUp size={24} />
            </div>
          </div>

          {/* Profit Metric */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between dark:bg-gray-900 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Margin / Unit</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2 dark:text-green-400">{profitMargin}%</h3>
              <p className="text-xs text-green-600 mt-1 dark:text-green-400">+{formatCurrency(profitPerUnit)} profit</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <ArrowUpRight size={24} />
            </div>
          </div>
        </div>

        {/* 3. DETAILS & FINANCIALS (Left Column - 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Inventory Valuation Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 dark:text-gray-100">
              <DollarSign size={18} /> Inventory Valuation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-900/60 dark:border-gray-800">
                <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Total Asset Value (Cost)</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(totalStockValue)}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 dark:bg-gray-800">
                  <div className="bg-gray-500 h-1.5 rounded-full dark:bg-gray-400" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/40 dark:border-blue-900/40">
                <p className="text-sm text-blue-600 mb-1 dark:text-blue-300">Total Sales Potential (Revenue)</p>
                <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{formatCurrency(totalSalesPotential)}</p>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-3 dark:bg-blue-900/50">
                  <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Tax Info */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Tax Configuration</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">GST Percentage:</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">{data.gstPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Product Details</h3>
            
            <div className="mb-6">
               <p className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">Description</p>
               <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 italic dark:bg-gray-900/60 dark:text-gray-400">
                 {data.description ? data.description : "No description provided for this product."}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="text-sm text-gray-900 flex items-center gap-2 mt-1 dark:text-gray-200">
                    <Calendar size={14} className="text-gray-400 dark:text-gray-500"/> {formatDate(data.createdAt)}
                  </p>
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm text-gray-900 flex items-center gap-2 mt-1 dark:text-gray-200">
                    <Clock size={14} className="text-gray-400 dark:text-gray-500"/> {formatDate(data.updatedAt)}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR - HISTORY & AUDIT (Right Column - 1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Stock In History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-800">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center dark:bg-gray-900/60 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Stock In History</h3>
              <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400">Last 3</span>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.productStockIns.length > 0 ? (
                data.productStockIns.map((stockId, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition cursor-pointer group dark:hover:bg-gray-900">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-100 p-1.5 rounded text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                        <ArrowUpRight size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-mono mb-1 dark:text-gray-400">Ref: {stockId.substring(0, 10)}...</p>
                        <p className="text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-300">View Transaction</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm dark:text-gray-400">No stock history found</div>
              )}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center dark:bg-gray-900/60 dark:border-gray-800">
              <button className="text-sm text-blue-600 font-medium hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">View All History</button>
            </div>
          </div>

          {/* Price History (Empty State Handling) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 dark:bg-gray-900 dark:border-gray-800">
             <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">Price Trends</h3>
             
             {data.prevProductPurchaseRate.length === 0 && data.prevMrp.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-6 text-gray-400 dark:text-gray-500">
                 <AlertTriangle size={32} className="mb-2 opacity-50"/>
                 <p className="text-sm">No historical price data recorded.</p>
               </div>
             ) : (
               <ul className="space-y-2">
                 {/* Logic to map previous prices would go here */}
               </ul>
             )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl border border-red-100 p-4 dark:bg-red-900/20 dark:border-red-900/40">
             <h3 className="font-bold text-red-800 mb-2 text-sm dark:text-red-300">Danger Zone</h3>
             <button className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white transition dark:bg-red-900/10 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-500">
                <Trash2 size={16} />
                Delete Product
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;