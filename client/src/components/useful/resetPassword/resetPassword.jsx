import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, RefreshCw, Shield } from 'lucide-react';
import ThemeToggle from '../themeToggle/themeToggle';

const ResetPassword = ({
    email,
    otp,
    onPasswordReset,
    onBackToLogin
}) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const calculatePasswordStrength = (password) => {
        let score = 0;
        const feedback = [];

        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('At least 8 characters');
        }

        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('One uppercase letter');
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('One lowercase letter');
        }

        if (/\d/.test(password)) {
            score += 1;
        } else {
            feedback.push('One number');
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 1;
        } else {
            feedback.push('One special character');
        }

        let color = 'bg-red-500';
        if (score >= 4) color = 'bg-green-500';
        else if (score >= 3) color = 'bg-yellow-500';
        else if (score >= 2) color = 'bg-orange-500';

        return { score, feedback, color };
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (passwordStrength.score < 4) {
            newErrors.password = 'Password does not meet requirements';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);

            // Auto redirect after success
            setTimeout(() => {
                if (onPasswordReset) {
                    onPasswordReset();
                }
            }, 2000);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="absolute  top-4 left-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Stockipy.</h2>
                </div>
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Password Reset Successful!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your password has been successfully reset. You can now log in with your new password.
                    </p>

                    <motion.button
                        onClick={onBackToLogin}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                    >
                        Continue to Login
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
             <div className="absolute  top-4 left-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Stockipy.</h2>
                </div>
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <Lock className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a new secure password for your account
                    </p>
                </div>

                {/* Verification Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Verified: {email}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Code: {otp} ✓
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reset Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${errors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                                    <span className="text-xs font-medium">
                                        {passwordStrength.score}/5
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    />
                                </div>
                                {passwordStrength.feedback.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Requirements:</p>
                                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            {passwordStrength.feedback.map((item, index) => (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || passwordStrength.score < 4}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Reset Password</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
