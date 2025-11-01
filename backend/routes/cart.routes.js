const express = require('express');
const Cart = require('../models/Cart.js');
const Product = require('../models/Products.js');
const Order = require('../models/Order.js');

const router = express.Router();

// add to cart
router.post('/', async (req, res) => {
    const { productId, qty } = req.body;

    // Input validation
    if (!productId || !qty) {
        return res.status(400).json({ message: 'Please provide productId and quantity.' });
    }

    try {
        // 1. Check if product exists and get its price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // 2. Check if item is already in cart
        let cartItem = await Cart.findOne({ productId: productId });

        if (cartItem) {
            // Item already hai, toh quantity update karo
            cartItem.quantity += qty;
            await cartItem.save();
            res.status(200).json(cartItem);
        } else {
            // Item naya hai, toh add karo
            cartItem = new Cart({
                productId: productId,
                quantity: qty,
                priceAtAddition: product.price, // Current price store kiya
                // cartSessionId: 'GUEST_CART_123' // Agar session logic use kar rahe hain
            });
            await cartItem.save();
            res.status(201).json(cartItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding to cart.' });
    }
});


// get from cart
router.get('/', async (req, res) => {
    try {
        // 1. Fetch Cart Items aur Product details ko populate (merge) karein
        const cartItems = await Cart.find({})
            .populate({
                path: 'productId',
                model: 'Product',
                // Bas zaroori fields hi lao, jaise name, image, price
                select: 'name image price description category', 
            });

        let subtotal = 0;
        let totalItems = 0;
        
        const detailedCart = cartItems.map(item => {
            // Yeh check zaroori hai agar product delete ho gaya ho
            if (!item.productId) return null; 

            // Calculate item price (Quantity * PriceAtAddition)
            const itemPrice = item.quantity * item.priceAtAddition;
            subtotal += itemPrice;
            totalItems += item.quantity;

            return {
                _id: item._id, // CartItem ka ID
                product: item.productId, // Poora Product object
                quantity: item.quantity,
                priceAtAddition: item.priceAtAddition,
                itemTotal: itemPrice,
            };
        }).filter(item => item !== null); // Null items ko hata do

        // Response mein detailed cart aur total bhejein
        res.json({
            cartItems: detailedCart,
            subtotal: subtotal.toFixed(2), // 2 decimal places tak
            totalItems: totalItems,
            // Delivery aur Tax agar add karna ho, toh yahan add hoga
            // total: (subtotal + delivery + tax).toFixed(2), 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching cart.' });
    }
});


// delete from cart
router.delete('/:id', async (req, res) => {
    const cartItemId = req.params.id;

    try {
        // Find the item by its CartItem ID (jo GET /api/cart se mila tha)
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


// checkout and create order
router.post('/checkout', async (req, res) => {
    // Frontend se Name aur Email aayega (Checkout Form se)
    const { customerName, customerEmail } = req.body; 

    if (!customerName || !customerEmail) {
        return res.status(400).json({ message: 'Please provide Name and Email for checkout.' });
    }

    try {
        // 1. Current cart items fetch karo (jaise GET /api/cart mein kiya tha)
        const cartItems = await Cart.find({})
            .populate({
                path: 'productId',
                model: 'Product',
                select: 'name price', // Sirf zaroori details
            });
        
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty. Please add items.' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // 2. Order items prepare karo aur Total Calculate karo
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

        // 3. Naya Order Create karo aur DB mein save karo
        const order = new Order({
            orderItems,
            customerName,
            customerEmail,
            totalAmount: totalAmount.toFixed(2),
        });

        const createdOrder = await order.save();

        // 4. Cart ko empty karo (Sab Cart items delete karo)
        await Cart.deleteMany({});
        
        // 5. Success response aur mock receipt bhejo
        res.status(201).json({
            message: 'Checkout successful! Order Placed.',
            receipt: {
                orderId: createdOrder._id,
                timestamp: createdOrder.paidAt,
                customerName: createdOrder.customerName,
                totalPaid: createdOrder.totalAmount,
                itemsCount: orderItems.length,
                // Aap poora order object bhi bhej sakte hain
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during checkout process.' });
    }
});

module.exports = router;