import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Clock, RefreshCw } from 'lucide-react';
import ThemeToggle from '../themeToggle/themeToggle';
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from '../../../redux/slices/auth/authSlice.jsx';
import ErrorAlert from "../alerts/errorAlert.jsx";
// import SuccessAlert from "../alerts/successAlert.jsx";

const ForgotPassword = ({
    onBackToLogin,
    onOTPSent
}) => {
      const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

     const reqOtpForForgetPassword = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
          const res = await dispatch(forgetPassword(email)).unwrap();
          setIsEmailSent(true);
          setIsLoading(false);
        //   startCountdown();
            if (onOTPSent) {
                onOTPSent(email);
            }
        } catch (error) {
          console.error('Error sending OTP:', error);
          setErrorMsg(error);
          setIsLoading(false);
          setTimeout(() => {
            setErrorMsg("");
          }, 3000);
        }
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await reqOtpForForgetPassword();
    };

    const handleResendEmail = async () => {
        if (countdown > 0) return;
        await reqOtpForForgetPassword();
        startCountdown();
    };

    const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

    return (<>
        {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <Mail className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {isEmailSent ? 'Check Your Email' : 'Forgot Password?'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isEmailSent
                            ? `We've sent a verification code to ${email}`
                            : 'Enter your email address and we\'ll send you a verification code to reset your password.'
                        }
                    </p>
                </div>

                {!isEmailSent ? (
                    /* Email Form */
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading || !email}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Send Verification Code</span>
                                </>
                            )}
                        </motion.button>
                    </form>
                ) : (
                    /* Email Sent Confirmation */
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                        Verification code sent!
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                        Check your inbox and spam folder
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Didn't receive the email?
                            </p>
                            <button
                                onClick={handleResendEmail}
                                disabled={countdown > 0}
                                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {/* <>isLoading ? <span>Loading</span> */}
                                {!isLoading && countdown > 0 ? (
                                    <span className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Resend in {countdown}s</span>
                                    </span>
                                ) : (
                                    'Resend verification code'
                                )}
                                {/* </> */}
                            </button>
                        </div>
                    </div>
                )}

                {/* Back to Login */}
                <div className="mt-8 text-center">
                    <button
                        onClick={onBackToLogin}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Login</span>
                    </button>
                </div>
            </motion.div>
        </div>
    </>);
};

export default ForgotPassword;
