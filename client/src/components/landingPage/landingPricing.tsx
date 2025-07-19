import React from 'react';
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '₹999',
      period: '/month',
      description: 'Perfect for small businesses getting started',
      icon: Zap,
      features: [
        'Up to 500 products',
        'Basic inventory tracking',
        'Email support',
        'Mobile app access',
        'Basic reports'
      ],
      popular: false,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '₹2,999',
      period: '/month',
      description: 'Ideal for growing businesses',
      icon: Crown,
      features: [
        'Up to 5,000 products',
        'Advanced analytics',
        'Priority support',
        'Multi-location support',
        'Advanced reports',
        'API access',
        'Team collaboration'
      ],
      popular: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: '₹9,999',
      period: '/month',
      description: 'For large-scale operations',
      icon: Rocket,
      features: [
        'Unlimited products',
        'Custom integrations',
        'Dedicated support',
        'Advanced security',
        'Custom reports',
        'White-label solution',
        'Training & onboarding'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <section id="pricing" className="relative py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Flexible Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up animation-delay-200">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Choose the perfect plan for your business. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue/30 ring-4 ring-blue-200 dark:ring-blue-800 border-2 border-blue-300'
                  : 'bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg animate-bounce-slow">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                plan.popular 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400'
              } shadow-lg`}>
                <plan.icon className="h-8 w-8" />
              </div>

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <Check className={`h-4 w-4 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                    </div>
                    <span className={`${plan.popular ? 'text-blue-100' : 'text-gray-700 dark:text-gray-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100 hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue'
                }`}
              >
                {plan.buttonText}
              </button>

              {/* Hover effect overlay */}
              {!plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in-up animation-delay-800">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>SSL Certificate</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;