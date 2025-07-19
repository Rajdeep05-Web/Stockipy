
import React from 'react';
import Header from './landingHeader';
import Hero from './landingHero';
import Features from './landingFeatures';
import Pricing from './landingPricing';
import Testimonials from './landingTestimonials';
import Footer from './landingFooter';
import { useTheme } from '../../context/themeContext';

const LandingPage = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    return (
       <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <Header />
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <Footer />
      </div>
    );
};

export default LandingPage;