import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiHeart, HiShoppingCart, HiUser, HiChevronDown, HiLogout, HiCog, HiClipboardList } from 'react-icons/hi';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.totalItems);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Cart', path: '/cart' },
    ];

    const navVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setIsProfileOpen(false);
    };

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className={`fixed top-0 left-0 right-0 w-full z-50 box-border transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="w-full px-4 md:px-8">
                <div className="flex items-center justify-between h-20 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 flex items-center justify-center"
                        >
                            <span className="text-white text-xl font-bold">🥜</span>
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">Nutty Paradise</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.filter(link => link.name !== 'Cart').map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative py-2 text-lg font-medium transition-colors ${location.pathname === link.path
? 'text-amber-700'
: 'text-gray-700 hover:text-amber-700'
                                    }`}
                            >
                                {link.name}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: location.pathname === link.path ? 1 : 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 origin-left"
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Show profile dropdown when logged in */}
                        {isAuthenticated ? (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {user?.avatar && user.avatar.startsWith('data:image') ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : user?.avatar ? (
                                            <span className="text-xl">{user.avatar}</span>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                        )}
                                    </div>
                                    <HiChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[100]"
                                        >
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-amber-50 transition-colors"
                                                >
                                                    <HiUser className="w-5 h-5 mr-3" />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-amber-50 transition-colors"
                                                >
                                                    <HiClipboardList className="w-5 h-5 mr-3" />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-amber-50 transition-colors"
                                                >
                                                    <HiCog className="w-5 h-5 mr-3" />
                                                    Settings
                                                </Link>
                                            </div>
                                            <div className="border-t border-gray-100 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <HiLogout className="w-5 h-5 mr-3" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-amber-700 transition-colors">
                                    <span className="font-medium">Login</span>
                                </Link>
                                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-medium rounded-lg hover:from-amber-700 hover:to-orange-600 transition-all">
                                    Sign Up
                                </Link>
                            </>
                        )}
                        <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-pink-500 transition-colors">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <HiHeart className="w-6 h-6" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </motion.div>
                        </Link>
                        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-amber-700 transition-colors">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <HiShoppingCart className="w-6 h-6" />
                                {cartItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-700 to-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {cartItems}
                                    </motion.span>
                                )}
                            </motion.div>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        {/* Mobile Profile Button */}
                        {isAuthenticated ? (
                            <Link
                                to="/profile-dashboard"
                                className="p-2 text-gray-700 mr-2"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {user?.avatar && user.avatar.startsWith('data:image') ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : user?.avatar ? (
                                        <span className="text-xl">{user.avatar}</span>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    )}
                                </div>
                            </Link>
                        ) : null}
                        <button
                            className="p-2 text-gray-700 relative"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <HiX className="w-8 h-8" />
                            ) : (
                                <HiMenu className="w-8 h-8" />
                            )}
                            {cartItems > 0 && (
                                <span className="absolute -top-0 -right-0 w-4 h-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cartItems > 9 ? '9+' : cartItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block py-3 px-4 rounded-lg font-medium transition-colors ${location.pathname === link.path
                                            ? 'bg-gradient-to-r from-amber-700/10 to-orange-600/10 text-amber-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {link.name}
                                        {link.name === 'Cart' && cartItems > 0 && (
                                            <span className="ml-2 bg-gradient-to-r from-amber-700 to-orange-600 text-white text-xs px-2 py-1 rounded-full">
                                                {cartItems}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                            {!isAuthenticated && (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login / Signup
                                </Link>
                            )}
                            {/* Mobile Auth Options */}
                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/wishlist"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Wishlist
                                        {wishlistItems.length > 0 && (
                                            <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                                                {wishlistItems.length}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-3 px-4 rounded-lg font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
