import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import ThemeToggle from '../themeToggle/themeToggle';
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, verifyOTP } from '../../../redux/slices/auth/authSlice.jsx';
import ErrorAlert from "../alerts/errorAlert.jsx";

const OTPVerification = ({
    email,
    onBackToForgot,
    onOTPVerified,
    onResendOTP
}) => {
    const dispatch = useDispatch();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef([]);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Start countdown
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newOtp.every(digit => digit !== '') && value) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setOtp(newOtp);

        if (newOtp.every(digit => digit !== '')) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleVerifyOTP = async (otpCode) => {
        setIsLoading(true);
        setError('');
        try {
            await dispatch(verifyOTP({ email, otp: otpCode })).unwrap();
            if (onOTPVerified) {
                onOTPVerified(otpCode);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('Invalid verification code. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const reqOtpForForgetPassword = async () => {
        if (!email) return;
        setIsOtpLoading(true);
        try {
            const res = await dispatch(forgetPassword(email)).unwrap();
            setIsOtpLoading(false);
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrorMsg('Failed to send OTP. Please try again.');
            setIsOtpLoading(false);
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const handleResend = async () => {
        if (countdown > 0) return;
        await reqOtpForForgetPassword();
        setCountdown(60);
        setError('');
        setOtp(['', '', '', '', '', '']);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        if (onResendOTP) {
            onResendOTP();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            handleVerifyOTP(otpCode);
        }
    };

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
                        <Shield className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Enter Verification Code
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        We've sent a 6-digit code to
                    </p>
                    <p className="text-blue-600 font-medium">{email}</p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="flex justify-center space-x-3 mb-4">
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-all ${error
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                                        }`}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                />
                            ))}
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || otp.some(digit => digit === '')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Verify Code</span>
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Resend Code */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={countdown > 0}
                        className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {countdown > 0 ? (
                            <span className="flex items-center justify-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Resend in {countdown}s</span>
                            </span>
                        ) : (
                            isOtpLoading ? 'loading' : 'Resend verification code'
                        )}
                    </button>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={onBackToForgot}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Email</span>
                    </button>
                </div>
            </motion.div>
        </div>
    </>);
};

export default OTPVerification;
