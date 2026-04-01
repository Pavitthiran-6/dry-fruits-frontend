import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { HiSearch, HiCheck, HiX, HiClock, HiChevronDown } from 'react-icons/hi';

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
];

const AdminOrders = () => {
    const { orders } = useSelector((state) => state.orders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-700';
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getSelectedStatusLabel = () => {
        const selected = statusOptions.find(opt => opt.value === statusFilter);
        return selected ? selected.label : 'All Status';
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="w-full p-4 md:p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-sm md:text-base text-gray-600">Manage and track all customer orders</p>
            </div>

            {/* Search + Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
                <div className="flex flex-col gap-3 md:flex-row">

                    {/* Search */}
                    <div className="flex-1 relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Dropdown */}
                    <div className="relative w-full md:w-48" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
                        >
                            {getSelectedStatusLabel()}
                            <HiChevronDown className="w-5 h-5 text-gray-400" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setStatusFilter(option.value);
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[600px] md:min-w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 md:px-6 py-3 text-xs text-gray-500">Order</th>
                                <th className="px-4 md:px-6 py-3 text-xs text-gray-500">Customer</th>
                                <th className="px-4 md:px-6 py-3 text-xs text-gray-500">Date</th>
                                <th className="px-4 md:px-6 py-3 text-xs text-gray-500">Total</th>
                                <th className="px-4 md:px-6 py-3 text-xs text-gray-500">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="px-4 md:px-6 py-3 text-sm">{order.id}</td>
                                        <td className="px-4 md:px-6 py-3 text-sm">{order.userName || 'Guest'}</td>
                                        <td className="px-4 md:px-6 py-3 text-sm">{order.date || new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 md:px-6 py-3 text-sm font-medium">₹{order.total || order.totalPrice || 0}</td>
                                        <td className="px-4 md:px-6 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 md:px-6 py-12 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminOrders;
