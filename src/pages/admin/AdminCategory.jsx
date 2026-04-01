import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiSearch, HiPlus, HiPencil, HiTrash, HiFolder, HiX } from 'react-icons/hi';
import { addCategory, deleteCategory, updateCategory } from '../../store/slices/productsSlice';

const AdminCategory = () => {
    const dispatch = useDispatch();
    const { products, categories } = useSelector((state) => state.products);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Get unique categories from store
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCategory = () => {
        if (categoryName.trim()) {
            if (editCategory) {
                dispatch(updateCategory({ oldName: editCategory, newName: categoryName.trim() }));
            } else {
                dispatch(addCategory(categoryName.trim()));
            }
            setCategoryName('');
            setEditCategory(null);
            setModalOpen(false);
        }
    };

    const handleEditClick = (category) => {
        setEditCategory(category);
        setCategoryName(category);
        setModalOpen(true);
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            dispatch(deleteCategory(categoryToDelete));
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const openAddModal = () => {
        setEditCategory(null);
        setCategoryName('');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCategoryName('');
        setEditCategory(null);
    };

    return (
        <div className="w-full p-4 md:p-6">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage product categories</p>
                </div>

                <button
                    onClick={openAddModal}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <HiPlus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Categories</p>
                            <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <HiFolder className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <HiFolder className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Categories</p>
                            <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <HiFolder className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Products</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Stock</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Value</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCategories.map((category) => {
                                const categoryProducts = products.filter(p => p.category === category.name);
                                const stats = {
                                    count: categoryProducts.length,
                                    totalStock: categoryProducts.reduce((sum, p) => sum + (p.stock || 0), 0),
                                    totalValue: categoryProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
                                };
                                return (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">{category.icon}</span>
                                                </div>
                                                <span className="font-medium text-gray-800">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {stats.count} products
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {stats.totalStock} units
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            ₹{stats.totalValue.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(category.name)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <HiPencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredCategories.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No categories found
                    </div>
                )}
            </div>

            {/* Add/Edit Category Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editCategory ? 'Edit Category' : 'Add Category'}
                            </h3>
                            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                                <HiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                placeholder="Enter category name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-3 p-4 border-t">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                {editCategory ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Category</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete "{categoryToDelete}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 p-4 border-t">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategory;
