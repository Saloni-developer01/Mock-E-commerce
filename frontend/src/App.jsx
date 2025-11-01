// import { Outlet } from 'react-router-dom'
// import './App.css'


// function App() {

//   return (
//     <>
//       <Outlet/>
//       <h1>Hello</h1>
//     </>
//   )
// }

// export default App


















// src/App.jsx

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import CartView from './components/CartView'; // Next step mein banayenge
import API from './api';

function App() {
    const [cart, setCart] = useState(null); // Cart data store karne ke liye
    const [view, setView] = useState('products'); // 'products' ya 'cart' view ke liye
    const [alert, setAlert] = useState(null); // Notifications ke liye

    // Function to fetch the current cart data
    const fetchCart = async () => {
        try {
            const { data } = await API.get('/cart'); // GET /api/cart call
            setCart(data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setCart({ cartItems: [], subtotal: '0.00', totalItems: 0 }); // Empty cart set kar do
        }
    };

    useEffect(() => {
        fetchCart(); // Component mount hone par cart fetch karo
    }, []);

    // POST /api/cart function
    const handleAddToCart = async (productId, qty = 1) => {
        try {
            await API.post('/cart', { productId, qty }); 
            fetchCart(); // Cart update hone ke baad naya cart data fetch karo
            setAlert({ message: 'Item added to cart!', type: 'success' });
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            setAlert({ message: 'Failed to add item to cart.', type: 'error' });
            setTimeout(() => setAlert(null), 3000);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h1>Vibe Commerce Mock Cart</h1>
                <nav>
                    <button onClick={() => setView('products')} style={{ marginRight: '15px' }}>
                        Products
                    </button>
                    <button onClick={() => setView('cart')} style={{ position: 'relative' }}>
                        🛒 Cart ({cart ? cart.totalItems : 0})
                    </button>
                </nav>
            </header>

            {alert && (
                <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: alert.type === 'success' ? '#d4edda' : '#f8d7da', color: alert.type === 'success' ? '#155724' : '#721c24' }}>
                    {alert.message}
                </div>
            )}

            {cart && view === 'products' && (
                <ProductList onAddToCart={handleAddToCart} />
            )}

            {cart && view === 'cart' && (
                // Abhi hum CartView component banayenge
                <CartView cart={cart} fetchCart={fetchCart} setView={setView} setAlert={setAlert} /> 
            )}
        </div>
    );
}

export default App;