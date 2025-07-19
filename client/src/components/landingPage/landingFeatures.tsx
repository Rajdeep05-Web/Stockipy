import React from 'react';
import { BarChart3, Shield, Zap, Users, Bell, TrendingUp, Sparkles, Clock, Globe } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
const Features: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get instant insights into your inventory with powerful analytics and customizable dashboards.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Bank-level encryption and multi-factor authentication to keep your data safe and secure.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Automation',
      description: 'Automate reordering, alerts, and workflows to save time and reduce human errors.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team with role-based access and real-time collaboration tools.',
      color: 'purple'
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Never run out of stock with intelligent alerts and predictive inventory management.',
      color: 'red'
    },
    {
      icon: TrendingUp,
      title: 'Growth Insights',
      description: 'Make data-driven decisions with detailed reports and forecasting capabilities.',
      color: 'indigo'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Leverage artificial intelligence for demand forecasting and inventory optimization.',
      color: 'pink'
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Round-the-clock system monitoring with instant notifications and alerts.',
      color: 'orange'
    },
    {
      icon: Globe,
      title: 'Multi-Location',
      description: 'Manage inventory across multiple locations with centralized control and reporting.',
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30',
      green: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30',
      yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30',
      purple: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30',
      red: 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30',
      indigo: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/30',
      pink: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/20 dark:to-pink-800/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/30',
      orange: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30',
      teal: 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/20 dark:to-teal-800/30 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="features" className="relative py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up animation-delay-200">
            Everything you need to manage your inventory
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Our comprehensive platform provides all the tools you need to streamline your stock management and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue/10 hover:-translate-y-3 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10,000+', label: 'Active Users', icon: Users },
            { number: '99.9%', label: 'Uptime', icon: Shield },
            { number: '50M+', label: 'Items Tracked', icon: BarChart3 },
            { number: '24/7', label: 'Support', icon: Clock }
          ].map((stat, index) => (
            <div key={index} className="text-center group animate-scale-in" style={{ animationDelay: `${index * 200 + 800}ms` }}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;