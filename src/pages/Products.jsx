import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiStar, HiChevronDown, HiCheck, HiViewGrid, HiViewList } from 'react-icons/hi';
import { fetchProducts, setSearchQuery, setSelectedCategory, setPriceRange, setSortBy, selectFilteredProducts } from '../store/slices/productsSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const Products = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { categories, loading, searchQuery, selectedCategory, sortBy, minPrice, maxPrice } = useSelector((state) => state.products);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const cartItems = useSelector((state) => state.cart.items);
    const filteredProducts = useSelector(selectFilteredProducts);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const categoryDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const priceDropdownRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Read category from URL query parameter and set filter
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            // Map URL parameter to category name (case-insensitive)
            const categoryMap = {
                'almonds': 'Almonds',
                'cashews': 'Cashews',
                'pistachios': 'Pistachios',
                'walnuts': 'Walnuts',
                'raisins': 'Raisins',
                'mixed nuts': 'Mixed Nuts',
                'dried fruits': 'Dried Fruits',
            };
            const categoryName = categoryMap[categoryParam.toLowerCase()] || categoryParam;
            dispatch(setSelectedCategory(categoryName));
        } else {
            dispatch(setSelectedCategory('all'));
        }
    }, [searchParams, dispatch]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setSortDropdownOpen(false);
            }
            if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
                setPriceDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const getSortLabel = (value) => {
        const sortLabels = {
            'featured': 'Featured',
            'price-low': 'Price: Low to High',
            'price-high': 'Price: High to Low',
            'rating': 'Rating'
        };
        return sortLabels[value] || 'Featured';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100/30 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {selectedCategory !== 'all' ? (
                            <>
                                <span className="gradient-text">{selectedCategory}</span>
                                <Link
                                    to="/products"
                                    onClick={() => dispatch(setSelectedCategory('all'))}
                                    className="ml-2 text-lg text-gray-500 hover:text-amber-600 transition-colors"
                                >
                                    (Clear filter)
                                </Link>
                            </>
                        ) : (
                            <>
                                Our <span className="gradient-text">Products</span>
                            </>
                        )}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {selectedCategory !== 'all'
                            ? `Showing ${filteredProducts.length} premium ${selectedCategory.toLowerCase()}`
                            : 'Explore our premium range of quality dry fruits'
                        }
                    </p>
                </motion.div>

                {/* Filters and Search */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-lg overflow-visible relative z-10">
                    <div className="flex flex-col gap-6">
                        {/* Top Row: Search and Dropdowns */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search dry fruits..."
                                    value={searchQuery}
                                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                    className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative" ref={categoryDropdownRef}>
                                <button
                                    onClick={() => {
                                        setCategoryDropdownOpen(!categoryDropdownOpen);
                                        setSortDropdownOpen(false);
                                        setPriceDropdownOpen(false);
                                    }}
                                    className="w-full md:w-48 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:outline-none bg-white flex items-center justify-between"
                                >
                                    <span className={selectedCategory === 'all' ? 'text-gray-500' : 'text-gray-800'}>
                                        {selectedCategory === 'all' ? 'Category' : selectedCategory}
                                    </span>
                                    <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {categoryDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-[100] w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg overflow-hidden"
                                        >
                                            <div
                                                onClick={() => {
                                                    dispatch(setSelectedCategory('all'));
                                                    setCategoryDropdownOpen(false);
                                                }}
                                                className={`px-4 py-3 cursor-pointer hover:bg-amber-50 flex items-center justify-between ${selectedCategory === 'all' ? 'bg-amber-50 text-amber-600 font-semibold' : 'text-gray-700'}`}
                                            >
                                                All Categories
                                                {selectedCategory === 'all' && <HiCheck className="w-4 h-4" />}
                                            </div>
                                            {categories.map((cat) => (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => {
                                                        dispatch(setSelectedCategory(cat.name));
                                                        setCategoryDropdownOpen(false);
                                                    }}
                                                    className={`px-4 py-3 cursor-pointer hover:bg-amber-50 flex items-center justify-between ${selectedCategory === cat.name ? 'bg-amber-50 text-amber-600 font-semibold' : 'text-gray-700'}`}
                                                >
                                                    {cat.name}
                                                    {selectedCategory === cat.name && <HiCheck className="w-4 h-4" />}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Price Filter Dropdown */}
                            <div className="relative" ref={priceDropdownRef}>
                                <button
                                    onClick={() => {
                                        setPriceDropdownOpen(!priceDropdownOpen);
                                        setCategoryDropdownOpen(false);
                                        setSortDropdownOpen(false);
                                    }}
                                    className="w-full md:w-56 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:outline-none bg-white flex items-center justify-between"
                                >
                                    <span className="text-gray-800">
                                        {minPrice === 0 && maxPrice === 1000 ? 'Price' : `₹${minPrice} - ₹${maxPrice}${maxPrice === 1000 ? '+' : ''}`}
                                    </span>
                                    <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${priceDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {priceDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-[100] w-[300px] md:w-[350px] mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-6 right-0 md:left-0"
                                        >
                                            <h4 className="text-sm font-semibold text-gray-800 mb-6 flex justify-between items-center">
                                                <span>Price Range</span>
                                                <span className="text-amber-600">₹{minPrice} - ₹{maxPrice}{maxPrice === 1000 ? '+' : ''}</span>
                                            </h4>

                                            {/* Dual Range Slider */}
                                            <div className="px-2 mb-8 mt-2">
                                                <div className="relative h-2 bg-gray-100 rounded-full">
                                                    {/* Active Track */}
                                                    <div 
                                                        className="absolute h-full bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"
                                                        style={{ 
                                                            left: `${(minPrice / 1000) * 100}%`, 
                                                            right: `${100 - (maxPrice / 1000) * 100}%` 
                                                        }}
                                                    />
                                                    
                                                    {/* Min Thumb */}
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1000"
                                                        step="10"
                                                        value={minPrice}
                                                        onChange={(e) => {
                                                            const val = Math.min(Number(e.target.value), maxPrice - 50);
                                                            dispatch(setPriceRange({ min: val, max: maxPrice }));
                                                        }}
                                                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none accent-amber-600 cursor-pointer"
                                                        style={{ zIndex: minPrice > 500 ? 5 : 4 }}
                                                    />
                                                    
                                                    {/* Max Thumb */}
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1000"
                                                        step="10"
                                                        value={maxPrice}
                                                        onChange={(e) => {
                                                            const val = Math.max(Number(e.target.value), minPrice + 50);
                                                            dispatch(setPriceRange({ min: minPrice, max: val }));
                                                        }}
                                                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none accent-amber-600 cursor-pointer"
                                                        style={{ zIndex: 5 }}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-4 text-xs text-gray-400">
                                                    <span>₹0</span>
                                                    <span>₹1000+</span>
                                                </div>
                                            </div>

                                            {/* Predefined Options */}
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-gray-400 mb-2">QUICK SELECTION</p>
                                                {[
                                                    { label: 'Up to ₹350', min: 0, max: 350 },
                                                    { label: '₹350 – ₹450', min: 350, max: 450 },
                                                    { label: '₹450 – ₹600', min: 450, max: 600 },
                                                    { label: '₹600 – ₹800', min: 600, max: 800 },
                                                    { label: 'Over ₹800', min: 800, max: 1000 },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.label}
                                                        onClick={() => dispatch(setPriceRange({ min: opt.min, max: opt.max }))}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${minPrice === opt.min && maxPrice === opt.max ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => dispatch(setPriceRange({ min: 0, max: 1000 }))}
                                                    className="w-full text-center mt-4 text-xs text-gray-400 hover:text-amber-600 transition-colors py-2 border-t border-gray-50"
                                                >
                                                    Reset Price
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sort */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => {
                                        setSortDropdownOpen(!sortDropdownOpen);
                                        setCategoryDropdownOpen(false);
                                        setPriceDropdownOpen(false);
                                    }}
                                    className="w-full md:w-48 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:outline-none bg-white flex items-center justify-between"
                                >
                                    <span className="text-gray-800">{getSortLabel(sortBy)}</span>
                                    <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {sortDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-[100] w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg overflow-hidden"
                                        >
                                            {[
                                                { value: 'featured', label: 'Featured' },
                                                { value: 'price-low', label: 'Price: Low to High' },
                                                { value: 'price-high', label: 'Price: High to Low' },
                                                { value: 'rating', label: 'Rating' }
                                            ].map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        dispatch(setSortBy(option.value));
                                                        setSortDropdownOpen(false);
                                                    }}
                                                    className={`px-4 py-3 cursor-pointer hover:bg-amber-50 flex items-center justify-between ${sortBy === option.value ? 'bg-amber-50 text-amber-600 font-semibold' : 'text-gray-700'}`}
                                                >
                                                    {option.label}
                                                    {sortBy === option.value && <HiCheck className="w-4 h-4" />}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* View Toggle */}
                            <div className="hidden md:flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <HiViewGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-amber-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <HiViewList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row: Horizontal Category List */}
                        <div className="relative group">
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => dispatch(setSelectedCategory('all'))}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === 'all'
                                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All Products
                                </button>
                                {(categories.length > 0 ? categories.map(c => c.name) : ['Almonds', 'Cashews', 'Pistachios', 'Walnuts', 'Mixed Nuts']).map((catName) => (
                                    <button
                                        key={catName}
                                        onClick={() => dispatch(setSelectedCategory(catName))}
                                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === catName
                                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {catName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-4 shadow-lg animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
                                <div className="h-6 bg-gray-200 rounded mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                                <div className="h-10 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ y: -5 }}
                                    className={`glass-card rounded-3xl p-4 card-hover ${viewMode === 'list' ? 'md:flex md:items-center' : ''}`}
                                >
                                    <div className={`relative mb-4 overflow-hidden rounded-2xl ${viewMode === 'list' ? 'md:w-48 md:h-32 md:mb-0 md:flex-shrink-0' : 'h-56'}`}>
                                        <Link to={`/product/${product.id}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => handleWishlistToggle(product)}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                                        >
                                            <span className={isInWishlist(product.id) ? 'text-orange-500' : 'text-gray-400'}>
                                                ♥
                                            </span>
                                        </button>
                                        {product.isFeatured && (
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-medium rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className={viewMode === 'list' ? 'md:ml-6 md:flex-1' : ''}>
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-amber-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <HiStar
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-500 text-sm ml-2">({product.reviews})</span>
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
                                                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                                                >
                                                    Add to Cart
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <p className="text-6xl mb-4">🥜</p>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
