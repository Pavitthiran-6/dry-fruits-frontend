import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiUser,
    HiClipboardList,
    HiHeart,
    HiBell,
    HiLocationMarker,
    HiCog,
    HiLogout,
    HiShoppingBag,
    HiShoppingCart
} from 'react-icons/hi';

const ProfileDashboard = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Please login to view your profile.</p>
                    <Link to="/login" className="mt-4 inline-block text-purple-600 hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const menuItems = [
        { name: 'My Orders', icon: HiClipboardList, path: '/orders', color: 'from-pink-500 to-purple-500' },
        { name: 'Cart', icon: HiShoppingCart, path: '/cart', color: 'from-orange-500 to-yellow-500' },
        { name: 'Wishlist', icon: HiHeart, path: '/wishlist', color: 'from-pink-500 to-red-500' },
        { name: 'Notifications', icon: HiBell, path: '/settings', color: 'from-yellow-500 to-orange-500' },
        { name: 'My Profile', icon: HiUser, path: '/profile', color: 'from-green-500 to-teal-500' },
        { name: 'Location', icon: HiLocationMarker, path: '/settings', color: 'from-blue-500 to-indigo-500' },
        { name: 'Settings', icon: HiCog, path: '/settings', color: 'from-gray-500 to-gray-700' },
    ];

    const desktopMenuItems = [
        ...menuItems,
        { name: 'Sign Out', icon: HiLogout, path: 'logout', color: 'from-red-500 to-pink-500', isButton: true },
    ];

    const mobileMenuItems = menuItems.filter(item =>
        item.name === 'My Orders' || item.name === 'Cart' || item.name === 'Wishlist' || item.name === 'Settings'
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-gray-50">
            <div className="max-w-md mx-auto px-4 sm:px-5">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 rounded-2xl p-5 md:p-6 text-white mb-5 md:mb-6"
                >
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                            {user?.avatar && user.avatar.startsWith('data:image') ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : user?.avatar ? (
                                <span className="text-2xl md:text-3xl">{user.avatar}</span>
                            ) : user?.name ? (
                                <span className="text-2xl md:text-3xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <HiUser className="w-7 md:w-8 h-7 md:h-8 text-white" />
                            )}
                        </div>
                        <div>
                            {user?.name && <h2 className="text-lg md:text-xl font-bold">{user.name}</h2>}
                            {user?.email && <p className="text-white/80 text-xs md:text-sm">{user.email}</p>}
                            {user?.phone && <p className="text-white/80 text-xs md:text-sm">{user.phone}</p>}
                        </div>
                    </div>
                    <div className="mt-3 md:mt-4 flex items-center justify-between">
                        <Link
                            to="/profile"
                            className="px-3 md:px-4 py-2 bg-white/20 rounded-lg text-xs md:text-sm font-medium hover:bg-white/30 transition-colors"
                        >
                            Edit Profile
                        </Link>
                        <Link
                            to="/orders"
                            className="hidden md:flex items-center space-x-1 text-xs md:text-sm"
                        >
                            <HiShoppingBag className="w-4 md:w-5 h-4 md:h-5" />
                            <span>View Orders</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Menu Items - Mobile View */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-2xl shadow-sm overflow-hidden md:hidden"
                >
                    {mobileMenuItems.map((item, index) => (
                        <motion.div key={item.name} variants={itemVariants}>
                            <Link
                                to={item.path}
                                className="flex items-center px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-9 md:w-10 h-9 md:h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mr-3 md:mr-4`}>
                                    <item.icon className="w-4 md:w-5 h-4 md:h-5 text-white" />
                                </div>
                                <span className="font-medium text-sm md:text-base text-gray-800">{item.name}</span>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Sign Out - Mobile */}
                    <motion.div variants={itemVariants}>
                        <button
                            className="flex items-center w-full px-4 md:px-6 py-3 md:py-4 text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                                window.location.href = '/';
                            }}
                        >
                            <div className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mr-3 md:mr-4">
                                <HiLogout className="w-4 md:w-5 h-4 md:h-5 text-white" />
                            </div>
                            <span className="font-medium text-sm md:text-base">Sign Out</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Menu Items - Desktop View */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hidden md:block"
                >
                    {menuItems.map((item, index) => (
                        <motion.div key={item.name} variants={itemVariants}>
                            <Link
                                to={item.path}
                                className="flex items-center px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mr-4`}>
                                    <item.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-gray-800">{item.name}</span>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Sign Out - Desktop */}
                    <motion.div variants={itemVariants}>
                        <button
                            className="flex items-center w-full px-6 py-4 text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                                window.location.href = '/';
                            }}
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mr-4">
                                <HiLogout className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* App Info */}
                <div className="mt-5 md:mt-6 text-center text-gray-400 text-xs md:text-sm">
                    <p>Nutty Paradise v1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
