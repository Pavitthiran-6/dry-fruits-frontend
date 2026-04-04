import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPhotograph, HiPlus, HiChevronDown, HiSearch } from 'react-icons/hi';

const ProductModal = ({ isOpen, onClose, initialData = null, categories = [] }) => {
    const isEditMode = Boolean(initialData);
    const dropdownRef = useRef(null);

    const [activeTab, setActiveTab] = useState('basic');

    const [formData, setFormData] = useState({
        name: '',
        tamilName: '',
        category: '',
        images: [],
        variants: [{ weight: '', mrp: '', salePrice: '', stock: '' }],
        badgeTag: '',
        isNewArrival: false,
        description: '',
        origin: '',
        storage: '',
        shelfLife: '',
        certification: '',
        benefits: [''],
        youtubeUrl: '',
    });

    const [errors, setErrors] = useState({});
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                tamilName: initialData.tamilName || '',
                category: initialData.category || '',
                images: initialData.images || (initialData.image ? [initialData.image] : []),
                variants: initialData.variants && initialData.variants.length > 0
                    ? initialData.variants
                    : [{ weight: '', mrp: '', salePrice: '', stock: '' }],
                badgeTag: initialData.badgeTag || '',
                isNewArrival: initialData.isNewArrival || false,
                description: initialData.description || '',
                origin: initialData.origin || '',
                storage: initialData.storage || '',
                shelfLife: initialData.shelfLife || '',
                certification: initialData.certification || '',
                benefits: initialData.benefits && initialData.benefits.length > 0
                    ? initialData.benefits
                    : [''],
                youtubeUrl: initialData.youtubeUrl || '',
            });
        } else {
            setFormData({
                name: '',
                tamilName: '',
                category: '',
                images: [],
                variants: [{ weight: '', mrp: '', salePrice: '', stock: '' }],
                badgeTag: '',
                isNewArrival: false,
                description: '',
                origin: '',
                storage: '',
                shelfLife: '',
                certification: '',
                benefits: [''],
                youtubeUrl: '',
            });
        }
        setActiveTab('basic');
    }, [initialData, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e, field) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        
        if (field) {
            setFormData(prev => ({
                ...prev,
                [field]: val
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: val
            }));
        }

        if (errors[name || field]) {
            setErrors(prev => ({ ...prev, [name || field]: null }));
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

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result);
                    if (newImages.length === files.length) {
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

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { weight: '', mrp: '', salePrice: '', stock: '' }]
        }));
    };

    const removeVariant = (index) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter((_, i) => i !== index)
            }));
        }
    };

    const handleBenefitChange = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const addBenefit = () => {
        setFormData(prev => ({
            ...prev,
            benefits: [...prev.benefits, '']
        }));
    };

    const removeBenefit = (index) => {
        if (formData.benefits.length > 1) {
            setFormData(prev => ({
                ...prev,
                benefits: prev.benefits.filter((_, i) => i !== index)
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            setActiveTab('basic');
            return;
        }

        const productData = {
            name: formData.name,
            tamilName: formData.tamilName,
            category: formData.category,
            images: formData.images,
            image: formData.images.length > 0 ? formData.images[0] : 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&h=500&fit=crop',
            variants: formData.variants.filter(v => v.weight && v.mrp),
            badgeTag: formData.badgeTag,
            isNewArrival: formData.isNewArrival,
            description: formData.description,
            origin: formData.origin,
            storage: formData.storage,
            shelfLife: formData.shelfLife,
            certification: formData.certification,
            benefits: formData.benefits.filter(b => b.trim()),
            youtubeUrl: formData.youtubeUrl,
            price: formData.variants[0]?.salePrice ? parseFloat(formData.variants[0].salePrice) : 0,
            stock: formData.variants[0]?.stock ? parseInt(formData.variants[0].stock) : 0,
        };

        if (isEditMode) {
            productData.id = initialData.id;
        }

        onClose(productData, isEditMode);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'specs', label: 'Specs' },
        { id: 'benefits', label: 'Benefits' },
        { id: 'youtube', label: 'YouTube' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 sm:p-4">
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={img}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-16 sm:h-20 object-cover rounded-lg"
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
                                <label className="cursor-pointer">
                                    <div className="flex flex-col items-center py-3 sm:py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 transition-colors">
                                        <HiPhotograph className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Click to upload images</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
                                        {formData.images.length > 0 && (
                                            <p className="text-xs text-amber-600 mt-1">{formData.images.length} image(s) uploaded</p>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tamil Name
                            </label>
                            <input
                                type="text"
                                name="tamilName"
                                value={formData.tamilName}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="தமிழ் பெயர்"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="Enter product name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div ref={dropdownRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center justify-between text-sm sm:text-base ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
                                >
                                    <span className={formData.category ? 'text-gray-800' : 'text-gray-400'}>
                                        {formData.category || 'Select category'}
                                    </span>
                                    <HiChevronDown className={`w-4 sm:w-5 h-4 sm:h-5 text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {categoryDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-auto">
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
                                                className={`w-full px-3 sm:px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-sm sm:text-base ${formData.category === cat.name ? 'bg-amber-100' : ''}`}
                                            >
                                                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg overflow-hidden bg-amber-100 flex items-center justify-center border border-amber-200">
                                                    {cat.image ? (
                                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs sm:text-sm">{cat.icon}</span>
                                                    )}
                                                </div>
                                                <span className="text-gray-800 font-medium">{cat.name}</span>
                                            </button>
                                        ))}
                                        {filteredCategories.length === 0 && (
                                            <p className="px-3 sm:px-4 py-2 text-sm text-gray-500">No categories found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Variants
                                </label>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                                >
                                    <HiPlus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Add Variant</span>
                                </button>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row gap-2 items-start">
                                        <div className="flex-1 w-full">
                                            <input
                                                type="text"
                                                value={variant.weight}
                                                onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                                className="w-full px-2 sm:px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                placeholder="Weight"
                                            />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <input
                                                type="number"
                                                value={variant.mrp}
                                                onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)}
                                                className="w-full px-2 sm:px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                placeholder="MRP"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <input
                                                type="number"
                                                value={variant.salePrice}
                                                onChange={(e) => handleVariantChange(index, 'salePrice', e.target.value)}
                                                className="w-full px-2 sm:px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                placeholder="Sale"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                className="w-full px-2 sm:px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                placeholder="Stock"
                                                min="0"
                                            />
                                        </div>
                                        {formData.variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="p-2 text-red-500 hover:text-red-600 self-center sm:self-auto"
                                            >
                                                <HiX className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Badge Tag
                            </label>
                            <input
                                type="text"
                                name="badgeTag"
                                value={formData.badgeTag}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="e.g., Premium, Organic"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isNewArrival"
                                id="isNewArrival"
                                checked={formData.isNewArrival}
                                onChange={handleChange}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <label htmlFor="isNewArrival" className="ml-2 text-sm text-gray-700">
                                Mark as New Arrival
                            </label>
                        </div>
                    </div>
                );

            case 'specs':
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="Enter product description"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Origin
                            </label>
                            <input
                                type="text"
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="e.g., California, USA"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Storage
                            </label>
                            <input
                                type="text"
                                name="storage"
                                value={formData.storage}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="e.g., Cool dry place"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shelf Life
                            </label>
                            <input
                                type="text"
                                name="shelfLife"
                                value={formData.shelfLife}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="e.g., 12 months"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Certification
                            </label>
                            <input
                                type="text"
                                name="certification"
                                value={formData.certification}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="e.g., FSSAI, Organic"
                            />
                        </div>
                    </div>
                );

            case 'benefits':
                return (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Product Benefits
                            </label>
                            <button
                                type="button"
                                onClick={addBenefit}
                                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                            >
                                <HiPlus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add Benefit</span>
                            </button>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                        placeholder={`Benefit ${index + 1}`}
                                    />
                                    {formData.benefits.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBenefit(index)}
                                            className="p-2 text-red-500 hover:text-red-600"
                                        >
                                            <HiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'youtube':
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                YouTube Video URL
                            </label>
                            <input
                                type="url"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Paste a YouTube video link to display a preview
                            </p>
                        </div>
                        {formData.youtubeUrl && (
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                                <p className="text-sm text-gray-600">Video preview will appear here</p>
                                <p className="text-xs text-gray-400 mt-1 truncate">{formData.youtubeUrl}</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
                onClick={(e) => e.target === e.currentTarget && onClose(null)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-4xl sm:max-w-3xl bg-white rounded-2xl shadow-xl max-h-[90vh] my-auto overflow-hidden flex flex-col"
                >
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                {isEditMode ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500">
                                {isEditMode ? 'Update product information' : 'Fill in the product details'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onClose(null)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <HiX className="w-5 sm:w-6 h-5 sm:h-6" />
                        </button>
                    </div>

                    <div className="px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
                        <div className="flex gap-1 sm:gap-2 min-w-max">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'text-amber-600 bg-amber-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
                        {renderTabContent()}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50">
                        <button
                            type="button"
                            onClick={() => onClose(null)}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-sm sm:text-base"
                        >
                            {isEditMode ? 'Update Product' : 'Save Product'}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductModal;