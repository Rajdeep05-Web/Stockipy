import React, { useState } from 'react';
import ForgotPassword from '../useful/resetPassword/forgetPassword';
import OTPVerification from '../useful/resetPassword/otpVerify';
import ResetPassword from '../useful/resetPassword/resetPassword';
import { useNavigate } from 'react-router-dom';

export const PasswordResetFlow = ({ onBackToLogin }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState('forgot');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleOTPSent = (userEmail) => {
        setEmail(userEmail);
        setCurrentStep('otp');
    };

    const handleOTPVerified = (verifiedOTP) => {
        setOtp(verifiedOTP);
        setCurrentStep('reset');
    };

    const handlePasswordReset = () => {
        setCurrentStep('login');
        if (onBackToLogin) {
            onBackToLogin();
        }
    };

    const handleBackToForgot = () => {
        setCurrentStep('forgot');
        setEmail('');
        setOtp('');
    };

    const handleBackToLogin = () => {
        if (onBackToLogin) {
            onBackToLogin();
        }
    };

    switch (currentStep) {
        case 'forgot':
            return (
                <ForgotPassword
                    onBackToLogin={handleBackToLogin}
                    onOTPSent={handleOTPSent}
                />
            );

        case 'otp':
            return (
                <OTPVerification
                    email={email}
                    onBackToForgot={handleBackToForgot}
                    onOTPVerified={handleOTPVerified}
                />
            );

        case 'reset':
            return (
                <ResetPassword
                    email={email}
                    otp={otp}
                    onPasswordReset={handlePasswordReset}
                    onBackToLogin={handleBackToLogin}
                />
            );

        default:
            return (
                <ForgotPassword
                    onBackToLogin={handleBackToLogin}
                    onOTPSent={handleOTPSent}
                />
            );
    }
};

export default PasswordResetFlow;
