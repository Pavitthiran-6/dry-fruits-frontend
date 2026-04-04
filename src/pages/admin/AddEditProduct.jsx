import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiPhotograph, HiX, HiChevronDown, HiSearch } from 'react-icons/hi';
import { addProduct, updateProduct } from '../../store/slices/productsSlice';

const AddEditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { products, categories } = useSelector((state) => state.products);
    const dropdownRef = useRef(null);

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        images: [],
        description: '',
        status: 'In Stock',
        isFeatured: false,
    });

    const [errors, setErrors] = useState({});
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');

    // Load product data if in edit mode
    useEffect(() => {
        if (isEditMode && products.length > 0) {
            const product = products.find(p => p.id === parseInt(id));
            if (product) {
                setFormData({
                    name: product.name || '',
                    category: product.category || '',
                    price: product.price?.toString() || '',
                    stock: product.stock?.toString() || '',
                    images: product.images || (product.image ? [product.image] : []),
                    description: product.description || '',
                    status: product.stock > 0 ? 'In Stock' : 'Out of Stock',
                    isFeatured: product.isFeatured || false,
                });
            }
        }
    }, [isEditMode, id, products]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleCategorySelect = (categoryName) => {
        setFormData(prev => ({ ...prev, category: categoryName }));
        setCategoryDropdownOpen(false);
        setCategorySearch('');
        if (errors.category) {
            setErrors(prev => ({ ...prev, category: null }));
        }
    };

    // Filter categories based on search
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const MAX_IMAGES = 10;
        const currentCount = formData.images.length;
        const remainingSlots = MAX_IMAGES - currentCount;

        if (remainingSlots <= 0) {
            alert(`You can only upload up to ${MAX_IMAGES} images.`);
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);

        if (filesToProcess.length > 0) {
            const newImages = [];
            filesToProcess.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result);
                    if (newImages.length === filesToProcess.length) {
                        setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, ...newImages]
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
            newErrors.stock = 'Valid stock quantity is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const productData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image: formData.images.length > 0 ? formData.images[0] : 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&h=500&fit=crop',
            images: formData.images,
            description: formData.description,
            status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
            isFeatured: formData.isFeatured,
        };

        if (isEditMode) {
            dispatch(updateProduct({ id: parseInt(id), ...productData }));
        } else {
            dispatch(addProduct(productData));
        }

        navigate('/admin/inventory');
    };

    const handleCancel = () => {
        navigate('/admin/inventory');
    };

    const selectedCategory = categories.find(c => c.name === formData.category);

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={handleCancel}
                    className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mb-4"
                >
                    <HiArrowLeft className="w-5 h-5 mr-1" />
                    Back to Inventory
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-gray-600">
                    {isEditMode ? 'Update product information (max 10 images)' : 'Add a new product to your inventory (max 10 images)'}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.name ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    placeholder="Enter product name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Category - Custom Dropdown */}
                            <div ref={dropdownRef}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center justify-between ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
                                    >
                                        <span className={formData.category ? 'text-gray-800' : 'text-gray-400'}>
                                            {selectedCategory ? (
                                                <span className="flex items-center gap-2">
                                                    <span>{selectedCategory.icon}</span>
                                                    {formData.category}
                                                </span>
                                            ) : 'Select category'}
                                        </span>
                                        <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {categoryDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                            <div className="p-2 border-b border-gray-100">
                                                <div className="relative">
                                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search categories..."
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            {filteredCategories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => handleCategorySelect(cat.name)}
                                                    className={`w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-2 ${formData.category === cat.name ? 'bg-amber-100' : ''}`}
                                                >
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-amber-100 flex items-center justify-center border border-amber-200">
                                                        {cat.image ? (
                                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{cat.icon}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-800 font-medium">{cat.name}</span>
                                                </button>
                                            ))}
                                            {filteredCategories.length === 0 && (
                                                <p className="px-4 py-2 text-sm text-gray-500">No categories found</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.price ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.stock ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>

                            {/* Featured */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                                    Mark as Featured Product
                                </label>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Product Images - Multiple Upload */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Images (max 10)
                                    </label>
                                    <span className="text-sm text-gray-500">
                                        {formData.images.length}/10
                                    </span>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                                    {/* Image Previews */}
                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <HiX className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    {formData.images.length >= 10 ? (
                                        <div className="flex flex-col items-center py-4 text-gray-400">
                                            <HiPhotograph className="w-10 h-10 mb-2" />
                                            <p className="text-sm">Maximum 10 images reached</p>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <div className="flex flex-col items-center py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 transition-colors">
                                                <HiPhotograph className="w-10 h-10 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Click to upload images</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each (max 10)</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.description ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    placeholder="Enter product description"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
                        >
                            {isEditMode ? 'Update Product' : 'Save Product'}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditProduct;
