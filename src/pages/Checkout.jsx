import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck, HiCreditCard, HiLocationMarker, HiShoppingCart } from 'react-icons/hi';
import { clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/ordersSlice';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
    const [currentStep, setCurrentStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'card',
    });

    const shipping = totalPrice > 500 ? 0 : 50;
    const grandTotal = totalPrice + shipping;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePlaceOrder = async () => {
        const orderData = {
            items,
            shippingAddress: formData,
            paymentMethod: formData.paymentMethod,
            subtotal: totalPrice,
            shipping,
            total: grandTotal,
        };

        await dispatch(createOrder(orderData));
        dispatch(clearCart());
        setOrderPlaced(true);
    };

    if (items.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-20 md:pt-24 pb-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
                    <div className="text-5xl md:text-8xl mb-4 md:mb-6">🛒</div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Your cart is empty</h2>
                    <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
                        <span>Start Shopping</span>
                    </Link>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-20 md:pt-24 pb-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-16 md:w-24 h-16 md:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
                        >
                            <HiCheck className="w-8 md:w-12 h-8 md:h-12 text-white" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Order Placed Successfully!</h1>
                        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
                            Thank you for your order. We'll send you a confirmation email shortly.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <Link to="/" className="btn-primary">
                                Back to Home
                            </Link>
                            <Link to="/products" className="btn-secondary">
                                Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const steps = [
        { number: 1, title: 'Shipping', icon: HiLocationMarker },
        { number: 2, title: 'Payment', icon: HiCreditCard },
        { number: 3, title: 'Review', icon: HiShoppingCart },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-6 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 md:mb-8"
                >
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                        Checkout
                    </h1>
                </motion.div>

                {/* Step Indicator */}
                <div className="flex justify-center mb-8 md:mb-12 overflow-visible px-2 md:px-0">
                    <div className="flex items-center flex-nowrap whitespace-nowrap">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center gap-1 md:gap-3">
                                <div className={`flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full transition-colors ${currentStep >= step.number
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {currentStep > step.number ? (
                                        <HiCheck className="w-4 h-4 md:w-6 md:h-6" />
                                    ) : (
                                        <step.icon className="w-4 h-4 md:w-6 md:h-6" />
                                    )}
                                </div>
                                <span className={`text-xs md:text-sm font-medium ${currentStep >= step.number ? 'text-gray-800' : 'text-gray-500'
                                    }`}>
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-6 md:w-16 h-0.5 md:h-1 mx-1 md:mx-4 rounded ${currentStep > step.number
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                                        : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card rounded-3xl p-8"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-600 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors"
                                                placeholder="400001"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-gray-600 mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors"
                                                placeholder="123 Main Street"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-purple-400 focus:outline-none transition-colors"
                                                placeholder="Mumbai"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button onClick={handleNext} className="btn-primary">
                                            Continue to Payment
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card rounded-3xl p-8"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
                                    <div className="space-y-4">
                                        <label className="flex items-center p-4 border-2 border-purple-400 rounded-xl cursor-pointer bg-purple-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={formData.paymentMethod === 'card'}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-purple-600"
                                            />
                                            <div className="ml-4">
                                                <span className="font-medium">Credit/Debit Card</span>
                                                <p className="text-sm text-gray-500">Pay securely with your card</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-purple-200 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="upi"
                                                checked={formData.paymentMethod === 'upi'}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-purple-600"
                                            />
                                            <div className="ml-4">
                                                <span className="font-medium">UPI</span>
                                                <p className="text-sm text-gray-500">Pay using UPI apps</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-purple-200 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-purple-600"
                                            />
                                            <div className="ml-4">
                                                <span className="font-medium">Cash on Delivery</span>
                                                <p className="text-sm text-gray-500">Pay when you receive</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between mt-5 md:mt-6 gap-3">
                                        <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 text-sm md:text-base">
                                            Back
                                        </button>
                                        <button onClick={handleNext} className="btn-primary w-full sm:w-auto">
                                            Review Order
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8"
                                >
                                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-5 md:mb-6">Order Summary</h2>

                                    <div className="mb-5 md:mb-6">
                                        <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Shipping Address</h3>
                                        <p className="text-gray-600 text-sm md:text-base">{formData.name}</p>
                                        <p className="text-gray-600 text-sm md:text-base">{formData.address}</p>
                                        <p className="text-gray-600 text-sm md:text-base">{formData.city}, {formData.pincode}</p>
                                        <p className="text-gray-600 text-sm md:text-base">{formData.phone}</p>
                                    </div>

                                    <div className="mb-5 md:mb-6">
                                        <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Payment Method</h3>
                                        <p className="text-gray-600 capitalize text-sm md:text-base">{formData.paymentMethod}</p>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 md:pt-6">
                                        <h3 className="font-semibold text-gray-700 mb-3 md:mb-4 text-sm md:text-base">Items ({totalItems})</h3>
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between mb-2 text-sm">
                                                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                                                <span className="font-medium">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between mt-5 md:mt-6 gap-3">
                                        <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 text-sm md:text-base">
                                            Back
                                        </button>
                                        <button onClick={handlePlaceOrder} className="btn-primary w-full sm:w-auto">
                                            Place Order - ₹{grandTotal}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-6 sticky top-28">
                            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-5 md:mb-6">Order Total</h2>
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">
                                        {shipping === 0 ? <span className="text-green-500">Free</span> : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 md:pt-4">
                                    <div className="flex justify-between text-base md:text-xl font-bold">
                                        <span>Total</span>
                                        <span className="gradient-text">₹{grandTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
