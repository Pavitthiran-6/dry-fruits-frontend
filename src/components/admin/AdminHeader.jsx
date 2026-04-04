import { HiMenu, HiX } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const AdminHeader = ({ collapsed, setCollapsed, sidebarOpen, setSidebarOpen }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
            <div className="flex items-center space-x-4">
                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <HiMenu className={`w-6 h-6 transform transition-transform duration-300 ${collapsed ? '' : 'rotate-180 scale-x-[-1]'}`} />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                    {sidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>

                <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
                    Admin <span className="text-orange-600 hidden sm:inline">Dashboard</span>
                </h1>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
                {/* User Profile */}
                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="flex flex-col items-end hidden sm:flex text-right">
                        <span className="text-sm font-semibold text-gray-700 leading-tight">
                            {user?.name || 'Admin'}
                        </span>
                        <span className="text-xs text-gray-400 leading-tight capitalise">
                            {user?.role || 'Administrator'}
                        </span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30 transform group-hover:rotate-6 transition-transform">
                        {user?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
