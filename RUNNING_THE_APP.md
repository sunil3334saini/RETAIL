# Pizza & Breads Ordering Portal - Setup & Run Guide

## Project Structure
```
Retail/
├── package.json              # Root package.json (manages both frontend & backend)
├── frontend/                 # React.js Frontend
│   ├── package.json
│   ├── public/
│   └── src/
├── backend/                  # Express.js Backend
│   ├── package.json
│   ├── server.js
│   └── routes/
└── [Documentation files]
```

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

### Option 1: Automatic Installation (Recommended)
```bash
cd C:\Retail
npm run install:all
```

### Option 2: Manual Installation
```bash
# Root dependencies
cd C:\Retail
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

## Running the Application

### Start Both Frontend & Backend (Production)
```bash
npm start
```
This will:
- Start the Express backend on http://localhost:5000
- Start the React frontend on http://localhost:3000

### Development Mode (With Hot Reload)
```bash
# Terminal 1 - Start Backend with nodemon
cd backend
npm run dev

# Terminal 2 - Start Frontend with hot reload
cd frontend
npm start
```

### Start Only Frontend
```bash
npm run dev:frontend
```
Frontend will run on: http://localhost:3000

### Start Only Backend
```bash
npm run dev:backend
```
Backend will run on: http://localhost:5000

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start both backend and frontend concurrently |
| `npm run start:frontend` | Start only the React frontend |
| `npm run start:backend` | Start only the Express backend |
| `npm run dev:frontend` | Start frontend with hot reload |
| `npm run dev:backend` | Start backend with nodemon (auto-restart) |
| `npm run install:all` | Install dependencies for all directories |
| `npm run build` | Build React frontend for production |
| `npm test` | Run frontend tests |

## Accessing the Application

Once running:
- **Frontend (User Interface):** http://localhost:3000
- **Backend (API Server):** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## API Endpoints

### Menu Routes
- `GET /api/menu/categories` - Get all product categories
- `GET /api/menu/products/:categoryId` - Get products by category
- `GET /api/menu/products` - Get all products
- `GET /api/menu/product/:productId` - Get specific product

### Orders Routes
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get specific order
- `PUT /api/orders/:orderId/status` - Update order status
- `DELETE /api/orders/:orderId` - Delete order

### Kitchen Routes
- `POST /api/kitchen/send-order` - Send order to kitchen
- `GET /api/kitchen/orders` - Get all kitchen orders
- `GET /api/kitchen/orders/:orderNumber` - Get kitchen order status
- `PUT /api/kitchen/orders/:orderNumber/status` - Update kitchen order status
- `PUT /api/kitchen/orders/:orderNumber/assign` - Assign order to staff

### Cart Routes
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/:productId` - Remove item from cart

## Features Implemented

✅ **Core Pages & Navigation** - Landing, Menu, Product Listing, Cart, Confirmation  
✅ **Product Management** - Display products with quantity selector and prices  
✅ **Cart Features** - Display items, calculate totals, place order  
✅ **Order Processing** - Unique order numbers and codes, order confirmation  
✅ **User Features** - Authentication, user-specific order history, order search  
✅ **Kitchen Integration** - Real-time order distribution and status tracking  
✅ **Additional Features** - Three product categories, carryout/dine-in options, verification codes  

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- Change the port in frontend: `PORT=3001 npm start:frontend`
- Change the port in backend: Modify `server.js` PORT variable

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -r node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Frontend Can't Connect to Backend
- Ensure backend is running on http://localhost:5000
- Check CORS is enabled in backend (already configured)
- Verify API_BASE_URL in frontend is correct

### npm start fails with ENOENT
You've fixed this! The root package.json now handles both frontend and backend.

## Environment Variables

Currently, the application uses hardcoded values. For production:
- Create `.env` files in frontend/ and backend/ directories
- Update API endpoints and configuration as needed

## Production Build

```bash
# Build frontend
npm run build

# Output: frontend/build/ directory ready for deployment
```

## Notes

- All data is stored in localStorage (frontend) and in-memory (backend)
- For production, integrate a real database (MongoDB, PostgreSQL, etc.)
- Currently using basic authentication without password hashing
- Implement HTTPS for production deployment
