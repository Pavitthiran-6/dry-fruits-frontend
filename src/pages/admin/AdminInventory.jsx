import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiSearch, HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { fetchProducts, deleteProduct } from '../../store/slices/productsSlice';

const AdminInventory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const getStatusColor = (stock) => {
        if (stock === 0) return 'bg-red-100 text-red-700';
        if (stock <= 10) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getStatusText = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 10) return 'Low Stock';
        return 'In Stock';
    };

    const filteredInventory = products.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddProduct = () => {
        navigate('/admin/add-product');
    };

    const handleEditProduct = (id) => {
        navigate(`/admin/edit-product/${id}`);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            dispatch(deleteProduct(productToDelete.id));
            setDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    // Calculate stats
    const totalProducts = products.length;
    const inStock = products.filter(p => p.stock > 10).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return (
        <div className="w-full p-4 md:p-6">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Inventory</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage products</p>
                </div>

                <button
                    onClick={handleAddProduct}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                    <HiPlus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg">Total: {totalProducts}</div>
                <div className="bg-white p-4 rounded-lg text-green-600">In Stock: {inStock}</div>
                <div className="bg-white p-4 rounded-lg text-yellow-600">Low: {lowStock}</div>
                <div className="bg-white p-4 rounded-lg text-red-600">Out: {outOfStock}</div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[700px] md:min-w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-xs">Product</th>
                                <th className="px-4 py-3 text-xs">Price</th>
                                <th className="px-4 py-3 text-xs">Stock</th>
                                <th className="px-4 py-3 text-xs">Status</th>
                                <th className="px-4 py-3 text-xs">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <img 
                                                src={item.image || 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&h=500&fit=crop'} 
                                                className="w-10 h-10 rounded object-cover" 
                                                alt={item.name}
                                            />
                                            <span className="text-sm">{item.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">₹{item.price}</td>
                                        <td className="px-4 py-3 text-sm">{item.stock}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.stock)}`}>
                                                {getStatusText(item.stock)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button 
                                                onClick={() => handleEditProduct(item.id)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <HiPencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(item)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <HiTrash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{productToDelete?.name}"?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default AdminInventory;
