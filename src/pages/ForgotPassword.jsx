import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        // Simulate sending OTP
        setSuccess(true);
        setTimeout(() => {
            navigate('/otp-verification', { state: { email } });
        }, 1500);
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
                                <h1 className="text-3xl font-bold text-gray-800">Forgot Password?</h1>
                                <p className="text-gray-600 mt-2">Enter your email to receive an OTP</p>
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
                                    <p className="text-green-600 font-medium">OTP sent successfully!</p>
                                    <p className="text-gray-500 text-sm mt-2">Redirecting to verification...</p>
                                </motion.div>
                            ) : (
                                /* Form */
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Email Address <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setError('');
                                                }}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                                className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-2"
                                    >
                                        Send OTP
                                    </motion.button>
                                </form>
                            )}

                            {/* Back to Login */}
                            <p className="mt-8 text-center text-gray-600">
                                Remember your password?{' '}
                                <Link to="/login" className="text-amber-700 font-semibold hover:text-amber-800">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
