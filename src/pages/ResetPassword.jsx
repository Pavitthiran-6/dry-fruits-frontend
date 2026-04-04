import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiShieldCheck, HiCheck, HiX } from 'react-icons/hi';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    // Check if user came from OTP verification
    useEffect(() => {
        // In a real app, you'd check if user is authenticated
        // For now, we just allow access
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);

        if (!minLength) return 'Password must be at least 8 characters';
        if (!hasSymbol) return 'Password must contain at least 1 symbol';
        if (!hasNumber) return 'Password must contain at least 1 number';
        if (!hasUpperCase) return 'Password must contain at least 1 uppercase letter';
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Simulate password reset
        setSuccess(true);
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col">
            <div className="flex-grow pt-24 md:pt-28 lg:pt-32 pb-24 md:pb-28 lg:pb-32 px-4">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                            {/* Logo and Title */}
                            <div className="text-center mb-8">
                                <Link to="/" className="inline-block">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">🥜</span>
                                    </div>
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
                                <p className="text-gray-600 mt-2">Create a new password for your account</p>
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
                                    <p className="text-green-600 font-medium">Password Reset Successfully!</p>
                                    <p className="text-gray-500 text-sm mt-2">Redirecting to home page...</p>
                                </motion.div>
                            ) : (
                                /* Form */
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New Password */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">New Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <HiShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                                className="w-full pl-14 pr-14 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        {/* Password Requirements */}
                                        {formData.newPassword && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-medium text-gray-600 mb-2">Password must contain:</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {formData.newPassword.length >= 8 ? <HiCheck className="w-4 h-4 mr-1" /> : <HiX className="w-4 h-4 mr-1" />}
                                                        8 characters
                                                    </div>
                                                    <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? <HiCheck className="w-4 h-4 mr-1" /> : <HiX className="w-4 h-4 mr-1" />}
                                                        1 symbol
                                                    </div>
                                                    <div className={`flex items-center ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {/[0-9]/.test(formData.newPassword) ? <HiCheck className="w-4 h-4 mr-1" /> : <HiX className="w-4 h-4 mr-1" />}
                                                        1 number
                                                    </div>
                                                    <div className={`flex items-center ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {/[A-Z]/.test(formData.newPassword) ? <HiCheck className="w-4 h-4 mr-1" /> : <HiX className="w-4 h-4 mr-1" />}
                                                        1 uppercase
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Confirm Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <HiShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                                className="w-full pl-14 pr-14 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                            </button>
                                        </div>
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
                                        Reset Password
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
