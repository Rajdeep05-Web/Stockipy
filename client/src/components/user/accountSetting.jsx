import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Bell, Eye, EyeOff, Smartphone, Globe, Lock, Key, Trash2, Save, AlertTriangle
  , ArrowLeft, RefreshCw, Clock, CheckCircle
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, verifyOTP, resetPassword } from '../../redux/slices/auth/authSlice';
import ErrorAlert from "../useful/alerts/errorAlert.jsx";
import SuccessAlert from "../useful/alerts/successAlert.jsx";

const initialSettings = {
  twoFactorEnabled: true,
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: true,
  loginAlerts: true,
  dataExport: false,
  sessionTimeout: '30',
  language: 'en',
  timezone: 'America/New_York'
};

const AccountSettings = () => {
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { user, otpSent: authOtpSentState, message, otpLoading: otploadingState } = useSelector((state) => state.auth);

  const [errorMsg, setErrorMsg] = useState("");
   const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [settings, setSettings] = useState(initialSettings);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpFromDB, setOtpFromDB] = useState('123456'); // Mock OTP from DB
  const [otpSubmitLoading, setOtpSubmitLoading] = useState(false);
  const [otpReqLoading, setOtpReqLoading] = useState(false);
  const [passResetLoading, setPassResetLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState('');
  const [resetPassMsg, setResetPassMsg] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { email } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Handle save logic here
  };

  const reqOtpForForgetPassword = async () => {
    setOtpReqLoading(true);
    try {
      const res = await dispatch(forgetPassword(email)).unwrap();
      setIsChangePassword(true);
      setIsOtpSent(true);
      setAuthMsg(res.message);
      startOtpCountdown();
      console.log("forget pass", res);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMsg('Failed to send OTP. Please try again.');
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    } finally {
      setOtpReqLoading(false);
    }
  }

  const handleChangePassword = async () => {
    const res = confirm("Are you sure to change password?")
    if(res) await reqOtpForForgetPassword();
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPassResetLoading(true);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg('Passwords do not match');
      setPassResetLoading(false);
      setSuccess('');
     setTimeout(() => {
       setErrorMsg("");
     }, 3000);
      return;
    }

    let otpNum = 0;
    for(let i = 0; i < otp.length; i++){
      otpNum += Number(otp[i]) * Math.pow(10, 5 - i);
    }

    try {
      const res = await dispatch(resetPassword({
        email: email,
        newPassword: passwordForm.confirmPassword,
        otp: otpNum
      })).unwrap();
      setSuccessMsg(res.message || "Password Updated successfully");
      setTimeout(() => {
       setSuccessMsg("");
      }, 3000);
      setIsChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setOtp(['', '', '', '', '', '']);
      setIsOtpVerified(false);
    } catch (error) {
      console.error(error || "error during password reset");
      setErrorMsg(error);
     setTimeout(() => {
       setErrorMsg("");
     }, 3000);
    } finally {
      setPassResetLoading(false);
    }
  };

  const handleCancelSavePassword = () => {
    setIsChangePassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setOtp(['', '', '', '', '', '']);
    setIsOtpVerified(false);
  };

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
    setOtpSubmitLoading(true);
    setError('');
    try {
      await dispatch(verifyOTP({ email, otp: otpCode })).unwrap();
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        setIsOtpVerified(true);
      }, 1500);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setOtpSubmitLoading(false);
    }
  };

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

  };

  const startOtpCountdown = () => {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      handleVerifyOTP(otpCode);
    }
  };

  return (<>
    {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
    {successMsg && <SuccessAlert successMsg={successMsg} />}
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage your security, privacy, and notification preferences</p>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security & Privacy</h3>
        </div>

        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          {/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div> */}

          {/* Login Alerts */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Login Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of suspicious login attempts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.loginAlerts}
                onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>

          {/* Session Timeout */}
          {/* <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Lock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically log out after inactivity</p>
              </div>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div> */}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
        </div>
        {isChangePassword && isOtpVerified && <>
          <form onSubmit={handleSavePassword}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  disabled={passResetLoading}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  disabled={passResetLoading}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className='flex justify-end space-x-2'>
            <motion.button
              type = "submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              {passResetLoading ? <span>Loading</span> : <span>Save</span>}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelSavePassword}
              className="mt-6 flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-all"
            >
              <span>Cancel</span>
            </motion.button>
          </div>
          </form>
        </>}

        {!isChangePassword && !isOtpVerified && (
          <>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Change Account Password</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Once you change your password, you will be logged out of all devices.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangePassword}
                  className="mt-6 flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  <Key className="w-4 h-4" />
                  {otpReqLoading ? <span>Loading</span> : <span>Change Password</span>}
                </motion.button>
              </div>
            </div>
          </>)}

        {/* OTP Form */}
        {isChangePassword && isOtpSent && !isOtpVerified && (
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Verify OTP</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {authMsg || "Enter the OTP sent to your email to verify your identity."}
              </p>

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
                        className={`w-10 md:w-12 h-12 text-center text-xl font-bold border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-all ${error
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

                  {/* //seccess */}
                  {success && <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 text-sm text-center"
                  >
                    OTP verified successfully!
                  </motion.p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={otpSubmitLoading || otp.some(digit => digit === '' || success)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {otpSubmitLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
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
                ) : 
                  otpReqLoading ? 'loading' :'Resend verification code'
                }
              </button>
            </div>
          </div>

        )}
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
            <Bell className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>

          {/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications on your devices</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div> */}

          {/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive important alerts via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div> */}
        </div>
      </motion.div>

      {/* Preferences */}
      {/* <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg">
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </motion.div> */}

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg transition-colors duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delete Account</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            disabled={true}
            >
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-all shadow-lg"
        >
          <Save className="w-5 h-5" />
          <span>Save All Settings</span>
        </motion.button>
      </motion.div> */}
    </div>
  </>);
};

export default AccountSettings;