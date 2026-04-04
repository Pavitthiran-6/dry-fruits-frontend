import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiShieldCheck, HiCheck, HiX } from 'react-icons/hi';
import { updateProfile } from '../store/slices/authSlice';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        orderUpdates: true,
        promotional: false,
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

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

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setPasswordError('');
        setPasswordSuccess(false);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (!passwordData.currentPassword) {
            setPasswordError('Current password is required');
            return;
        }

        const newPasswordError = validatePassword(passwordData.newPassword);
        if (newPasswordError) {
            setPasswordError(newPasswordError);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        // Simulate password change
        setPasswordSuccess(true);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
    };

    const handleNotificationChange = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto md:max-w-4xl"
                >
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Settings</h1>

                    {/* Tabs */}
                    <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'password'
                                ? 'bg-gradient-to-r from-amber-700 to-orange-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'notifications'
                                ? 'bg-gradient-to-r from-amber-700 to-orange-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Notifications
                        </button>
                    </div>

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-lg border border-gray-100">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-5 md:mb-6">Change Password</h2>

                            {passwordSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-5 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center"
                                >
                                    <HiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                                    <span className="text-sm md:text-base text-green-600 font-medium">Password changed successfully!</span>
                                </motion.div>
                            )}

                            <form onSubmit={handlePasswordSubmit} className="space-y-5 md:space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Current Password</label>
                                    <div className="relative">
                                        <HiShieldCheck className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-12 md:pl-14 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm md:text-base"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">New Password</label>
                                    <div className="relative">
                                        <HiShieldCheck className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-12 md:pl-14 pr-14 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm md:text-base"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    {passwordData.newPassword && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs md:text-sm font-medium text-gray-600 mb-2">Password must contain:</p>
                                            <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                                                <div className={`flex items-center ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {passwordData.newPassword.length >= 8 ? <HiCheck className="w-3 md:w-4 h-3 md:h-4 mr-1" /> : <HiX className="w-3 md:w-4 h-3 md:h-4 mr-1" />}
                                                    8 characters
                                                </div>
                                                <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? <HiCheck className="w-3 md:w-4 h-3 md:h-4 mr-1" /> : <HiX className="w-3 md:w-4 h-3 md:h-4 mr-1" />}
                                                    1 symbol
                                                </div>
                                                <div className={`flex items-center ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {/[0-9]/.test(passwordData.newPassword) ? <HiCheck className="w-3 md:w-4 h-3 md:h-4 mr-1" /> : <HiX className="w-3 md:w-4 h-3 md:h-4 mr-1" />}
                                                    1 number
                                                </div>
                                                <div className={`flex items-center ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {/[A-Z]/.test(passwordData.newPassword) ? <HiCheck className="w-3 md:w-4 h-3 md:h-4 mr-1" /> : <HiX className="w-3 md:w-4 h-3 md:h-4 mr-1" />}
                                                    1 uppercase
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Confirm New Password</label>
                                    <div className="relative">
                                        <HiShieldCheck className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-12 md:pl-14 pr-14 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm md:text-base"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="text-red-500 text-sm font-medium">
                                        {passwordError}
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-2"
                                >
                                    Update Password
                                </motion.button>

                                {/* Danger Zone */}
                                <div className="pt-4 md:pt-6 border-t border-gray-200">
                                    <h3 className="text-base md:text-lg font-medium text-red-600 mb-3 md:mb-4">Danger Zone</h3>
                                    <button className="w-full md:w-auto px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-sm md:text-base">
                                        Delete My Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-lg border border-gray-100">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-5 md:mb-6">Notification Preferences</h2>

                            <div className="space-y-5 md:space-y-6">
                                {/* Notification Channels */}
                                <div>
                                    <h3 className="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4">Notification Channels</h3>
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <span className="text-sm md:text-base text-gray-700">Email Notifications</span>
                                            <div
                                                onClick={() => handleNotificationChange('email')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.email ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${notifications.email ? 'translate-x-6' : ''}`} />
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <span className="text-sm md:text-base text-gray-700">SMS Notifications</span>
                                            <div
                                                onClick={() => handleNotificationChange('sms')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.sms ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${notifications.sms ? 'translate-x-6' : ''}`} />
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <span className="text-sm md:text-base text-gray-700">Push Notifications</span>
                                            <div
                                                onClick={() => handleNotificationChange('push')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.push ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${notifications.push ? 'translate-x-6' : ''}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Notification Types */}
                                <div className="pt-4 md:pt-6 border-t border-gray-100">
                                    <h3 className="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4">Notification Types</h3>
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <span className="text-sm md:text-base text-gray-700">Order Updates</span>
                                            <div
                                                onClick={() => handleNotificationChange('orderUpdates')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.orderUpdates ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${notifications.orderUpdates ? 'translate-x-6' : ''}`} />
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <span className="text-sm md:text-base text-gray-700">Promotional Emails</span>
                                            <div
                                                onClick={() => handleNotificationChange('promotional')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.promotional ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${notifications.promotional ? 'translate-x-6' : ''}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
