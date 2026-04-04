import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 4) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }

        // Simulate OTP verification (accept any 4-digit code)
        setSuccess(true);
        setTimeout(() => {
            navigate('/reset-password');
        }, 1500);
    };

    const handleResend = () => {
        // Simulate resending OTP
        setError('');
        alert('OTP resent to your email!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col">
            <div className="flex-grow pt-24 md:pt-28 lg:pt-32 pb-24 md:pb-28 lg:pb-32 px-4">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                            {/* Logo and Title */}
                            <div className="text-center mb-8">
                                <Link to="/" className="inline-block">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">🥜</span>
                                    </div>
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-800">Verify OTP</h1>
                                <p className="text-gray-600 mt-2">Enter the 4-digit code sent to</p>
                                <p className="text-amber-700 font-medium">{email}</p>
                            </div>

                            {/* Success Message */}
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">✓</span>
                                    </div>
                                    <p className="text-green-600 font-medium">OTP Verified Successfully!</p>
                                    <p className="text-gray-500 text-sm mt-2">Redirecting to reset password...</p>
                                </motion.div>
                            ) : (
                                /* Form */
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* OTP Input Boxes */}
                                    <div className="flex justify-center gap-3" onPaste={handlePaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-16 h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors"
                                                placeholder="0"
                                            />
                                        ))}
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm text-center font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-2"
                                    >
                                        Verify OTP
                                    </motion.button>

                                    {/* Resend OTP */}
                                    <div className="text-center">
                                        <p className="text-gray-600">
                                            Didn't receive the code?{' '}
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                className="text-amber-700 font-semibold hover:text-amber-800"
                                            >
                                                Resend OTP
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            )}

                            {/* Back to Forgot Password */}
                            <p className="mt-8 text-center text-gray-600">
                                <Link to="/forgot-password" className="text-amber-700 font-semibold hover:text-amber-800">
                                    Change Email Address
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
