import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiStar } from 'react-icons/hi';
import { fetchProducts } from '../store/slices/productsSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { testimonials } from '../data/products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const CATEGORY_MAP = {
    'Almonds': 'almonds',
    'Cashews': 'cashews',
    'Pistachios': 'pistachios',
    'Walnuts': 'walnuts',
    'Mixed Nuts': 'mixed',
};

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { featuredProducts, categories: reduxCategories, loading } = useSelector((state) => state.products);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const cartItems = useSelector((state) => state.cart.items);

    const categories = reduxCategories;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem('scrollPosition');
        }
    }, []);

    const navigateToProduct = (id) => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        navigate(`/product/${id}`);
    };

    const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId);
    const isInCart = (productId) => cartItems.some((item) => item.id === productId);

    const handleAddToCart = (product) => dispatch(addToCart(product));
    const handleRemoveFromCart = (productId) => dispatch(removeFromCart(productId));

    const handleWishlistToggle = (product) => {
        if (isInWishlist(product.id)) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="home-page min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 overflow-x-hidden flex flex-col w-full">

            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 lg:pt-36 pb-6 lg:min-h-screen flex flex-col items-center justify-center overflow-hidden">                <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 left-10 text-6xl md:text-8xl opacity-20">🥜</motion.div>
                <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-40 right-20 text-5xl md:text-6xl opacity-20">🌰</motion.div>
                <motion.div animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-40 left-1/4 text-6xl md:text-7xl opacity-20">🍇</motion.div>
                <motion.div animate={{ y: [0, -8, 0], x: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} className="absolute top-32 right-1/4 text-3xl opacity-15">⭐</motion.div>
                <motion.div animate={{ y: [0, 10, 0], x: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-32 left-20 text-2xl opacity-15">✨</motion.div>
            </div>

                <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-0">
                    <div className="flex flex-col items-center justify-center lg:text-center w-full max-w-[800px] mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp} className="w-full text-center">
                            <h1 className="hero-title text-4xl font-bold md:font-extrabold md:text-5xl lg:text-7xl leading-tight mb-4 mt-4">
                                <span className="gradient-text font-bold md:font-extrabold">Experience</span>{' '}
                                <span className="hero-line text-gray-900 font-bold md:font-extrabold">Pure Natural Goodness</span>
                            </h1>
                            <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-6 max-w-full mx-auto">
                                Premium quality dry fruits sourced from the finest farms.
                                Every bite is a journey to health and flavor paradise!
                            </p>
                            {/* MAIN BANNER */}
                            {/* SLIDER */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="w-full mt-6"
                            >
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    loop={true}
                                    autoplay={{ delay: 2500 }}
                                    pagination={{ clickable: true }}
                                    className="rounded-3xl overflow-hidden"
                                >
                                    {/* SLIDE 1 */}
                                    <SwiperSlide>
                                        <div className="h-[220px] md:h-[300px] lg:h-[360px]">
                                            <img
                                                src="https://images.unsplash.com/photo-1606914501449-5f5d8aef0f2f"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>

                                    {/* SLIDE 2 */}
                                    <SwiperSlide>
                                        <div className="h-[220px] md:h-[300px] lg:h-[360px]">
                                            <img
                                                src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>

                                    {/* SLIDE 3 */}
                                    <SwiperSlide>
                                        <div className="h-[220px] md:h-[300px] lg:h-[360px]">
                                            <img
                                                src="https://images.unsplash.com/photo-1615485737452-4d94f3e7e6c4"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </motion.div>

                            {/* SHOP NOW BUTTON (OUTSIDE BANNER) */}
                            <div className="flex justify-center mt-6">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/products"
                                        className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Shop Now
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Popular Products Section */}
            <section className="py-8 px-5 md:py-16 flex flex-col items-center text-center">
                <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full">
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            Popular <span className="gradient-text">Dry Fruits</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Discover our most loved varieties, sourced from premium farms
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl p-4 shadow-lg animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
                                    <div className="h-6 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-8 w-full">
                            {featuredProducts && featuredProducts.map((product) => (
                                <div key={product.id} onClick={() => navigateToProduct(product.id)} className="cursor-pointer">
                                    <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="glass-card rounded-3xl p-4 card-hover cursor-pointer">
                                        <div className="relative h-56 mb-4 overflow-hidden rounded-2xl">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWishlistToggle(product); }}
                                                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-10"
                                            >
                                                <motion.span animate={isInWishlist(product.id) ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                                                    <span className={isInWishlist(product.id) ? 'text-orange-500' : 'text-gray-400'}>♥</span>
                                                </motion.span>
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <HiStar key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <span className="text-gray-500 text-sm ml-2">({product.reviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold gradient-text">₹{product.price}</span>
                                            {isInCart(product.id) ? (
                                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(product.id); }} className="px-4 py-2 bg-red-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-shadow">
                                                    Remove
                                                </motion.button>
                                            ) : (
                                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-shadow">
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
            <section className="py-8 px-5 md:py-16 bg-amber-50/50 flex flex-col items-center text-center">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full">
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            Browse by <span className="gradient-text">Category</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Find your perfect dry fruits from our curated categories
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full p-4 md:p-0">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="rounded-3xl bg-amber-100/50 animate-pulse min-h-[160px]" />
                            ))}
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full p-4 md:p-0">
                            {categories.map((category) => {
                                const categoryParam = CATEGORY_MAP[category.name] || category.name.toLowerCase();
                                return (
                                    <Link key={category.id} to={`/products?category=${categoryParam}`} className="group">
                                        <motion.div 
                                            variants={itemVariants} 
                                            whileHover={{ y: -10 }} 
                                            className="relative p-2 rounded-[2rem] bg-white shadow-xl hover:shadow-2xl transition-all border border-amber-100 flex flex-col h-full overflow-hidden"
                                        >
                                            <div className="relative h-32 md:h-40 rounded-[1.5rem] overflow-hidden mb-3">
                                                {category.image ? (
                                                    <img 
                                                        src={category.image} 
                                                        alt={category.name} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${category.gradient || 'from-amber-100 to-orange-100'} flex items-center justify-center`}>
                                                        <span className="text-4xl">{category.icon}</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <h3 className="pb-3 text-sm md:text-lg font-bold text-gray-800 text-center">{category.name}</h3>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-8 px-5 md:py-16 flex flex-col items-center text-center pb-16">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-12 flex flex-col items-center px-2 w-full">
                        <h2 className="text-4xl md:text-5xl font-bold md:font-extrabold text-gray-800 mb-3 leading-tight w-full">
                            What Our <span className="gradient-text">Customers Say</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
                            Don't just take our word for it
                        </p>
                    </motion.div>

                    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((testimonial) => (
                            <motion.div key={testimonial.id} variants={itemVariants} className="glass-card rounded-3xl p-6">
                                <div className="flex items-center mb-4">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="ml-3">
                                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Home;