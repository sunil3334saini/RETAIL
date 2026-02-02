# Product Management - Developer Cheat Sheet

## Quick Commands

### Start Development
```bash
# Terminal 1 - Backend (Port 5000)
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (Port 3000)
cd frontend
npm install
npm start
```

### Build for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

---

## Import Statements

### Services
```javascript
// Cart Management
import CartService from '../services/CartService';

// API Communication
import ProductService from '../services/ProductService';
```

### Components
```javascript
// Product Card
import ProductCard from '../components/ProductCard';

// Pages
import ProductListingPage from '../pages/ProductListingPage';
```

---

## Common Operations

### Get Cart Data
```javascript
// Get all cart items
CartService.getCart()

// Get cart totals
CartService.calculateTotals()

// Get total items in cart
CartService.getItemCount()

// Get cart as JSON for order
CartService.exportCart()
```

### Manage Cart
```javascript
// Add items
CartService.addToCart(product, 2)

// Update quantity
CartService.updateQuantity(productId, 5)

// Remove item
CartService.removeFromCart(productId)

// Clear entire cart
CartService.clearCart()
```

### Fetch Products
```javascript
// Get categories
await ProductService.fetchCategories()

// Get products by category
await ProductService.fetchProductsByCategory(1)

// Get all products
await ProductService.fetchAllProducts()

// Get specific product
await ProductService.fetchProductById(101)
```

---

## Data Structures

### Product Object
```javascript
{
  id: 101,
  name: "Pepperoni",
  price: 10.99,
  description: "Pizza with pepperoni toppings"
}
```

### Cart Item Object
```javascript
{
  id: 101,
  name: "Pepperoni",
  price: 10.99,
  quantity: 2
}
```

### Totals Object
```javascript
{
  subtotal: 21.98,
  tax: 2.20,
  total: 24.18,
  itemCount: 1,
  totalItems: 2
}
```

### Order Object
```javascript
{
  items: [
    { id: 101, name: "Pepperoni", price: 10.99, quantity: 2 },
    { id: 201, name: "Cola", price: 2.99, quantity: 1 }
  ],
  itemCount: 2,
  totalItems: 3,
  subtotal: 24.97,
  tax: 2.50,
  total: 27.47,
  timestamp: "2022-01-27T10:00:56.789Z"
}
```

---

## Component Props

### ProductCard
```javascript
<ProductCard
  product={{
    id: 101,
    name: "Pepperoni",
    price: 10.99,
    description: "..."
  }}
  categoryId="1"                              // For icon
  quantity={1}                                // Current qty
  onQuantityChange={(id, qty) => {}}         // Qty callback
  onAddToCart={(product, qty) => {}}         // Add callback
/>
```

---

## Styling Classes

### Product Card
```css
.product-card              /* Main container */
.product-image             /* Icon display */
.product-name              /* Product name */
.product-description       /* Description */
.product-price             /* Price display */
.product-controls          /* Qty + button */
.quantity-input            /* Number input */
.add-to-cart-btn           /* Add button */
```

### Product Listing Page
```css
.product-listing-page      /* Main page */
.products-grid             /* Grid layout */
.loading-container         /* Loading state */
.error-container           /* Error state */
.empty-container           /* Empty state */
```

---

## Browser Console Debugging

### Check Cart
```javascript
// View cart contents
CartService.getCart()

// View cart totals
CartService.calculateTotals()

// View raw localStorage
localStorage.getItem('pizza-cart')

// Parse localStorage
JSON.parse(localStorage.getItem('pizza-cart'))
```

### Clear Cache
```javascript
// Clear categories cache
ProductService.clearCache()

// Clear entire cart
CartService.clearCart()

// Clear localStorage
localStorage.removeItem('pizza-cart')
```

### Test Add to Cart
```javascript
const product = { id: 999, name: 'Test', price: 5.99 };
CartService.addToCart(product, 3);
CartService.getCart();
```

---

## API Endpoints

### Menu API
```
GET /api/menu/categories
GET /api/menu/products/:categoryId
GET /api/menu/products
GET /api/menu/product/:productId
```

### Testing Endpoints
```bash
# Get all categories
curl http://localhost:5000/api/menu/categories

# Get Pizza products
curl http://localhost:5000/api/menu/products/1

# Get specific product
curl http://localhost:5000/api/menu/product/101

# Health check
curl http://localhost:5000/api/health
```

---

## Error Messages

### Common Errors
```
"Failed to fetch categories. Please try again later."
"Failed to fetch products. Please try again later."
"Failed to fetch product details. Please try again later."
"Invalid product"
"Invalid quantity. Please enter between 1 and 99."
"Failed to add item to cart. Please try again."
```

### Debugging
```javascript
// Enable verbose logging
console.log('Debug:', variable)

// Check if product is valid
if (product && product.id) {
  // Valid
}

// Check localStorage available
if (typeof(Storage) !== "undefined") {
  // localStorage available
}
```

---

## File Locations

### Core Files
- `frontend/src/components/ProductCard.js` - Product display
- `frontend/src/services/CartService.js` - Cart logic
- `frontend/src/services/ProductService.js` - API calls
- `frontend/src/pages/ProductListingPage.js` - Product page
- `backend/routes/menu.js` - Backend API

### CSS Files
- `frontend/src/components/ProductCard.css` - Card styling
- `frontend/src/pages/ProductListingPage.css` - Page styling
- `frontend/src/App.css` - Global styles

### Documentation
- `PRODUCT_MANAGEMENT_GUIDE.md` - Full documentation
- `PRODUCT_MANAGEMENT_QUICK_REFERENCE.md` - Quick ref
- `PRODUCT_MANAGEMENT_EXAMPLES.md` - Code examples
- `PRODUCT_MANAGEMENT_IMPLEMENTATION_SUMMARY.md` - Summary

---

## Performance Tips

### Optimize Rendering
```javascript
// Memoize ProductCard
export default React.memo(ProductCard);

// Use useCallback for callbacks
const handleAddToCart = useCallback((product, qty) => {
  CartService.addToCart(product, qty);
}, []);
```

### Optimize Storage
```javascript
// Don't store entire objects in state
// Let CartService handle storage
// Query via CartService.getCart()
```

### Optimize API
```javascript
// Categories are cached automatically
const categories = await ProductService.fetchCategories();
// Same call won't hit API twice
```

---

## Testing Scenarios

### Scenario 1: Add Single Item
```javascript
1. Navigate to category
2. Select quantity: 1
3. Click "Add to Cart"
4. Verify success message
5. Check CartService.getCart() has item
```

### Scenario 2: Add Multiple Items
```javascript
1. Navigate to category
2. Select product quantity: 3
3. Click "Add to Cart"
4. Quantity should show 3 in cart
5. Total should calculate correctly
```

### Scenario 3: Cart Persistence
```javascript
1. Add items to cart
2. Refresh browser
3. Cart items should still be there
4. Totals should be same
```

### Scenario 4: Error Handling
```javascript
1. Turn off backend server
2. Try to load products
3. Error message should display
4. Should not crash app
```

---

## Key Constants

### Cart Storage Key
```javascript
'pizza-cart'  // localStorage key
```

### Tax Rate
```javascript
0.10  // 10% tax
```

### Quantity Limits
```javascript
min: 1      // Minimum quantity
max: 99     // Maximum quantity
```

### API Base URL
```javascript
'http://localhost:5000/api'  // Development
```

---

## CSS Variables (for Future Use)

```css
:root {
  --primary-color: #ff6b6b;     /* Red */
  --text-primary: #333;          /* Dark */
  --text-secondary: #666;        /* Gray */
  --border-color: #ddd;          /* Light */
  --success-color: #4caf50;      /* Green */
  --error-color: #d32f2f;        /* Red */
  
  --border-radius: 8px;
  --transition-speed: 0.3s;
  --shadow-small: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-large: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Quick Fixes

### Cart Not Persisting
```javascript
// Clear and reset
localStorage.clear()
location.reload()
```

### Products Not Loading
```javascript
// Check backend is running
curl http://localhost:5000/api/health

// Check categories cache
ProductService.clearCache()
```

### Quantity Not Updating
```javascript
// Verify quantity handler
const newQty = parseInt(value)
if (newQty > 0 && newQty <= 99) {
  setQuantities({ ...quantities, [id]: newQty })
}
```

### Price Not Displaying
```javascript
// Verify price format
const formatted = price.toFixed(2)  // Must have 2 decimals
```

---

## Useful Links

### Documentation
- [React Documentation](https://react.dev)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Axios Documentation](https://axios-http.com)

### Tools
- Browser DevTools (F12)
- Local Storage Inspector
- Network Tab for API debugging
- React DevTools Extension

---

## Version Information

- React: 18.2.0
- Express: 4.18.2
- Node: 14.x or higher
- npm: 6.x or higher

---

## Support & Troubleshooting

**Backend not running?**
```bash
cd backend
npm install
npm run dev
```

**Frontend not starting?**
```bash
cd frontend
npm install
npm start
```

**Port already in use?**
```bash
# Change port in .env or package.json
# Or kill process using port:
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000    # Windows
```

**Clear everything and restart?**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```
