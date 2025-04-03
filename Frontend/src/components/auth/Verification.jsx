import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Verification = () => {
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    // Handle OTP input change
    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus to next input
        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    // Handle key down events
    const handleKeyDown = (index, e) => {
        // On backspace, clear current field and focus previous (if exists)
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    const sendOTP = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/otp/send`, { email });
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    }

    useEffect(() => {
        sendOTP();
        inputRefs[0].current.focus();
    }, []);

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedOtp = pastedData.slice(0, 4).split('');

        if (/^\d+$/.test(pastedData) && pastedOtp.length <= 4) {
            const newOtp = [...otp];
            pastedOtp.forEach((value, index) => {
                if (index < 4) newOtp[index] = value;
            });
            setOtp(newOtp);

            // Focus the next empty input or the last one
            const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
            const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
            inputRefs[focusIndex].current.focus();
        }
    };

    // Handle verification submission
    const handleVerify = async () => {
        try {
            setIsVerifying(true);
            const otpString = otp.join('');
            const otpNumber = Number(otpString); // Convert to number before sending

            console.log("Verifying OTP:", otpNumber);
            console.log("Email:", email);

            const response = await axios.post(`${BACKEND_URL}/otp/verify`, {
                email,
                otp: otpNumber // Ensure this is a number
            });

            if (response.data.success) {
                alert("OTP verified successfully!");
                window.location.href = '/onboarding';
                localStorage.removeItem('email');
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle resend OTP
    const handleResend = () => {
        if (!canResend) return;
        setTimeLeft(60);
        setCanResend(false);
        setOtp(['', '', '', '']);
        // Here you would add the logic to resend OTP
        sendOTP();
        inputRefs[0].current.focus();
        alert("New OTP sent!");
    };

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-stone-800 mb-2">Verify Your Email</h1>
                    <p className="text-stone-600">
                        We've sent a verification code to
                    </p>
                    <p className="font-medium text-stone-800">{email}</p>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-stone-600 mb-3">
                        Enter 4-digit verification code
                    </label>
                    <div className="flex justify-between gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-full h-14 text-center text-xl font-bold rounded-md border border-stone-300 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none transition-colors"
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleVerify}
                    disabled={otp.join('').length !== 4 || isVerifying}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${otp.join('').length === 4 && !isVerifying
                        ? 'bg-stone-800 text-white hover:bg-stone-900'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                >
                    {isVerifying ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        'Verify'
                    )}
                </button>

                <div className="mt-6 text-center">
                    <p className="text-sm text-stone-600 mb-2">
                        Didn't receive the code?
                    </p>

                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-stone-800 font-medium hover:text-stone-600 transition-colors"
                        >
                            Resend Code
                        </button>
                    ) : (
                        <div className="text-sm text-stone-500">
                            Request new code in <span className="font-medium">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200 text-center">
                    <p className="text-sm text-stone-600">
                        Having trouble? <a href="#" className="text-stone-800 font-medium hover:text-stone-600 transition-colors">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Verification;