// src/api.js

import axios from 'axios';

const API = axios.create({
    // Yeh woh URL hai jahan aapka Node/Express server chal raha hai
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;