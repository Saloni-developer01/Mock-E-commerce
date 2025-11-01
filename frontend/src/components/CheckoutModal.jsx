// src/components/CheckoutModal.jsx

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
            // POST /api/cart/checkout call
            const { data } = await API.post('/cart/checkout', {
                customerName: formData.name,
                customerEmail: formData.email,
                // Note: CartItems ko backend khud hi fetch kar raha hai
            });

            // 👇 Check karein ki data.receipt mein data hai ya nahi
        console.log("Checkout successful. Receipt data:", data.receipt);

            setReceipt(data.receipt); // Receipt display ke liye save karo

            // fetchCart(); // Cart ko empty karne ke liye refresh

        } catch (error) {
            alert('Checkout failed: ' + (error.response?.data?.message || 'Server error.'));
            onClose();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        fetchCart();
        setView('products'); // Products view par wapas bhejo
        onClose(); 
    };

    return (
        <div className="modal-overlay" style={modalStyles.overlay}>
            <div className="modal-content" style={modalStyles.content}>
                <button onClick={handleClose} style={modalStyles.closeButton}>&times;</button>

                {receipt ? (
                    // === Receipt View ===
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h3>🎉 Order Confirmed!</h3>
                        <p>Thank you for your purchase, **{receipt.customerName}**!</p>
                        <div style={modalStyles.receiptBox}>
                            <p><strong>Order ID:</strong> {receipt.orderId}</p>
                            <p><strong>Total Paid:</strong> ${receipt.totalPaid}</p>
                            <p><strong>Items:</strong> {receipt.itemsCount}</p>
                            <p><strong>Timestamp:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
                        </div>
                        <button onClick={handleClose} style={{ ...modalStyles.button, backgroundColor: '#007bff' }}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    // === Checkout Form ===
                    <form onSubmit={handleSubmit} style={modalStyles.form}>
                        <h3>Checkout Details</h3>
                        <p style={{ fontWeight: 'bold' }}>Total Payable: ${totalAmount}</p>

                        <label style={modalStyles.label}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={modalStyles.input}
                        />

                        <label style={modalStyles.label}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={modalStyles.input}
                        />

                        <button type="submit" disabled={isProcessing} style={modalStyles.button}>
                            {isProcessing ? 'Processing...' : 'Complete Purchase (Mock Payment)'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

// Basic inline styles for the modal
const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    content: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '400px', position: 'relative' },
    closeButton: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    label: { fontWeight: 'bold', marginBottom: '5px' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    button: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' },
    receiptBox: { border: '1px solid #ddd', padding: '15px', margin: '20px 0', textAlign: 'left', backgroundColor: '#f9f9f9' }
};

export default CheckoutModal;