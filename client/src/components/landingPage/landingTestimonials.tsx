import React from 'react';
import { Star, Quote, ThumbsUp, Heart } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Operations Manager',
      company: 'TechMart Electronics',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      rating: 5,
      content: 'Stockipy transformed our inventory management completely. We reduced stockouts by 90% and increased efficiency by 60%. The real-time analytics are incredible!'
    },
    {
      name: 'Priya Patel',
      role: 'Store Owner',
      company: 'Fashion Forward',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      rating: 5,
      content: 'The automation features saved us countless hours. What used to take days now happens automatically. The ROI was evident within the first month of implementation.'
    },
    {
      name: 'Amit Kumar',
      role: 'Supply Chain Director',
      company: 'MegaMart Retail',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      rating: 5,
      content: 'Managing multiple locations was a nightmare before Stockipy. Now we have complete visibility across all our stores. The customer support is outstanding too!'
    },
    {
      name: 'Sneha Reddy',
      role: 'Warehouse Manager',
      company: 'Global Distributors',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      rating: 5,
      content: 'The predictive analytics help us forecast demand accurately. We\'ve reduced excess inventory by 40% while maintaining perfect stock levels. Game-changing platform!'
    },
    {
      name: 'Vikash Singh',
      role: 'CEO',
      company: 'StartupXYZ',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      rating: 5,
      content: 'As a growing startup, we needed a solution that could scale with us. Stockipy has been perfect - powerful features at an affordable price. Highly recommended!'
    },
    {
      name: 'Kavya Nair',
      role: 'Inventory Specialist',
      company: 'Organic Foods Co.',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      rating: 5,
      content: 'The mobile app is fantastic! I can manage inventory on the go. The barcode scanning feature makes stock takes incredibly fast and accurate.'
    }
  ];

  return (
    <section id="testimonials" className="relative py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-32 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-32 left-32 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Customer Love</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up animation-delay-200">
            Trusted by thousands of businesses
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            See what our customers say about their experience with Stockipy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl hover:shadow-2xl hover:shadow-blue/10 transition-all duration-500 hover:-translate-y-3 group border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote icon with gradient background */}
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-2xl">
                  <Quote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Verified</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                "{testimonial.content}"
              </p>

              <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300 border-2 border-blue-200 dark:border-blue-800 shadow-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in-up animation-delay-800">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-8 py-4 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800/30">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-blue-900 dark:text-blue-100 font-semibold text-lg">
              4.9/5 average rating from 2,500+ reviews
            </span>
          </div>
          
          {/* Additional trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
            {[
              { label: 'G2 Leader', rating: '4.8/5' },
              { label: 'Capterra Choice', rating: '4.9/5' },
              { label: 'TrustPilot', rating: '4.7/5' }
            ].map((platform, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-medium">{platform.label}</span>
                <span className="text-sm">({platform.rating})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;