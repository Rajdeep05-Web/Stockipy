import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Shield, Award, Clock } from 'lucide-react';
import { useDispatch } from "react-redux";
import ModalOTP from "./modalOTP";
import { forgetPassword, verifyOTP, resetPassword } from '../../redux/slices/auth/authSlice';

const userProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@stockflow.com',
  phone: '',
  address: '123 Business Ave',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94105',
  country: 'United States',
  jobTitle: 'Inventory Manager',
  department: 'Operations',
  joinDate: '2022-03-15',
  lastLogin: '2024-01-15 09:30 AM',
  bio: 'Experienced inventory manager with over 8 years in supply chain management. Passionate about optimizing warehouse operations and implementing efficient inventory systems.'
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [role, setRole] = useState('');
  const [userProfilePicture, setUserProfilePicture] = useState("");

  //otp and email
  const [isEmailVerified, setIsEmailVerified] = useState(false);
const inputRefs = useRef([]);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);  //ch
  const [authMsg, setAuthMsg] = useState('');
  const [otpReqLoading, setOtpReqLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('');
  const [otpSubmitLoading, setOtpSubmitLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserEmail(user.email);
    setUserName(user.name);
    setLastLogin(UTCtoIST(user.lastLogin));
    setJoinDate(UTCtoISTShort(user.createdAt));
    setRole(user.role);
    setIsEmailVerified(user.isEmailVerified);
    setUserProfilePicture(user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=ffffff`); // Fallback to generated avatar based on name
  }, [localStorage.getItem('user')])

  const handleEditFormInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  const UTCtoISTShort = (utcTimestamp) => {
    if(!utcTimestamp) return;
    const dateObj = new Date(utcTimestamp);
    const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
    };
const istReadableTime = new Intl.DateTimeFormat('en-IN', options).format(dateObj);
 return istReadableTime;
  }

  const UTCtoIST = (utcTimestamp) => {
    if(!utcTimestamp) return;
    const dateObj = new Date(utcTimestamp);
    const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Use 12-hour format (AM/PM)
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short' // Add the "IST" abbreviation
    };
  const istReadableTime = new Intl.DateTimeFormat('en-IN', options).format(dateObj);
  return istReadableTime;
  }

  const getInitials = () => {
    if(userName.includes(' ')) {
      const [firstname] = userName.split(' ')[0] || " ";
      const [lastName] = userName.split(' ')[1] || " ";
      return `${firstname.toUpperCase()}${lastName?.toUpperCase()}`;
    } else {
      return userName.charAt(0).toUpperCase();
    }
  };

  //OTP handlers
  const handleEmailVerify = async () => {
    setIsOTPModalVisible(!isOTPModalVisible);
    await reqOtpForForgetPassword();
  }

  const reqOtpForForgetPassword = async () => {
      setOtpReqLoading(true);
      try {
        const res = await dispatch(forgetPassword(userEmail)).unwrap();
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

  const handleVerifyOTP = async (otpCode) => {
      setOtpSubmitLoading(true);
      setError('');
      try {
        await dispatch(verifyOTP({ email: userEmail, otp: otpCode })).unwrap();
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

  return (
    <>
      <ModalOTP
        isModalVisible={isOTPModalVisible}
        setIsModalVisible={setIsOTPModalVisible}
        isOtpSent={isOtpSent}
        isOtpVerified={isOtpVerified}
        authMsg={authMsg}
        errorMsg={errorMsg}
        successMsg={successMsg}
        handleVerifyOTP={handleVerifyOTP}
        setError={setError}
        error={error}
        setSuccess={setSuccess}
        success={success}
        otpSubmitLoading={otpSubmitLoading}
        handleResend={handleResend}
        countdown={countdown}
        setOtp={setOtp}
        otp={otp}
        otpReqLoading={otpReqLoading}
        inputRefs={inputRefs}
      />
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and preferences</p>
        </div>
        
        {/* Edit Btn */}
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
            isEditing 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isEditing ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Edit className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </motion.button> */}
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-lg transition-colors duration-300"
      >
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
              {/* {formData.firstName[0]}{formData.lastName[0]} */}
              {userProfilePicture ? (
                      <img src={userProfilePicture} alt="User Avatar" className="w-full h-full rounded-full" />
                    ) : (
                      getInitials()
                    )}
            </div>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="space-y-2">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleEditFormInputChange('firstName', e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleEditFormInputChange('lastName', e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  <span>{userName || `${formData.firstName} ${formData.lastName}`}</span>
                </h3>
              )}
              
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userEmail || formData.email} {isEmailVerified ?
                   <> (<span className='font-bold text-green-500'>verified</span>) </>
                   :
                    <button
                      type="button"
                      onClick={handleEmailVerify}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs w-full sm:w-auto px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                     { otpReqLoading ? <span>loading</span> : <span>Verifiy</span> }
                    </button>
                    // <span className='font-bold text-red-500'>Not verified</span>
                   }</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">{role || formData.jobTitle}</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {joinDate || new Date(formData.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Personal Information</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEditFormInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{userEmail || formData.email}</p>
              )}
            </div>

            {formData.phone && <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleEditFormInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.phone}</p>
              )}
            </div>}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleEditFormInputChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.jobTitle}</p>
              )}
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleEditFormInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.department}</p>
              )}
            </div> */}

            {/* <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleEditFormInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.address}</p>
              )}
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleEditFormInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.city}</p>
              )}
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State / ZIP</label>
              {isEditing ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleEditFormInputChange('state', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleEditFormInputChange('zipCode', e.target.value)}
                    className="w-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="ZIP"
                  />
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.state} {formData.zipCode}</p>
              )}
            </div> */}

            {/* <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleEditFormInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.bio}</p>
              )}
            </div> */}
          </div>

          {isEditing && (
            <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Achievements & Activity */}
        <div className="space-y-6">
          {/* Achievements */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Achievements</h4>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-lg`}>
                    <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}

          {/* Activity Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity Summary</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{lastLogin || formData.lastLogin}</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
              </div> */}
              {/* <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Session</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">2h 15m</span>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </>);
};

export default ProfilePage;