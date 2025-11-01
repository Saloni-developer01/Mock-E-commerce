const express = require('express');
const Products = require('../models/Products.js');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Products.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Products not found' });
    }
});

module.exports = router;