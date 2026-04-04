import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiSearch,
    HiTrash,
    HiRefresh,
    HiCalendar,
    HiUserGroup,
    HiX,
    HiCheck,
    HiTag
} from 'react-icons/hi';

const AdminCoupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [coupon, setCoupon] = useState({
        code: "",
        description: "",
        type: "percentage",
        value: "",
        startDate: "",
        endDate: "",
        totalLimit: 0,
        perUserLimit: 1,
        active: true,
        firstOrderOnly: false,
        excludeDiscounted: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const stored = localStorage.getItem('dry_fruits_coupons');
        if (stored) {
            setCoupons(JSON.parse(stored));
        }
    }, []);

    const saveToStorage = (updatedCoupons) => {
        localStorage.setItem('dry_fruits_coupons', JSON.stringify(updatedCoupons));
    };

    const generateRandomCode = () => {
        const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        setCoupon(prev => ({ ...prev, code: newCode }));
        if (errors.code) setErrors(prev => ({ ...prev, code: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!coupon.code) newErrors.code = "Coupon code is required";
        if (!coupon.value || parseFloat(coupon.value) <= 0) newErrors.value = "Valid discount value is required";
        if (coupon.type === "percentage" && parseFloat(coupon.value) > 100) newErrors.value = "Percentage cannot exceed 100%";
        if (!coupon.startDate) newErrors.startDate = "Start date is required";
        if (!coupon.endDate) newErrors.endDate = "End date is required";
        if (coupon.startDate && coupon.endDate && new Date(coupon.startDate) > new Date(coupon.endDate)) {
            newErrors.endDate = "End date must be after start date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsProcessing(true);

        setTimeout(() => {
            const newCoupon = {
                ...coupon,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                usedCount: 0
            };

            const updatedCoupons = [newCoupon, ...coupons];
            setCoupons(updatedCoupons);
            saveToStorage(updatedCoupons);

            setIsProcessing(false);
            setIsModalOpen(false);
            resetForm();
        }, 800);
    };

    const resetForm = () => {
        setCoupon({
            code: "",
            description: "",
            type: "percentage",
            value: "",
            startDate: "",
            endDate: "",
            totalLimit: 0,
            perUserLimit: 1,
            active: true,
            firstOrderOnly: false,
            excludeDiscounted: false
        });
        setErrors({});
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            const updated = coupons.filter(c => c.id !== id);
            setCoupons(updated);
            saveToStorage(updated);
        }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full px-4 sm:px-6">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Coupons</h1>
                    <p className="text-sm text-gray-600">Manage your discount coupons</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm"
                >
                    <HiPlus className="w-5 h-5" />
                    <span>Create Coupon</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
                {filteredCoupons.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                        <HiTag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No coupons found</p>
                        <p className="text-xs text-gray-400 mt-1">Create your first discount code!</p>
                    </div>
                ) : (
                    filteredCoupons.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900 text-sm">{c.code}</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 truncate">{c.description || 'No description'}</div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                    <span>{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</span>
                                    <span>{c.usedCount}/{c.totalLimit || '∞'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {c.active ? (
                                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                        Active
                                    </span>
                                ) : (
                                    <span className="text-gray-400 text-xs font-medium">Inactive</span>
                                )}
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Coupon Code</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Validity</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usage</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCoupons.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                                <HiTag className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{c.code}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{c.description || 'No description'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-600">
                                            {new Date(c.startDate).toLocaleDateString()} - <br />
                                            {new Date(c.endDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-gray-900 font-medium">{c.usedCount} / {c.totalLimit || '∞'}</div>
                                        <div className="text-xs text-gray-500">Per user: {c.perUserLimit}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {c.active ? (
                                            <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs font-bold">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredCoupons.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No coupons found. Create your first discount code!
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] my-auto"
                        >
                            <div className="shrink-0 p-4 sm:p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Generate New <span className="text-amber-600">Coupon</span></h2>
                                    <p className="text-gray-500 mt-1 text-sm">Configure discount rules and validity</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all text-gray-500"
                                >
                                    <HiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                <form className="space-y-4 sm:space-y-6">
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">Basic Information</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={coupon.code}
                                                        onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })}
                                                        placeholder="e.g. SUMMER20"
                                                        className={`w-full h-10 sm:h-11 pl-4 pr-12 bg-gray-50 border ${errors.code ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-medium`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={generateRandomCode}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-amber-600 rounded-lg border border-gray-200 hover:bg-amber-50 transition-all"
                                                        title="Generate code"
                                                    >
                                                        <HiRefresh className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                                <input
                                                    type="text"
                                                    value={coupon.description}
                                                    onChange={(e) => setCoupon({ ...coupon, description: e.target.value })}
                                                    placeholder="Summer sale..."
                                                    className="w-full h-10 sm:h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">Discount Details</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type *</label>
                                                <select
                                                    value={coupon.type}
                                                    onChange={(e) => setCoupon({ ...coupon, type: e.target.value })}
                                                    className="w-full h-10 sm:h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm cursor-pointer appearance-none"
                                                >
                                                    <option value="percentage">Percentage (%)</option>
                                                    <option value="flat">Flat Amount (₹)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Value *</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                                        {coupon.type === 'percentage' ? '%' : '₹'}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={coupon.value}
                                                        onChange={(e) => setCoupon({ ...coupon, value: e.target.value })}
                                                        placeholder="0"
                                                        className={`w-full h-10 sm:h-11 pl-8 sm:pl-10 pr-4 bg-gray-50 border ${errors.value ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-medium`}
                                                    />
                                                </div>
                                                {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">Validity Period</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                    <HiCalendar className="text-amber-500 w-4 h-4" /> Start Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={coupon.startDate}
                                                    onChange={(e) => setCoupon({ ...coupon, startDate: e.target.value })}
                                                    className={`w-full h-10 sm:h-11 px-4 bg-gray-50 border ${errors.startDate ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm cursor-pointer`}
                                                />
                                                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                    <HiCalendar className="text-amber-600 w-4 h-4" /> End Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={coupon.endDate}
                                                    onChange={(e) => setCoupon({ ...coupon, endDate: e.target.value })}
                                                    className={`w-full h-10 sm:h-11 px-4 bg-gray-50 border ${errors.endDate ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm cursor-pointer`}
                                                />
                                                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">Usage Limits</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                    <HiUserGroup className="text-amber-500 w-4 h-4" /> Total Limit
                                                </label>
                                                <input
                                                    type="number"
                                                    value={coupon.totalLimit}
                                                    onChange={(e) => setCoupon({ ...coupon, totalLimit: parseInt(e.target.value) || 0 })}
                                                    placeholder="0 = Unlimited"
                                                    className="w-full h-10 sm:h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1">Set 0 for unlimited</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                    <HiUserGroup className="text-amber-500 w-4 h-4" /> Per User
                                                </label>
                                                <input
                                                    type="number"
                                                    value={coupon.perUserLimit}
                                                    onChange={(e) => setCoupon({ ...coupon, perUserLimit: parseInt(e.target.value) || 1 })}
                                                    className="w-full h-10 sm:h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">Options</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                            <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition-all">
                                                <input
                                                    type="checkbox"
                                                    checked={coupon.active}
                                                    onChange={(e) => setCoupon({ ...coupon, active: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${coupon.active ? 'bg-amber-600' : 'bg-gray-100 border border-gray-200'}`}>
                                                    {coupon.active && <HiCheck className="text-white text-xs" />}
                                                </div>
                                                <span className="ml-2.5 text-sm font-medium text-gray-700">Active</span>
                                            </label>

                                            <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition-all">
                                                <input
                                                    type="checkbox"
                                                    checked={coupon.firstOrderOnly}
                                                    onChange={(e) => setCoupon({ ...coupon, firstOrderOnly: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${coupon.firstOrderOnly ? 'bg-amber-600' : 'bg-gray-100 border border-gray-200'}`}>
                                                    {coupon.firstOrderOnly && <HiCheck className="text-white text-xs" />}
                                                </div>
                                                <span className="ml-2.5 text-sm font-medium text-gray-700">First Order</span>
                                            </label>

                                            <label className="flex items-center p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition-all">
                                                <input
                                                    type="checkbox"
                                                    checked={coupon.excludeDiscounted}
                                                    onChange={(e) => setCoupon({ ...coupon, excludeDiscounted: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${coupon.excludeDiscounted ? 'bg-amber-600' : 'bg-gray-100 border border-gray-200'}`}>
                                                    {coupon.excludeDiscounted && <HiCheck className="text-white text-xs" />}
                                                </div>
                                                <span className="ml-2.5 text-sm font-medium text-gray-700">Excl. Promo</span>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="shrink-0 p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-11 sm:h-12 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isProcessing}
                                    className="flex-1 h-11 sm:h-12 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <HiCheck className="w-4 h-4" />
                                            <span>Generate Coupon</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCoupon;