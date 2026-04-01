import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiStar } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCards } from 'swiper/modules';
import { fetchProducts } from '../store/slices/productsSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { testimonials } from '../data/products';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { featuredProducts, categories, loading } = useSelector((state) => state.products);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Restore scroll position when returning to Home page
    useEffect(() => {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem('scrollPosition');
        }
    }, []);

    // Save scroll position and navigate
    const navigateToProduct = (id) => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        navigate(`/product/${id}`);
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item.id === productId);
    };

    const isInCart = (productId) => {
        return cartItems.some((item) => item.id === productId);
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleWishlistToggle = (product) => {
        if (isInWishlist(product.id)) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    // Animation variants - GPU optimized
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    const fadeInScale = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="home-page min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50 overflow-x-hidden flex flex-col w-full">
            {/* Hero + Product Section - Merged for Desktop */}
            <section className="relative pt-12 pb-4 md:pt-28 lg:pt-0 lg:min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background decorations with subtle floating animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-20 left-10 text-6xl md:text-8xl opacity-20"
                    >
                        🥜
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute top-40 right-20 text-5xl md:text-6xl opacity-20"
                    >
                        🌰
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-40 left-1/4 text-6xl md:text-7xl opacity-20"
                    >
                        🍇
                    </motion.div>
                    {/* Additional decorative elements */}
                    <motion.div
                        animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                        className="absolute top-32 right-1/4 text-3xl opacity-15"
                    >
                        ⭐
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-32 left-20 text-2xl opacity-15"
                    >
                        ✨
                    </motion.div>
                </div>

                {/* Combined Hero + Product Container */}
                <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-0">
                    {/* Desktop: Centered single column | Mobile: Stacked layout */}
                    <div className="flex flex-col lg:flex-col items-center justify-center lg:text-center w-full max-w-[800px] mx-auto">
                        {/* Left Side - Hero Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                            className="w-full text-center"
                        >
                            <h1 className="hero-title text-4xl font-bold md:font-extrabold md:text-5xl lg:text-7xl leading-tight mb-4 mt-4">
                                <span className="gradient-text font-bold md:font-extrabold">Experience</span>{" "}
                                <span className="hero-line text-gray-900 font-bold md:font-extrabold">Pure Natural Goodness</span>
                            </h1>
                            <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-6 max-w-full mx-auto">
                                Premium quality dry fruits sourced from the finest farms.
                                Every bite is a journey to health and flavor paradise!
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex justify-center w-full"
                            >
                                <Link
                                    to="/products"
                                    className="btn-primary inline-flex items-center justify-center space-x-2 text-base md:text-lg"
                                >
                                    <span>Shop Now</span>
                                    <HiArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Single Hero Image - Hidden on all views */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hidden"
                        >
                            {featuredProducts && featuredProducts.length > 0 && (
                                <img
                                    src={featuredProducts[0].image}
                                    alt="Premium Dry Fruits Collection"
                                    className="w-full max-w-[420px] h-auto object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                                />
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-8 px-5 md:py-16 relative overflow-hidden flex flex-col items-center text-center">
                {/* Animated dry fruits background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
                    {/* Floating dry fruits emojis */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                            rotate: [0, 10, 0, -10, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-16 left-[10%] text-5xl opacity-20"
                    >
                        🥜
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, 25, 0],
                            x: [0, -15, 0],
                            rotate: [0, -8, 0, 8, 0]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute top-32 right-[15%] text-4xl opacity-15"
                    >
                        🍇
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, -18, 0],
                            x: [0, 12, 0],
                            rotate: [0, 12, 0, -12, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-40 left-[20%] text-5xl opacity-20"
                    >
                        🥜
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, 22, 0],
                            x: [0, -8, 0],
                            rotate: [0, -6, 0, 6, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute bottom-24 right-[25%] text-4xl opacity-15"
                    >
                        🌰
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            x: [0, 20, 0]
                        }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                        className="absolute top-40 left-1/4 text-3xl opacity-10"
                    >
                        ⭐
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, 18, 0],
                            x: [0, -12, 0]
                        }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute top-60 right-1/3 text-3xl opacity-10"
                    >
                        ✨
                    </motion.div>

                    {/* Soft pastel gradient blobs */}
                    <motion.div
                        animate={{
                            x: [0, 40, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.15, 1]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-10 left-0 w-80 h-80 bg-gradient-to-r from-pink-200/40 to-purple-200/40 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -35, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-r from-orange-200/35 to-pink-200/35 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, 25, 0],
                            y: [0, -35, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                        className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-orange-200/30 rounded-full blur-3xl"
                    />
                </div >

                <div className="max-w-full mx-auto relative z-10 px-4 md:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            Premium Dry Fruits <span className="gradient-text">from Our Store</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Our most loved and best-selling dry fruits sourced from premium farms.
                        </p>
                    </motion.div>

                    <div className="relative py-8">
                        <Swiper
                            modules={[Autoplay, EffectCards]}
                            effect={'cards'}
                            grabCursor={true}
                            spaceBetween={16}
                            slidesPerView={1}
                            initialSlide={1}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            loop={true}
                            loopedSlides={5}
                            centeredSlides={true}
                            className="pb-12 h-[520px] clean-cards-swiper"
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    initialSlide: 1,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                    initialSlide: 2,
                                },
                            }}
                            onAfterInit={(swiper) => {
                                // Remove shadow elements after initialization
                                setTimeout(() => {
                                    const shadows = document.querySelectorAll('.swiper-slide-shadow-left, .swiper-slide-shadow-right');
                                    shadows.forEach(shadow => shadow.remove());
                                }, 100);
                            }}
                        >
                            {featuredProducts.slice(0, 5).map((product) => (
                                <SwiperSlide key={product.id} className="h-full">
                                    <div
                                        onClick={() => navigateToProduct(product.id)}
                                        className="h-full flex items-center justify-center cursor-pointer"
                                    >
                                        <motion.div
                                            whileHover={{ y: -10 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            className="glass-card rounded-3xl p-5 sm:p-7 w-full max-w-[85vw] sm:max-w-[400px] card-hover cursor-pointer"
                                        >
                                            {/* Image only for background cards */}
                                            <div className="card-image-container relative h-60 mb-5 overflow-hidden rounded-2xl">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Content only visible on active card */}
                                            <div className="card-content">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center text-yellow-400">
                                                        <HiStar className="w-4 h-4 fill-current" />
                                                        <span className="text-gray-600 text-sm ml-1 font-medium">{product.rating}</span>
                                                        <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                                                    </div>
                                                    <span className="text-2xl font-bold gradient-text">
                                                        ₹{product.price}
                                                    </span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isInCart(product.id)) {
                                                            handleRemoveFromCart(product.id);
                                                        } else {
                                                            handleAddToCart(product);
                                                        }
                                                    }}
                                                    className={`w-full py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow ${isInCart(product.id) ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white'}`}
                                                >
                                                    {isInCart(product.id) ? 'Remove' : 'Add to Cart'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Popular Products Section */}
            <section className="py-8 px-5 md:py-16 flex flex-col items-center text-center">
                <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            Popular <span className="gradient-text">Dry Fruits</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Discover our most loved varieties, sourced from premium farms
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl p-4 shadow-lg animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
                                    <div className="h-6 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-8 w-full"
                        >
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigateToProduct(product.id)}
                                    className="cursor-pointer"
                                >
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ y: -10 }}
                                        className="glass-card rounded-3xl p-4 card-hover cursor-pointer"
                                    >
                                        <div className="relative h-56 mb-4 overflow-hidden rounded-2xl">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleWishlistToggle(product);
                                                }}
                                                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-10"
                                            >
                                                <motion.span
                                                    animate={isInWishlist(product.id) ? { scale: [1, 1.3, 1] } : {}}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <span className={isInWishlist(product.id) ? 'text-pink-500' : 'text-gray-400'}>
                                                        ♥
                                                    </span>
                                                </motion.span>
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <HiStar
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-500 text-sm ml-2">({product.reviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold gradient-text">
                                                ₹{product.price}
                                            </span>
                                            {isInCart(product.id) ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFromCart(product.id);
                                                    }}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                                                >
                                                    Remove
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(product);
                                                    }}
                                                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                                                >
                                                    Add to Cart
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/products" className="btn-secondary inline-flex items-center space-x-2">
                            <span>View All Dry Fruits</span>
                            <HiArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-8 px-5 md:py-16 bg-white/50 flex flex-col items-center text-center">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            Browse by <span className="gradient-text">Category</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Find your perfect dry fruits from our curated categories
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full p-4 md:p-0"
                    >
                        {categories.map((category, index) => {
                            // Map category name to URL parameter
                            const categoryMap = {
                                'Almonds': 'almonds',
                                'Cashews': 'cashews',
                                'Pistachios': 'pistachios',
                                'Walnuts': 'walnuts',
                                'Mixed Nuts': 'mixed'
                            };
                            const categoryParam = categoryMap[category.name] || category.name.toLowerCase();

                            return (
                                <Link key={category.id} to={`/products?category=${categoryParam}`} className="w-full h-full block">
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className={`relative p-4 md:p-6 rounded-3xl bg-gradient-to-br ${category.gradient} shadow-lg cursor-pointer card-hover w-full min-h-[120px] flex flex-col justify-center items-center h-full`}
                                    >
                                        <div className="text-4xl md:text-5xl mb-2 md:mb-3 text-center">{category.icon}</div>
                                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center leading-snug">
                                            {category.name}
                                        </h3>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-8 px-5 md:py-16 flex flex-col items-center text-center pb-16">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            What Our <span className="gradient-text">Customers Say</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Don't just take our word for it
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                variants={itemVariants}
                                className="glass-card rounded-3xl p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

        </div >
    );
};

export default Home;
