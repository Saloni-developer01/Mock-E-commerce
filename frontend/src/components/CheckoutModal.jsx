
import React, { useState } from 'react';
import API from '../api';

const CheckoutModal = ({ cartItems, totalAmount, onClose, fetchCart, setView }) => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [receipt, setReceipt] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const { data } = await API.post('/cart/checkout', {
                customerName: formData.name,
                customerEmail: formData.email,
            });

            console.log("Checkout successful. Receipt data:", data.receipt);
            setReceipt(data.receipt); 

        } catch (error) {
            alert('Checkout failed: ' + (error.response?.data?.message || 'Server error.'));
            onClose();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        fetchCart(); 
        setView('products'); 
        onClose(); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold transition"
                >
                    &times;
                </button>

                {receipt ? (
                    <div className="text-center">
                        <h3 className="text-3xl font-extrabold text-green-600 mb-4">🎉 Order Confirmed!</h3>
                        <p className="text-lg text-gray-700 mb-6">Thank you for your purchase, **{receipt.customerName}**!</p>
                        
                        <div className="bg-gray-100 p-5 rounded-lg border border-gray-200 text-left space-y-2 mb-8">
                            <p className="font-semibold text-gray-800">Order ID: <span className="font-normal block sm:inline">{receipt.orderId}</span></p>
                            <p className="font-semibold text-gray-800">Total Paid: <span className="text-green-600">${receipt.totalPaid}</span></p>
                            <p className="font-semibold text-gray-800">Items: {receipt.itemsCount}</p>
                            <p className="text-sm text-gray-500">Timestamp: {new Date(receipt.timestamp).toLocaleString()}</p>
                        </div>

                        <button 
                            onClick={handleClose} 
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <h3 className="text-2xl font-bold text-gray-900 border-b pb-3">Checkout Details</h3>
                        <p className="text-xl font-bold text-gray-700">Total Payable: <span className="text-indigo-600">${totalAmount}</span></p>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1" htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1" htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isProcessing} 
                            className={`w-full py-3 rounded-lg font-semibold transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            {isProcessing ? 'Processing...' : 'Complete Purchase (Mock Payment)'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;