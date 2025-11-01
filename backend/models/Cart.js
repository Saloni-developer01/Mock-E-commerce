const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        ref: 'Product', 
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    priceAtAddition: { 
        type: Number,
        required: true,
    },
});

const Cart = mongoose.model('Cart', cartItemSchema);

module.exports = Cart;