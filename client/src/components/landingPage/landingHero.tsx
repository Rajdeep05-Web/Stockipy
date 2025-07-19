import React from 'react';
import { ArrowRight, BarChart3, TrendingUp, Shield, Play, Star, Users, Award } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
import { useNavigate } from 'react-router-dom';
const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-1000"></div>
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-300 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-spin-slow"></div> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Trusted by 10,000+ businesses</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Smart Stock
                <span className="gradient-text block">Management</span>
                Made Simple
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in-up animation-delay-200">
              Transform your inventory management with AI-powered insights, real-time tracking, and automated workflows. Scale your business with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-blue-lg flex items-center justify-center space-x-2 group"
              onClick={() => navigate("/auth")}>
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button 
                onClick={() => navigate("/auth")}
                className="glass dark:glass-dark border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-105 flex items-center space-x-2 group"
              >
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 animate-fade-in-up animation-delay-600">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Secure</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Real-time</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Team Ready</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Award Winner</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue/20 p-8 animate-float border border-blue-100 dark:border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Overview</h3>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/30">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹2.4L</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800/30">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">1,247</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Items in Stock</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">23</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Low Stock Alerts</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                  </div>
                </div>

                <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 rounded-xl flex items-end justify-around p-4 border border-blue-200 dark:border-blue-800/30">
                  {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-sm animate-scale-in"
                      style={{ height: `${height}%`, width: '12px' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full animate-bounce-slow shadow-blue">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full animate-pulse-slow shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div className="absolute top-1/2 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full animate-bounce animation-delay-600 shadow-lg">
              <Star className="h-4 w-4" />
            </div>
            <div className="absolute top-1/4 -right-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-full animate-pulse animation-delay-800 shadow-lg">
              <Award className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;