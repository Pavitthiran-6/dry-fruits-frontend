import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const AdminCustomers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers] = useState([]);

    const filteredCustomers = customers.filter(customer =>
        customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customers Management</h1>
                    <p className="text-gray-600">View and manage customer accounts</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Name or Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <motion.div
                            key={customer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-bold text-lg">
                                        {customer.name ? customer.name.charAt(0) : '?'}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                                    <p className="text-sm text-gray-500">Customer since {customer.joinDate}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <HiMail className="w-4 h-4 mr-2" />
                                    {customer.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <HiPhone className="w-4 h-4 mr-2" />
                                    {customer.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <HiLocationMarker className="w-4 h-4 mr-2" />
                                    {customer.address}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-amber-600">{customer.orders}</p>
                                    <p className="text-xs text-gray-500">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-green-600">₹{customer.totalSpent}</p>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No customers found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
