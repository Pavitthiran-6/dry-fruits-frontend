import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiPhone, HiCheck, HiLocationMarker, HiPlus, HiTrash, HiCamera } from 'react-icons/hi';
import { updateProfile } from '../store/slices/authSlice';

// Cartoon avatars for selection
const cartoonAvatars = [
    '🐻', '🐼', '🐨', '🦊', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲'
];

const MyProfile = () => {
    // Generate random 10-digit number
    const generateRandomPhone = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const fileInputRef = useRef(null);

    // Get name from email (before @) if no name is set
    const getInitialName = () => {
        if (user?.name) return user.name;
        if (user?.email) {
            return user.email.split('@')[0].replace(/[.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        return '';
    };

    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🐻');
    const [uploadedImage, setUploadedImage] = useState(user?.avatar?.startsWith('data:image') ? user.avatar : null);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [addresses, setAddresses] = useState(user?.addresses || [
        {
            id: 1,
            type: 'Home',
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            isDefault: true
        }
    ]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Refresh form data when user data changes
    useEffect(() => {
        if (user) {
            const nameFromEmail = user.email ? user.email.split('@')[0].replace(/[.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
            setFormData({
                name: '',
                phone: '',
            });
            setAddresses(user.addresses || []);
            if (user.avatar) {
                if (user.avatar.startsWith('data:image')) {
                    setUploadedImage(user.avatar);
                    setSelectedAvatar(null);
                } else {
                    setSelectedAvatar(user.avatar);
                    setUploadedImage(null);
                }
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return;
        }
        if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            setError('Please enter a valid phone number');
            return;
        }

        const avatar = uploadedImage || selectedAvatar;
        dispatch(updateProfile({ ...formData, addresses, avatar }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
            setError('Please fill all address fields');
            return;
        }
        const address = {
            ...newAddress,
            id: Date.now(),
            isDefault: addresses.length === 0 ? true : newAddress.isDefault
        };
        if (address.isDefault) {
            setAddresses(addresses.map(a => ({ ...a, isDefault: false })).concat(address));
        } else {
            setAddresses([...addresses, address]);
        }
        setNewAddress({
            type: 'Home',
            street: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false
        });
        setShowAddressForm(false);
        setError('');
    };

    const handleDeleteAddress = (id) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const handleSetDefault = (id) => {
        // Delete previous default address and set new one as default
        const updatedAddresses = addresses
            .filter(a => a.id !== id)  // Remove the address we're making default
            .map(a => ({ ...a, isDefault: false }));  // Make all others non-default

        const newDefaultAddress = addresses.find(a => a.id === id);
        setAddresses([...updatedAddresses, { ...newDefaultAddress, isDefault: true }]);
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        setUploadedImage(null);
        setShowAvatarPicker(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                setSelectedAvatar(null);
                setShowAvatarPicker(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateAvatar = () => {
        setShowAvatarPicker(!showAvatarPicker);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto md:max-w-2xl"
                >
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            {/* Avatar Section */}
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                                    {uploadedImage ? (
                                        <img src={uploadedImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : selectedAvatar ? (
                                        <span className="text-4xl">{selectedAvatar}</span>
                                    ) : (
                                        <span className="text-4xl text-white font-bold">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleUpdateAvatar}
                                    className="absolute bottom-4 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-amber-600 transition-colors"
                                >
                                    <HiCamera className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Avatar Picker */}
                            {showAvatarPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100"
                                >
                                    <p className="text-sm font-medium text-gray-600 mb-3">Choose Avatar</p>
                                    <div className="grid grid-cols-5 gap-2 mb-4">
                                        {cartoonAvatars.map((avatar) => (
                                            <button
                                                key={avatar}
                                                onClick={() => handleAvatarSelect(avatar)}
                                                className={`text-3xl p-2 rounded-xl transition-colors ${selectedAvatar === avatar && !uploadedImage
                                                    ? 'bg-amber-100 ring-2 ring-amber-600'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {avatar}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-sm font-medium text-gray-600 mb-2">Upload Photo</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            Choose File
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Manage your personal information</p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center"
                            >
                                <HiCheck className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-green-600 font-medium">Profile updated successfully!</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 md:pl-14 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full pl-12 md:pl-14 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                <div className="relative">
                                    <HiPhone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                    <div className="absolute left-10 md:left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm z-10 bg-white">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-16 md:pl-20 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Addresses Section */}
                            <div className="pt-5 md:pt-6 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">My Addresses</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-colors text-sm"
                                    >
                                        <HiPlus className="w-5 h-5 mr-1" />
                                        Add Address
                                    </button>
                                </div>

                                {/* Address Form */}
                                {showAddressForm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-50 rounded-2xl p-4 md:p-6 mb-5 md:mb-6"
                                    >
                                        <form onSubmit={handleAddAddress} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">Address Type</label>
                                                    <select
                                                        name="type"
                                                        value={newAddress.type}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors bg-white text-sm"
                                                    >
                                                        <option value="Home">Home</option>
                                                        <option value="Office">Office</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={newAddress.pincode}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm"
                                                        placeholder="400001"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">Street Address</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={newAddress.street}
                                                    onChange={handleAddressChange}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm"
                                                    placeholder="House No., Building Name, Street"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={newAddress.city}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm"
                                                        placeholder="Mumbai"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={newAddress.state}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-600 focus:outline-none transition-colors text-sm"
                                                        placeholder="Maharashtra"
                                                    />
                                                </div>
                                            </div>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="isDefault"
                                                    checked={newAddress.isDefault}
                                                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-600"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    className="w-full sm:flex-1 py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white font-medium rounded-lg"
                                                >
                                                    Add Address
                                                </motion.button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="w-full sm:w-auto px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* Address List */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {addresses.map((address) => (
                                        <motion.div
                                            key={address.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`relative p-4 md:p-5 rounded-2xl border-2 transition-colors ${address.isDefault ? 'border-amber-600 bg-amber-50' : 'border-gray-100 bg-white'
                                                }`}
                                        >
                                            {address.isDefault && (
                                                <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                                                    Default
                                                </span>
                                            )}
                                            <div className="flex items-start gap-3">
                                                <HiLocationMarker className="w-5 h-5 text-amber-600 mt-1" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{address.type}</p>
                                                    <p className="text-gray-600 text-sm mt-1">{address.street}</p>
                                                    <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                                {!address.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefault(address.id)}
                                                        className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAddress(address.id)}
                                                    className="text-sm text-red-500 hover:text-red-600 font-medium ml-auto flex items-center"
                                                >
                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {addresses.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <HiLocationMarker className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No addresses added yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Save Changes Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow mt-2"
                            >
                                Save Changes
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MyProfile;
