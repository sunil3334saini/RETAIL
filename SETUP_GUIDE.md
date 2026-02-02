# Pizza & Breads Ordering Portal - Setup Guide

## Project Structure

```
Retail/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   └── routes/
│       ├── menu.js            # Menu and products API routes
│       └── cart.js            # Shopping cart API routes
├── frontend/
│   ├── package.json           # Frontend dependencies
│   ├── public/
│   │   └── index.html         # HTML entry point
│   └── src/
│       ├── App.js             # Main React component
│       ├── App.css            # Global styles
│       ├── index.js           # React DOM render
│       └── pages/
│           ├── LandingPage.js        # Home page
│           ├── MenuPage.js           # Categories page
│           ├── ProductListingPage.js # Products page
│           ├── CartPage.js           # Shopping cart
│           └── OrderConfirmationPage.js # Order confirmation
└── TODO.md                    # Project tasks
```

## Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Start Backend Server
```bash
npm run dev  # Development with auto-reload
# or
npm start   # Production mode
```

The backend will run on `http://localhost:5000`

### Backend API Endpoints

**Menu Routes:**
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/products/:categoryId` - Get products by category
- `GET /api/menu/products` - Get all products
- `GET /api/menu/product/:productId` - Get specific product

**Cart Routes:**
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/:cartId` - Get cart contents
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/clear` - Clear entire cart

## Frontend Setup

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Frontend Application
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Features Implemented

### Core Pages & Navigation ✓
- [x] **Landing Page** - Welcome screen with call-to-action
- [x] **Menu Page** - Category selection (Pizza, Cold Drinks, Breads)
- [x] **Product Listing Page** - Products with prices and quantity selector
- [x] **Shopping Cart** - Display cart items, calculate totals, remove items
- [x] **Order Confirmation** - Display order number and summary

### Product Management ✓
- [x] Display products with descriptions and prices
- [x] Quantity selector for each product
- [x] Add to Cart functionality
- [x] Cart persistence using localStorage

### Cart Features ✓
- [x] Display all cart items
- [x] Show individual and total prices
- [x] Calculate subtotal, tax (10%), and final total
- [x] Remove items from cart
- [x] Place order button

### Additional Features ✓
- [x] Responsive design for mobile and desktop
- [x] Clean and intuitive UI
- [x] Navigation bar with cart counter
- [x] Order confirmation with unique order number
- [x] Order summary on confirmation page

## Code Explanation

### LandingPage.js
- Displays welcome banner and features
- Provides "Start Shopping" button to navigate to menu
- Fetches and displays service features

### MenuPage.js
- Fetches categories from backend API
- Displays 3 categories: Pizza, Cold Drinks, Breads
- Navigation to product listing page for each category

### ProductListingPage.js
- Fetches products for selected category
- Shows quantity selector with input field
- "Add to Cart" button to add products to cart
- Multiple quantities can be added at once

### CartPage.js
- Displays all items in cart in table format
- Shows price, quantity, and subtotal for each item
- Calculates tax (10%) and total
- Remove button for each item
- "Place Order" button to proceed to confirmation

### OrderConfirmationPage.js
- Generates unique order number (ORD-XXXXXXX)
- Displays order summary with all items
- Shows final total with tax
- Buttons to continue shopping or return home

## How to Run Full Application

### Terminal 1 - Start Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm install
npm start
```

Open browser and navigate to `http://localhost:3000`

## Testing the Application

1. **Landing Page**: Click "Start Shopping"
2. **Menu Page**: Select a category (Pizza, Cold Drinks, or Breads)
3. **Product Listing**: Select quantity and click "Add to Cart"
4. **Shopping Cart**: Review items and click "Place Order"
5. **Order Confirmation**: View order number and summary

## Technologies Used

- **Frontend**: React, React Router, Axios, CSS3
- **Backend**: Express.js, Node.js
- **Storage**: localStorage (frontend), in-memory (backend)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication and order history
- Payment gateway integration
- Admin dashboard for order management
- Kitchen display system (KDS) integration
- Real-time order status tracking
- Email/SMS notifications
