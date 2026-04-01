import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiStar, HiMinus, HiPlus, HiShoppingCart, HiHeart, HiArrowLeft, HiViewGrid } from 'react-icons/hi';
import { fetchProducts } from '../store/slices/productsSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const cartItems = useSelector((state) => state.cart.items);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    const product = products.find((p) => p.id === parseInt(id));

    // Create images array for gallery - using the main image and variations
    const productImages = product ? [
        product.image,
        product.image,
        product.image,
        product.image,
    ] : [];

    const isInWishlist = product ? wishlistItems.some((item) => item.id === product.id) : false;

    const isInCart = product ? cartItems.some((item) => item.id === product.id) : false;

    const handleAddToCart = () => {
        if (product) {
            if (isInCart) {
                dispatch(removeFromCart(product.id));
            } else {
                for (let i = 0; i < quantity; i++) {
                    dispatch(addToCart(product));
                }
            }
        }
    };

    const handleWishlistToggle = () => {
        if (product) {
            if (isInWishlist) {
                dispatch(removeFromWishlist(product.id));
            } else {
                dispatch(addToWishlist(product));
            }
        }
    };

    if (loading || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery - All Screen Sizes */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Main Image */}
                        <div className="relative h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden mb-4 shadow-2xl group">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover cursor-zoom-in"
                            />
                            {/* Hover Zoom Overlay - Desktop Only */}
                            <div className="hidden lg:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                    Hover to zoom
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleWishlistToggle}
                                    className={`p-3 rounded-full shadow-lg ${isInWishlist ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'
                                        }`}
                                >
                                    <HiHeart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Thumbnail Images - Horizontal Row */}
                        <div className="flex gap-2 md:gap-3 justify-center">
                            {productImages.map((img, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedImage === index
                                        ? 'ring-4 ring-purple-500 ring-offset-2 shadow-lg shadow-purple-200'
                                        : 'opacity-60 hover:opacity-100 border-2 border-transparent hover:border-purple-300'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-500 ml-2">
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        <p className="text-4xl font-bold gradient-text mb-6">₹{product.price}</p>

                        <p className="text-gray-600 mb-8">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4 mb-8">
                            <span className="text-gray-700 font-medium">Quantity:</span>
                            <div className="flex items-center bg-white rounded-full shadow-md">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-gray-100 rounded-l-full transition-colors"
                                >
                                    <HiMinus className="w-5 h-5" />
                                </button>
                                <span className="px-6 py-2 font-semibold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-gray-100 rounded-r-full transition-colors"
                                >
                                    <HiPlus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            className={`w-full py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2 mb-4 ${isInCart ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white'}`}
                        >
                            <HiShoppingCart className="w-6 h-6" />
                            <span>{isInCart ? 'Remove' : 'Add to Cart'}</span>
                        </motion.button>

                        {/* Product Info */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mt-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Product Information</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Calories</span>
                                    <span className="font-medium">{product.calories} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Allergens</span>
                                    <span className="font-medium">{product.allergens?.join(', ') || 'None'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mt-16">
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'description'
                                ? 'border-b-2 border-purple-500 text-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'reviews'
                                ? 'border-b-2 border-purple-500 text-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Reviews
                        </button>
                    </div>

                    {activeTab === 'description' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8"
                        >
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">About this product</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                Our dry fruits are sourced from the finest farms and suppliers.
                                We ensure premium quality with careful selection and processing to
                                preserve their natural goodness and freshness.
                            </p>
                        </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8"
                        >
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Customer Reviews</h3>
                            <div className="flex items-center mb-6">
                                <div className="text-5xl font-bold gradient-text mr-4">{product.rating}</div>
                                <div>
                                    <div className="flex text-yellow-400 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-500">{product.reviews} reviews</p>
                                </div>
                            </div>
                            <p className="text-gray-600">Be the first to review this product!</p>
                        </motion.div>
                    )}
                </div>

                {/* Product Suggestions */}
                <section className="mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            You May <span className="gradient-text">Also Like</span>
                        </h2>
                        <p className="text-gray-600">Discover more delicious flavors</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products
                            .filter((p) => p.id !== parseInt(id))
                            .slice(0, 4)
                            .map((suggestedProduct) => (
                                <Link key={suggestedProduct.id} to={`/product/${suggestedProduct.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                        className="glass-card rounded-2xl p-3 card-hover cursor-pointer"
                                    >
                                        <div className="relative h-32 md:h-40 mb-3 overflow-hidden rounded-xl">
                                            <img
                                                src={suggestedProduct.image}
                                                alt={suggestedProduct.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 truncate">
                                            {suggestedProduct.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm md:text-lg font-bold gradient-text">
                                                ₹{suggestedProduct.price}
                                            </span>
                                            <div className="flex items-center text-yellow-400">
                                                <HiStar className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                                <span className="text-xs md:text-sm text-gray-500 ml-1">{suggestedProduct.rating}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/products"
                            className="btn-secondary inline-flex items-center space-x-2"
                        >
                            <span>View All Dry Fruits</span>
                            <HiArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetails;
