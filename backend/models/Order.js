// backend/models/Order.js

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        // Yahan hum cart items ko directly save kar lenge
        orderItems: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                productId: { type: Number, required: true },
            },
        ],
        // Checkout Form se aane waali details
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        
        // Final calculations
        totalAmount: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: true }, // Since it's a mock payment
        paidAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true, // Order ki date/time track karne ke liye
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;