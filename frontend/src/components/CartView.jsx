// // src/components/CartView.jsx

// import React, { useState } from 'react';
// import API from '../api';
// import CheckoutModal from './CheckoutModal'; // Next step mein banayenge

// const CartView = ({ cart, fetchCart, setView, setAlert }) => {
//     const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

//     // DELETE /api/cart/:id function
//     const handleRemoveItem = async (cartItemId) => {
//         try {
//             await API.delete(`/cart/${cartItemId}`);
//             fetchCart(); // Cart refresh karo
//             setAlert({ message: 'Item removed from cart.', type: 'success' });
//             setTimeout(() => setAlert(null), 3000);
//         } catch (error) {
//             setAlert({ message: 'Failed to remove item.', type: 'error' });
//             setTimeout(() => setAlert(null), 3000);
//         }
//     };

//     if (cart.totalItems === 0) {
//         return (
//             <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #ccc' }}>
//                 <h2>Your Cart is Empty 🥺</h2>
//                 <button onClick={() => setView('products')}>Start Shopping</button>
//             </div>
//         );
//     }

//     return (
//         <div className="cart-view-container">
//             <h2>🛒 Your Shopping Cart</h2>

//             <div className="cart-items">
//                 {cart.cartItems.map(item => (
//                     <div key={item._id} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
//                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                             <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} />
//                             <div>
//                                 <p style={{ fontWeight: 'bold' }}>{item.product.name}</p>
//                                 <p>Qty: {item.quantity} x ${item.priceAtAddition.toFixed(2)}</p>
//                             </div>
//                         </div>
//                         <div style={{ textAlign: 'right' }}>
//                             <p style={{ fontWeight: 'bold' }}>${item.itemTotal.toFixed(2)}</p>
//                             <button onClick={() => handleRemoveItem(item._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
//                                 Remove
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="cart-summary" style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '15px' }}>
//                 <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em' }}>
//                     <span>Subtotal:</span>
//                     <span>${cart.subtotal}</span>
//                 </p>

//                 <button 
//                     onClick={() => setIsCheckoutOpen(true)}
//                     style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1em' }}
//                 >
//                     Proceed to Checkout
//                 </button>
//             </div>

//             {isCheckoutOpen && (
//                 <CheckoutModal 
//                     cartItems={cart.cartItems}
//                     totalAmount={cart.subtotal}
//                     onClose={() => setIsCheckoutOpen(false)}
//                     fetchCart={fetchCart}
//                     setView={setView}
//                 />
//             )}
//         </div>
//     );
// };

// export default CartView;












































// src/components/CartView.jsx (Tailwind CSS Update)

import React, { useState } from 'react';
import API from '../api';
import CheckoutModal from './CheckoutModal'; 

const CartView = ({ cart, fetchCart, setView, setAlert }) => {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // DELETE /api/cart/:id function
    const handleRemoveItem = async (cartItemId) => {
        try {
            await API.delete(`/cart/${cartItemId}`);
            fetchCart(); 
            setAlert({ message: 'Item removed from cart.', type: 'success' });
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            setAlert({ message: 'Failed to remove item.', type: 'error' });
            setTimeout(() => setAlert(null), 3000);
        }
    };

    if (cart.totalItems === 0) {
        return (
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-xl max-w-lg mx-auto bg-gray-50 mt-10">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your Cart is Empty 🥺</h2>
                <button 
                    onClick={() => setView('products')}
                    className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">🛒 Your Shopping Cart</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-grow lg:w-3/5 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="space-y-4">
                        {cart.cartItems.map(item => (
                            <div key={item._id} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={item.product.image} 
                                        alt={item.product.name} 
                                        className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.priceAtAddition.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <p className="font-bold text-lg text-gray-800">${item.itemTotal.toFixed(2)}</p>
                                    <button 
                                        onClick={() => handleRemoveItem(item._id)} 
                                        className="text-red-500 text-sm hover:text-red-700 transition font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-xl h-fit border border-gray-200">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">Order Summary</h3>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between font-medium text-gray-600">
                            <span>Total Items:</span>
                            <span>{cart.totalItems}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-300">
                            <span>Subtotal:</span>
                            <span className="text-indigo-600">${cart.subtotal}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full bg-green-600 text-white py-3 mt-6 rounded-lg font-semibold hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Proceed to Checkout
                    </button>
                </div>
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