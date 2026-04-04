import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../store/slices/authSlice';
import Sidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar
                collapsed={collapsed}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div
                className={`
                    flex-1 flex flex-col min-w-0
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'md:ml-20' : 'md:ml-64'}
                `}
            >
                {/* Header Component */}
                <AdminHeader
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;