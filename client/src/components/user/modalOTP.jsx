import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import {
  Shield, Bell, Eye, EyeOff, Smartphone, Globe, Lock, Key, Trash2, Save, AlertTriangle
  , ArrowLeft, RefreshCw, Clock, CheckCircle
} from 'lucide-react';
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";

const ModalOTP = ({
  isModalVisible,
  setIsModalVisible,
  isOtpSent,
  isOtpVerified,
  authMsg,
  successMsg,
  errorMsg,
  handleVerifyOTP,
  error,
  setError,
  setSuccess,
  success,
  otpSubmitLoading,
  handleResend,
  countdown,
  setOtp,
  otp,
  otpReqLoading,
  inputRefs
}) => {
  
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      handleVerifyOTP(otpCode);
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  };
  const handleOTPFormInputChange = (index, value) => {
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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      {/* Modal */}
      {isModalVisible && isOtpSent && !isOtpVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-70">
          {successMsg && <SuccessAlert successMsg={successMsg} />}
          {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
          {/* Modal body */}
          <div className="relative bg-white rounded-lg shadow p-5 mx-4 sm:mx-0 dark:bg-gray-800 w-full max-w-md">
           {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Email Verification
            </h3>
            <button
              type="button"
              onClick={() => setIsModalVisible(!isModalVisible)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l12 12M13 1 1 13"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Form */}
          <div className="p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Verify OTP
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {authMsg ||
                "Enter the OTP sent to your email to verify your identity."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex justify-center space-x-3 mb-4">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOTPFormInputChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-10 md:w-12 h-12 text-center text-xl font-bold border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-all ${
                        error
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500"
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

                {/* //seccess */}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 text-sm text-center"
                  >
                    OTP verified successfully!
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={
                  otpSubmitLoading ||
                  otp.some((digit) => digit === "" || success)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {otpSubmitLoading ? (
                  // <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>loaing</span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify Code</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
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
              ) : otpReqLoading ? (
                "loading"
              ) : (
                "Resend verification code"
              )}
            </button>
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default ModalOTP;
