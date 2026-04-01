import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiShoppingCart, HiTrash, HiStar, HiArrowRight } from 'react-icons/hi';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.wishlist);
    const cartItems = useSelector((state) => state.cart.items);

    const handleRemove = (id) => {
        dispatch(removeFromWishlist(id));
    };

    const handleMoveToCart = (product) => {
        if (cartItems.some((item) => item.id === product.id)) {
            dispatch(removeFromCart(product.id));
        } else {
            dispatch(addToCart(product));
        }
        dispatch(removeFromWishlist(product.id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-6 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 md:mb-8"
                >
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                        Your <span className="gradient-text">Wishlist</span>
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">{items.length} items in your wishlist</p>
                </motion.div>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 md:py-16"
                    >
                        <div className="text-5xl md:text-8xl mb-4 md:mb-6">💝</div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6 md:mb-8">Save your favorite dry fruits for later!</p>
                        <Link
                            to="/products"
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <span>Browse Products</span>
                            <HiArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                        }}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
                    >
                        <AnimatePresence>
                            {items.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -5 }}
                                    className="glass-card rounded-2xl md:rounded-3xl p-3 md:p-4 card-hover"
                                >
                                    <div className="relative h-32 md:h-48 mb-3 md:mb-4 overflow-hidden rounded-xl md:rounded-2xl">
                                        <Link to={`/product/${product.id}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="absolute top-2 md:top-3 right-2 md:right-3 p-1.5 md:p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                                        >
                                            <HiTrash className="w-4 md:w-5 h-4 md:h-5 text-red-500" />
                                        </button>
                                    </div>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-1 md:mb-2 hover:text-purple-600 transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center mb-2 md:mb-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <HiStar
                                                    key={i}
                                                    className={`w-3 md:w-4 h-3 md:h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-500 text-xs md:text-sm ml-1 md:ml-2">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg md:text-2xl font-bold gradient-text">
                                            ₹{product.price}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleMoveToCart(product)}
                                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow flex items-center space-x-1 text-xs md:text-sm ${cartItems.some((item) => item.id === product.id) ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'}`}
                                        >
                                            <HiShoppingCart className="w-3 md:w-4 h-3 md:h-4" />
                                            <span>{cartItems.some((item) => item.id === product.id) ? 'Remove' : 'Add to Cart'}</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {items.length > 0 && (
                    <div className="text-center mt-8 md:mt-12">
                        <Link
                            to="/products"
                            className="btn-secondary inline-flex items-center space-x-2"
                        >
                            <span>Continue Shopping</span>
                            <HiArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
