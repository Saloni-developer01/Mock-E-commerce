const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Products.js');
const products = require('./data/products.json'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connected for seeding!');
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        await Product.deleteMany();

        await Product.insertMany(products);

        console.log('Data Imported! ✅');
        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
    }
};

importData();