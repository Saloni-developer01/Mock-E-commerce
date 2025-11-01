// src/components/CartView.jsx

import React, { useState } from 'react';
import API from '../api';
import CheckoutModal from './CheckoutModal'; // Next step mein banayenge

const CartView = ({ cart, fetchCart, setView, setAlert }) => {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // DELETE /api/cart/:id function
    const handleRemoveItem = async (cartItemId) => {
        try {
            await API.delete(`/cart/${cartItemId}`);
            fetchCart(); // Cart refresh karo
            setAlert({ message: 'Item removed from cart.', type: 'success' });
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            setAlert({ message: 'Failed to remove item.', type: 'error' });
            setTimeout(() => setAlert(null), 3000);
        }
    };

    if (cart.totalItems === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #ccc' }}>
                <h2>Your Cart is Empty 🥺</h2>
                <button onClick={() => setView('products')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-view-container">
            <h2>🛒 Your Shopping Cart</h2>

            <div className="cart-items">
                {cart.cartItems.map(item => (
                    <div key={item._id} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} />
                            <div>
                                <p style={{ fontWeight: 'bold' }}>{item.product.name}</p>
                                <p>Qty: {item.quantity} x ${item.priceAtAddition.toFixed(2)}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 'bold' }}>${item.itemTotal.toFixed(2)}</p>
                            <button onClick={() => handleRemoveItem(item._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary" style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '15px' }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em' }}>
                    <span>Subtotal:</span>
                    <span>${cart.subtotal}</span>
                </p>

                <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1em' }}
                >
                    Proceed to Checkout
                </button>
            </div>

            {isCheckoutOpen && (
                <CheckoutModal 
                    cartItems={cart.cartItems}
                    totalAmount={cart.subtotal}
                    onClose={() => setIsCheckoutOpen(false)}
                    fetchCart={fetchCart}
                    setView={setView}
                />
            )}
        </div>
    );
};

export default CartView;