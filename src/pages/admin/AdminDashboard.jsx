import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiShoppingBag } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const [revenue, setRevenue] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [rating, setRating] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { orders } = useSelector((state) => state.orders);

    useEffect(() => {
        setLoading(false);
        if (orders && orders.length > 0) {
            setOrdersCount(orders.length);
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalPrice || 0), 0);
            setRevenue(totalRevenue);
        }
    }, [orders]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <span className="text-green-600">&#10003;</span>;
            case 'Processing': return <span className="text-blue-600">&#9203;</span>;
            case 'Cancelled': return <span className="text-red-600">&#10007;</span>;
            default: return <span className="text-yellow-600">&#9203;</span>;
        }
    };

    const stats = [
        { title: 'Total Revenue', value: revenue > 0 ? revenue.toString() : '--', color: 'from-green-500 to-emerald-500' },
        { title: 'Total Orders', value: ordersCount > 0 ? ordersCount.toString() : '--', color: 'from-blue-500 to-cyan-500' },
        { title: 'Customers', value: customersCount > 0 ? customersCount.toString() : '--', color: 'from-purple-500 to-pink-500' },
        { title: 'Avg Rating', value: rating > 0 ? rating.toFixed(1) : '--', color: 'from-yellow-500 to-orange-500' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome to Nutty Paradise Admin Panel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center text-white font-bold">
                            ?
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
                    {recentOrders && recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">{order.id}</p>
                                        <p className="text-sm text-gray-500">{order.customer} - {order.items} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">{order.total}</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)} {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <HiShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No orders available yet</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h2>
                    {topProducts && topProducts.length > 0 ? (
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={product.name} className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.sold} sold</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-purple-600">{product.revenue}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <HiShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No products data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
