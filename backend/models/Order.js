const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                productId: { type: Number, required: true },
            },
        ],
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        
        totalAmount: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: true }, // Since it's a mock payment
        paidAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true, 
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;