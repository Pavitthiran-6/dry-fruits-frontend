import { Link, useLocation } from 'react-router-dom';
import {
    HiHome,
    HiShoppingBag,
    HiUsers,
    HiCube,
    HiCog,
    HiLogout,
    HiTag,
    HiGift
} from 'react-icons/hi';

const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HiHome },
    { name: 'Orders', path: '/admin/orders', icon: HiShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: HiUsers },
    { name: 'Inventory', path: '/admin/inventory', icon: HiCube },
    { name: 'Category', path: '/admin/category', icon: HiTag },
    { name: 'Coupons', path: '/admin/coupons', icon: HiGift },
    { name: 'Settings', path: '/admin/settings', icon: HiCog },
];

const Sidebar = ({ collapsed, sidebarOpen, setSidebarOpen, handleLogout }) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`
                    fixed top-0 left-0 h-full bg-gray-900 z-50
                    flex flex-col
                    transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    ${collapsed ? 'w-20' : 'w-64'}
                `}
            >
                {/* Logo Section */}
                <div className={`h-16 flex items-center border-b border-gray-800 transition-all duration-300 ${collapsed ? 'justify-center px-0' : 'px-6'}`}>
                    <Link to="/admin/dashboard" className="flex items-center space-x-3 overflow-hidden">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-2xl">
                            🥜
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-xl whitespace-nowrap bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent transform transition-all duration-300 opacity-100">
                                Nutty Paradise
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={collapsed ? item.name : ""}
                                className={`
                                    flex items-center mx-3 py-3 rounded-lg transition-all duration-200
                                    ${collapsed ? 'justify-center px-0' : 'px-4'}
                                    ${isActive 
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}
                                `}
                            >
                                <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                                {!collapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Section */}
                <div className={`p-4 border-t border-gray-800 bg-gray-900/50 transition-all duration-300`}>
                    <button
                        onClick={handleLogout}
                        title={collapsed ? "Logout" : ""}
                        className={`
                            flex items-center w-full py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200
                            ${collapsed ? 'justify-center px-0' : 'px-4'}
                        `}
                    >
                        <HiLogout className="w-6 h-6 flex-shrink-0" />
                        {!collapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap transition-opacity duration-300">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
