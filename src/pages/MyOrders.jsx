import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiClock, HiCheck, HiX, HiExternalLink, HiShoppingBag } from 'react-icons/hi';

const MyOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const { orders } = useSelector((state) => state.orders);
    const [userOrders, setUserOrders] = useState([]);

    // Filter orders for current user
    useEffect(() => {
        if (user?.email && orders.length > 0) {
            // Filter orders by user email
            const filteredOrders = orders.filter(order => order.userId === user.email);
            setUserOrders(filteredOrders);
        } else {
            setUserOrders([]);
        }
    }, [orders, user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <HiCheck className="w-5 h-5 text-green-600" />;
            case 'Cancelled':
                return <HiX className="w-5 h-5 text-red-600" />;
            default:
                return <HiClock className="w-5 h-5 text-yellow-600" />;
        }
    };

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

    // Get product info from order
    const getProductInfo = (order) => {
        if (order.items && order.items.length > 0) {
            const item = order.items[0];
            return {
                name: item.name || 'Product',
                image: item.image || '🥜',
                price: item.price || 0,
                quantity: item.quantity || 1
            };
        }
        return {
            name: 'Product',
            image: '🥜',
            price: 0,
            quantity: 1
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto md:max-w-4xl lg:max-w-7xl"
                >
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 md:mb-8">My Orders</h1>

                    {userOrders.length === 0 ? (
                        <div className="text-center py-12 md:py-16 bg-white rounded-3xl shadow-lg">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <HiShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-600 text-base md:text-lg mb-2">You haven't placed any orders yet.</p>
                            <p className="text-gray-500 text-sm md:text-base mb-5 md:mb-6">Start shopping to see your orders here</p>
                            <Link
                                to="/products"
                                className="inline-block px-5 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full hover:from-pink-600 hover:to-purple-600 transition-all text-sm md:text-base"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5 md:space-y-6">
                            {userOrders.map((order) => {
                                const product = getProductInfo(order);
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-gray-100"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center text-4xl md:text-5xl flex-shrink-0">
                                                {product.image}
                                            </div>

                                            {/* Order Details */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
                                                    <div>
                                                        <h3 className="text-base md:text-xl font-semibold text-gray-800">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-gray-500 mt-0 md:mt-1 text-xs md:text-sm">
                                                            Order ID: {order.id}
                                                        </p>
                                                        <p className="text-gray-500 text-xs md:text-sm">
                                                            Ordered on: {order.date || new Date(order.createdAt).toLocaleDateString('en-GB')}
                                                        </p>
                                                    </div>
                                                    <div className={`self-start sm:self-auto px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 md:gap-2 ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="text-xs md:text-sm font-medium">{order.status}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                                                    <div className="flex items-center gap-2 md:gap-4">
                                                        <span className="text-gray-600 text-sm">
                                                            Qty: {product.quantity}
                                                        </span>
                                                        <span className="text-gray-400">|</span>
                                                        <span className="text-lg md:text-xl font-bold text-purple-600">
                                                            ₹{order.total || order.totalPrice || product.price * product.quantity}
                                                        </span>
                                                    </div>
                                                    <button className="flex items-center gap-1.5 md:gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors text-sm">
                                                        View Details
                                                        <HiExternalLink className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MyOrders;
