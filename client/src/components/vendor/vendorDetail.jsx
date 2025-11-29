import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Hash, Briefcase, 
  DollarSign, Clock, Truck, TrendingUp, 
  Sun, Moon, Package, Edit3, Archive, XCircle 
} from 'lucide-react';

// Define the structure of the data for clarity and mock transaction details
const VENDOR_DATA = {
  _id: "688527eecf7628c472ab8cd3",
  userId: "687f4609b25188a3599dad64",
  name: "Sree Tomar PVT LTD",
  email: "ttkr@gmail.com",
  phone: "1231461202",
  address: "Jdhdks, Central Market, New Delhi",
  gstNo: "12AJSDF1234A1ZA", // Mocked a realistic GST format for better presentation
  stockIns: [ // Mocked array with full transaction objects for meaningful metrics
    { id: "SI-004", date: "2025-11-20T10:00:00Z", totalValue: 95000, status: "Paid" },
    { id: "SI-003", date: "2025-11-15T14:30:00Z", totalValue: 40000, status: "Due" },
    { id: "SI-002", date: "2025-10-30T11:00:00Z", totalValue: 120000, status: "Paid" },
    { id: "SI-001", date: "2025-10-15T09:00:00Z", totalValue: 65000, status: "Due" },
  ],
  status: "active", // Mocking status for better component reuse
  createdAt: "2025-07-26T19:09:34.940Z",
  updatedAt: "2025-11-25T16:18:44.964Z",
  __v: 4
};

const VendorDetail = () => {
  // --- Calculations ---
  const totalStockIns = VENDOR_DATA.stockIns.length;
  // Total money spent on purchases from this vendor
  const totalSpend = VENDOR_DATA.stockIns.reduce((sum, order) => sum + order.totalValue, 0);
  // Total amount currently owed to the vendor
  const totalOwed = VENDOR_DATA.stockIns
    .filter(order => order.status === 'Due')
    .reduce((sum, order) => sum + order.totalValue, 0);

  const lastStockInDate = totalStockIns > 0 
    ? new Date(VENDOR_DATA.stockIns[0].date).toLocaleDateString() 
    : 'N/A';
  
  const averagePurchaseValue = totalStockIns > 0 
    ? totalSpend / totalStockIns 
    : 0;

  // --- Formatters ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statusBadgeClass =
    VENDOR_DATA.status === 'active'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';

  // --- Metric Card Component ---
  const MetricCard = ({ title, value, icon: Icon, colorClass, footerText }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-2 rounded-full ${colorClass} text-white`}>
          <Icon size={18} />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-1">{value}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500">{footerText}</p>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER & ACTIONS */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Hash size={14} />
                <span className="font-mono">{VENDOR_DATA._id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusBadgeClass}`}>
                  {VENDOR_DATA.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{VENDOR_DATA.name}</h1>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <Edit3 size={18} />
                <span>Edit Details</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition dark:bg-blue-500 dark:hover:bg-blue-600">
                <Archive size={18} />
                <span>Record Stock-In</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLUMN 1: Key Procurement Metrics (4 Cards) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Lifetime Spend"
              value={formatCurrency(totalSpend)}
              icon={DollarSign}
              colorClass="bg-blue-600"
              footerText={`Across ${totalStockIns} total purchase orders`}
            />
            <MetricCard
              title="Stock-In Count"
              value={totalStockIns}
              icon={Package}
              colorClass="bg-indigo-600"
              footerText={`Last order: ${lastStockInDate}`}
            />
            <MetricCard
              title="Total Pending Owed"
              value={formatCurrency(totalOwed)}
              icon={TrendingUp}
              colorClass={totalOwed > 0 ? "bg-red-600" : "bg-green-600"}
              footerText={totalOwed > 0 ? "Requires Payment" : "Accounts Clear"}
            />
            <MetricCard
              title="Avg. Purchase Value"
              value={formatCurrency(averagePurchaseValue)}
              icon={Hash}
              colorClass="bg-yellow-600"
              footerText="Important for budgeting"
            />
          </div>

          {/* COLUMN 2: Primary Details & Stock In History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact & Legal Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-3">
                <Briefcase size={20} className="text-blue-500" />
                Vendor and Legal Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                    <a href={`mailto:${VENDOR_DATA.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{VENDOR_DATA.email}</a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Contact Number</p>
                    <a href={`tel:${VENDOR_DATA.phone}`} className="text-gray-900 dark:text-gray-100 hover:underline">{VENDOR_DATA.phone}</a>
                  </div>
                </div>

                {/* GST No */}
                <div className="flex items-start gap-3 col-span-1">
                  <Hash size={16} className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">GST Number</p>
                    {VENDOR_DATA.gstNo ? (
                      <p className="text-gray-900 dark:text-gray-100 font-mono">{VENDOR_DATA.gstNo}</p>
                    ) : (
                      <p className="italic text-red-500 dark:text-red-300">Not provided</p>
                    )}
                  </div>
                </div>
                
                {/* Address */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin size={16} className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Primary Address</p>
                    <p className="text-gray-900 dark:text-gray-100">{VENDOR_DATA.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History (Stock Ins) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-3">
                <Truck size={20} className="text-indigo-500" />
                Recent Stock-In Transactions ({totalStockIns} total)
              </h2>

              {totalStockIns === 0 ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <XCircle size={32} className="mx-auto mb-2" />
                  <p>No stock received from this vendor yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {VENDOR_DATA.stockIns.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex justify-between items-center py-3 group hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-150 rounded-md px-2 -mx-2">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-900 dark:text-gray-100 font-mono">{order.id}</span>
                        <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          order.status === 'Paid' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <span className="font-bold text-gray-900 dark:text-gray-100 block">{formatCurrency(order.totalValue)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 text-center">
                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">View All History</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: Audit & Internal Notes */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Audit Trail */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                <Clock size={20} className="text-yellow-500" />
                Audit Trail
              </h2>
              <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex justify-between items-start">
                  <span className="font-medium text-gray-500 dark:text-gray-400 w-1/3">Created:</span>
                  <span className="text-gray-900 dark:text-gray-100 w-2/3 text-right">{new Date(VENDOR_DATA.createdAt).toLocaleString()}</span>
                </li>
                <li className="flex justify-between items-start">
                  <span className="font-medium text-gray-500 dark:text-gray-400 w-1/3">Last Updated:</span>
                  <span className="text-gray-900 dark:text-gray-100 w-2/3 text-right">{new Date(VENDOR_DATA.updatedAt).toLocaleString()}</span>
                </li>
                <li className="flex justify-between items-start">
                  <span className="font-medium text-gray-500 dark:text-gray-400 w-1/3">Version:</span>
                  <span className="text-gray-900 dark:text-gray-100 w-2/3 text-right">v{VENDOR_DATA.__v}</span>
                </li>
              </ul>
            </div>
            
            {/* Internal Notes (Placeholder) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Internal Notes</h2>
              <textarea
                className="w-full min-h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                placeholder="Add notes about payment terms, delivery reliability, or negotiation history..."
                defaultValue="Offers a 10% discount on orders over ₹1,00,000. Delivery time averages 5-7 days."
              />
              <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;