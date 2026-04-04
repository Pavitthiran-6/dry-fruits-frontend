import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiStar, HiMinus, HiPlus, HiShoppingCart, HiHeart, HiArrowLeft, HiViewGrid } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { fetchProducts } from '../store/slices/productsSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

import 'swiper/css';
import 'swiper/css/pagination';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);
    const cartItems = useSelector((state) => state.cart.items);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    const product = products.find((p) => p.id === parseInt(id));

    // Create images array for gallery - use product.images or fallback to product.image
    const productImages = product ? (product.images && product.images.length > 0 ? product.images : 
        [product.image, product.image, product.image, product.image]
    ) : [];

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
            <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 mb-8 transition-colors"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery - Swiper */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col gap-3">
                            {/* Main Swiper */}
                            <div className="relative rounded-2xl overflow-hidden shadow-xl w-full h-[300px] md:h-[400px] bg-gray-100">
                                <Swiper
                                    ref={swiperRef}
                                    modules={[Autoplay, Pagination]}
                                    autoplay={{
                                        delay: 2500,
                                        disableOnInteraction: false
                                    }}
                                    loop={true}
                                    pagination={{
                                        clickable: true
                                    }}
                                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                    className="w-full h-full product-swiper"
                                >
                                    {productImages.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img
                                                    src={img}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                {/* Wishlist Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleWishlistToggle}
                                    className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg ${isInWishlist ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'
                                        }`}
                                >
                                    <HiHeart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                                </motion.button>
                            </div>

                            {/* Thumbnails Row */}
                            <div className="flex justify-center gap-2 overflow-x-auto py-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (swiperRef.current?.swiper) {
                                                swiperRef.current.swiper.slideToLoop(index);
                                                setActiveIndex(index);
                                            }
                                        }}
                                        className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 cursor-pointer bg-gray-100 transition-all ${
                                            activeIndex === index
                                                ? 'border-orange-500 ring-2 ring-orange-300'
                                                : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-sm font-medium rounded-full">
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
                            className={`w-full py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2 mb-4 ${isInCart ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white'}`}
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
                                ? 'border-b-2 border-amber-500 text-amber-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'reviews'
                                ? 'border-b-2 border-amber-500 text-amber-600'
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
