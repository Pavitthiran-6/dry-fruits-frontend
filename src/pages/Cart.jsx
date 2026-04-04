import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTrash, HiMinus, HiPlus, HiShoppingCart, HiArrowRight } from 'react-icons/hi';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const { items, totalItems, totalPrice } = useSelector((state) => state.cart);

    const handleQuantityChange = (id, quantity) => {
        dispatch(updateQuantity({ id, quantity }));
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const shipping = totalPrice > 500 ? 0 : 50;
    const grandTotal = totalPrice + shipping;

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-6 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 md:mb-8"
                >
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                        Your <span className="gradient-text">Cart</span>
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">{totalItems} items in your cart</p>
                </motion.div>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 md:py-16"
                    >
                        <div className="text-5xl md:text-8xl mb-4 md:mb-6">🛒</div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6 md:mb-8">Looks like you haven't added any dry fruits yet</p>
                        <Link
                            to="/products"
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <span>Start Shopping</span>
                            <HiArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <AnimatePresence>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6"
                                    >
                                        <div className="w-full sm:w-24 h-20 sm:h-24 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-500 text-xs md:text-sm mb-1 md:mb-2">{item.category}</p>
                                            <p className="text-lg md:text-xl font-bold gradient-text">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:flex-col md:flex-row gap-3 md:gap-4 mt-2 sm:mt-0">
                                            <div className="flex items-center bg-white rounded-full shadow-md">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-100 rounded-l-full transition-colors"
                                                >
                                                    <HiMinus className="w-4 h-4" />
                                                </button>
                                                <span className="px-3 md:px-4 py-1 font-semibold text-sm md:text-base">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-100 rounded-r-full transition-colors"
                                                >
                                                    <HiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemove(item.id)}
                                                className="p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <div className="flex flex-col sm:flex-row justify-between mt-4 md:mt-6 gap-3">
                                <button
                                    onClick={handleClearCart}
                                    className="text-red-500 hover:text-red-600 font-medium transition-colors text-sm md:text-base"
                                >
                                    Clear Cart
                                </button>
                                <Link
                                    to="/products"
                                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors text-sm md:text-base"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-6 sticky top-28">
                                <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-5 md:mb-6">Order Summary</h2>

                                <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                                        <span className="font-semibold">₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? (
                                                <span className="text-green-500">Free</span>
                                            ) : (
                                                `₹${shipping}`
                                            )}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs md:text-sm text-green-600">
                                            Add ₹{500 - totalPrice} more for free shipping!
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-3 md:pt-4 mb-5 md:mb-6">
                                    <div className="flex justify-between text-base md:text-xl font-bold">
                                        <span>Total</span>
                                        <span className="gradient-text">₹{grandTotal}</span>
                                    </div>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="block w-full py-3 md:py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white text-center text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
