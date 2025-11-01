// src/components/ProductList.jsx

import React, { useState, useEffect } from 'react';
import API from '../api';

const ProductList = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products'); // GET /api/products call
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means run once on mount

    if (loading) return <h2>Loading Products...</h2>;
    if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

    return (
        <div className="product-list-container">
            <h2>🛍️ Products</h2>
            <div className="product-grid" style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px'
            }}>
                {products.map(product => (
                    <div key={product._id} className="product-card" style={{
                        border: '1px solid #ccc', 
                        padding: '15px', 
                        borderRadius: '8px'
                    }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <h3>{product.name}</h3>
                        <p>{product.description.substring(0, 50)}...</p>
                        <p style={{ fontWeight: 'bold' }}>Price: ${product.price.toFixed(2)}</p>

                        {/* 'Add to Cart' button par click hone par Cart API call hoga */}
                        <button 
                            onClick={() => onAddToCart(product._id)}
                            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;