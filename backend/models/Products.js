const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    name: {
        type: String, required: true
    },
    category: String,
    description: String,
    price: {
        type: Number, required: true
    },
    oldPrice: Number,
    image: String,
    color: String,
    rating: {
        type: Number, default: 0
    },
},
    { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;