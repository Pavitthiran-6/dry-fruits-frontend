import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCog, HiUser, HiBell, HiShieldCheck } from 'react-icons/hi';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', name: 'Profile', icon: HiUser },
        { id: 'notifications', name: 'Notifications', icon: HiBell },
        { id: 'security', name: 'Security', icon: HiShieldCheck },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
                <p className="text-gray-600">Manage your admin account and preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex justify-between md:justify-start md:space-x-8 px-2 md:px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 md:flex-none flex items-center justify-center py-3 md:py-4 border-b-2 font-medium text-xs md:text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                                <span className="hidden sm:inline">{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Admin"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@nuttyparadise.com"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        defaultValue="Super Admin"
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex-1 pr-4">
                                        <p className="font-medium text-gray-800">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive email updates for new orders</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-600 peer-checked:to-orange-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex-1 pr-4">
                                        <p className="font-medium text-gray-800">Order Alerts</p>
                                        <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-600 peer-checked:to-orange-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex-1 pr-4">
                                        <p className="font-medium text-gray-800">Low Stock Alerts</p>
                                        <p className="text-sm text-gray-500">Alert when products are running low</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-600 peer-checked:to-orange-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex-1 pr-4">
                                        <p className="font-medium text-gray-800">Customer Messages</p>
                                        <p className="text-sm text-gray-500">Get notified of new customer inquiries</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-600 peer-checked:to-orange-500"></div>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
