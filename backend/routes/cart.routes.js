const express = require('express');
const Cart = require('../models/Cart.js');
const Product = require('../models/Products.js');
const Order = require('../models/Order.js');

const router = express.Router();

// add to cart
router.post('/', async (req, res) => {
    const { productId, qty } = req.body;

    if (!productId || !qty) {
        return res.status(400).json({ message: 'Please provide productId and quantity.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let cartItem = await Cart.findOne({ productId: productId });

        if (cartItem) {
            cartItem.quantity += qty;
            await cartItem.save();
            res.status(200).json(cartItem);
        } else {
            cartItem = new Cart({
                productId: productId,
                quantity: qty,
                priceAtAddition: product.price, 
            });
            await cartItem.save();
            res.status(201).json(cartItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding to cart.' });
    }
});


// get Product of cart
router.get('/', async (req, res) => {
    try {
        const cartItems = await Cart.find({})
            .populate({
                path: 'productId',
                model: 'Product',
                select: 'name image price description category', 
            });

        let subtotal = 0;
        let totalItems = 0;
        
        const detailedCart = cartItems.map(item => {
            if (!item.productId) return null; 

            const itemPrice = item.quantity * item.priceAtAddition;
            subtotal += itemPrice;
            totalItems += item.quantity;

            return {
                _id: item._id, 
                product: item.productId, 
                quantity: item.quantity,
                priceAtAddition: item.priceAtAddition,
                itemTotal: itemPrice,
            };
        }).filter(item => item !== null); 
        res.json({
            cartItems: detailedCart,
            subtotal: subtotal.toFixed(2), 
            totalItems: totalItems, 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching cart.' });
    }
});


// product delete from cart
router.delete('/:id', async (req, res) => {
    const cartItemId = req.params.id;

    try {
        const deletedItem = await Cart.findByIdAndDelete(cartItemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        res.json({ message: 'Item removed from cart successfully.', deletedItemId: deletedItem._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while removing item from cart.' });
    }
});


router.post('/checkout', async (req, res) => {
    const { customerName, customerEmail } = req.body; 

    if (!customerName || !customerEmail) {
        return res.status(400).json({ message: 'Please provide Name and Email for checkout.' });
    }

    try {
        const cartItems = await Cart.find({})
            .populate({
                path: 'productId',
                model: 'Product',
                select: 'name price', 
            });
        
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty. Please add items.' });
        }

        let totalAmount = 0;
        const orderItems = [];

        cartItems.forEach(item => {
            const itemTotal = item.quantity * item.priceAtAddition;
            totalAmount += itemTotal;

            orderItems.push({
                name: item.productId.name,
                price: item.priceAtAddition,
                quantity: item.quantity,
                productId: item.productId._id,
            });
        });

        const order = new Order({
            orderItems,
            customerName,
            customerEmail,
            totalAmount: totalAmount.toFixed(2),
        });

        const createdOrder = await order.save();

        await Cart.deleteMany({});
        
        res.status(201).json({
            message: 'Checkout successful! Order Placed.',
            receipt: {
                orderId: createdOrder._id,
                timestamp: createdOrder.paidAt,
                customerName: createdOrder.customerName,
                totalPaid: createdOrder.totalAmount,
                itemsCount: orderItems.length,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during checkout process.' });
    }
});




router.put('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { newQty } = req.body;

    if (!newQty || newQty < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than zero.' });
    }

    try {
        const cartItem = await Cart.findOne({ productId: productId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        cartItem.quantity = newQty;
        
        await cartItem.save();
        res.status(200).json(cartItem);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating cart quantity.' });
    }
});

module.exports = router;