import React, { useState, useEffect } from 'react';
import API from '../api';

const ProductList = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <h2 className="text-center text-xl font-semibold mt-10">Loading Products...</h2>;
    if (error) return <h2 className="text-center text-xl font-semibold text-red-600 mt-10">{error}</h2>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-gray-700">Shop Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div 
                        key={product._id} 
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                    >
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{product.description.substring(0, 50)}...</p>
                            <p className="text-2xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>

                            <button 
                                onClick={() => onAddToCart(product._id)}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-150 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;