import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiShieldCheck, HiMail } from 'react-icons/hi';
import { loginSuccess } from '../store/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }
        // Simulate login - dispatch login success with user data
        const userData = {
            id: 1,
            name: '',
            email: formData.email,
            phone: '',
            avatar: null,
        };
        dispatch(loginSuccess(userData));
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 flex flex-col">
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
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">🥜</span>
                                    </div>
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
                                <p className="text-gray-600 mt-2">Sign in to continue</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Row 1: Email and Password */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Email <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                                required
                                                className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors text-sm"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <HiShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                                required
                                                className="w-full pl-14 pr-14 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors text-sm"
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
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                        Forgot Password?
                                    </Link>
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
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-2"
                                >
                                    Sign In
                                </motion.button>
                            </form>

                            {/* Toggle to Sign Up */}
                            <p className="mt-8 text-center text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-700">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
