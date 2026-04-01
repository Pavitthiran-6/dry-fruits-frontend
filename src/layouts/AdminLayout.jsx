import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    HiHome,
    HiShoppingBag,
    HiUsers,
    HiCube,
    HiCog,
    HiLogout,
    HiMenu,
    HiX,
    HiChevronLeft,
    HiTag
} from 'react-icons/hi';
import { logout, adminLogout } from '../store/slices/authSlice';

const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HiHome },
    { name: 'Orders', path: '/admin/orders', icon: HiShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: HiUsers },
    { name: 'Inventory', path: '/admin/inventory', icon: HiCube },
    { name: 'Category', path: '/admin/category', icon: HiTag },
    { name: 'Settings', path: '/admin/settings', icon: HiCog },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Check for mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - always rendered, visible on desktop */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-900 z-50
                    flex flex-col
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🥜</span>
                        <span className="font-bold text-lg">Nutty Paradise</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg md:hidden"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        to="/"
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <HiLogout className="w-6 h-6" />
                        <span className="ml-3">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full md:ml-64">
                {/* Topbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden mr-3 p-1 text-gray-700 hover:text-purple-600"
                        >
                            {sidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                            Admin Panel
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <span className="hidden sm:inline text-gray-600 text-sm">Welcome, Admin</span>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
