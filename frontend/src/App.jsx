import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import CartView from './components/CartView'; 
import API from './api';
import './App.css';

function App() {
    const [cart, setCart] = useState(null);
    const [view, setView] = useState('products'); 
    const [alert, setAlert] = useState(null); 

    const fetchCart = async () => {
        try {
            const { data } = await API.get('/cart'); 
            setCart(data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setCart({ cartItems: [], subtotal: '0.00', totalItems: 0 }); 
        }
    };

    useEffect(() => {
        fetchCart(); 
    }, []);

    const handleAddToCart = async (productId, qty = 1) => {
        try {
            await API.post('/cart', { productId, qty }); 
            fetchCart(); 
            setAlert({ message: 'Item added to cart!', type: 'success' });
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            setAlert({ message: 'Failed to add item to cart.', type: 'error' });
            setTimeout(() => setAlert(null), 3000);
        }
    };

    return (
        <>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px', paddingTop: '10px' }}>
                <h1>Vibe Commerce <span>Mock Cart</span></h1>
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
                <CartView cart={cart} fetchCart={fetchCart} setView={setView} setAlert={setAlert} /> 
            )}
        </div>

      
        </>
    );
}

export default App;