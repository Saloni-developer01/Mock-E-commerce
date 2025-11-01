# 🛒 Vibe Commerce: Full Stack Mock E-Commerce Cart

## ✨ Project Overview

This repository contains the solution for the Vibe Commerce internship screening assignment: a **Full-Stack Mock Shopping Cart Application**. The primary objective was to demonstrate full-stack proficiency by implementing core e-commerce functionalities, including product display, cart management, and a mock checkout flow for a **guest user**.


---

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | Developing the interactive and responsive user interface. |
| **Backend** | **Node.js, Express.js** | Handling server-side logic and managing REST API endpoints. |
| **Database** | **MongoDB (Mongoose)** | Persistent storage for Products, Cart Items, and Orders. |
| **API** | **RESTful APIs** | Communication protocol between the frontend and backend. |

---

## ⚙️ Setup and Installation

Follow these steps to set up and run the project locally. You must have **Node.js** and **MongoDB** configured.

### 1. Repository Clone

```bash
git clone https://github.com/Saloni-developer01/Mock-E-commerce.git
cd vibe-commerce-cart


### 2. Backend Setup (Node/Express)

1.  **Install Dependencies:**
    ```bash
    cd backend
    npm install
    ```
2.  **Create Environment File (`.env`):**
    In the `backend` folder, create a **`.env`** file and provide your MongoDB connection details:
    ```
    MONGO_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<CLUSTER>.mongodb.net/vibe_commerce_db
    PORT=5000
    ```
3.  **Seed Database (Upload Mock Products):**
    Run this script **once** to populate the MongoDB database with the initial product data:
    ```bash
    node seed.js
    ```
4.  **Start Backend Server:**
    ```bash
    npm run dev
    # Server will run on http://localhost:5000
    ```

### 3. Frontend Setup (React)

1.  **Install Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
2.  **Start Frontend App:**
    ```bash
    npm run dev
    # App will run on http://localhost:5173 (or similar port)
    ```

---

## 📌 API Endpoints

The application utilizes the following RESTful endpoints:

| Route | Method | Description | Example Body (if POST) |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Fetches all available mock products from the database. | N/A |
| `/api/cart` | `POST` | Adds a new item to the cart or updates the quantity of an existing item. | `{ "productId": 3, "qty": 1 }` |
| `/api/cart` | `GET` | Retrieves all cart items, including product details and the calculated subtotal. | N/A |
| `/api/cart/:id` | `DELETE` | Removes a specific item from the cart using its unique `CartItem ID`. | N/A |
| `/api/cart/checkout` | `POST` | Mocks the payment process, saves the order record, and clears the current shopping cart. | `{ "customerName": "...", "customerEmail": "..." }` |

---

## 📸 Screenshots

| Products Grid | Cart Summary | Checkout Receipt |
| :---: | :---: | :---: |
| [Screenshot of Products List] | [Screenshot of Cart View with Total] | [Screenshot of Confirmation/Receipt Modal] |

---

## 🎥 Demo Video

A brief **1-2 minute video demo** covering the application's core functionality: adding, removing items, and completing the checkout process to view the receipt.

**Video Link (Loom):**
`https://www.loom.com/share/0115612cc762456fa772f04ba09c1362`