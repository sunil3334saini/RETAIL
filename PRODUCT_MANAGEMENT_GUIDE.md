# Product Management - Code Documentation

## Overview

The Product Management system handles displaying products with prices, quantity selectors, and shopping cart functionality. It's built with clean, readable, and maintainable code using React components and service utilities.

---

## Architecture

### 1. **ProductCard Component** (`components/ProductCard.js`)

A reusable component that displays a single product with all its details and controls.

**Features:**
- Product icon/image display
- Product name and description
- Price display with proper formatting
- Quantity input selector (1-99)
- Add to Cart button with feedback

**Props:**
```javascript
{
  product: {
    id: number,
    name: string,
    price: number,
    description: string
  },
  quantity: number,           // Current selected quantity
  onQuantityChange: function, // Callback for quantity changes
  onAddToCart: function,      // Callback for add to cart
  categoryId: string          // Category ID for icon display
}
```

**Code Example:**
```javascript
<ProductCard
  product={product}
  categoryId={categoryId}
  quantity={quantities[product.id] || 1}
  onQuantityChange={handleQuantityChange}
  onAddToCart={handleAddToCart}
/>
```

---

### 2. **CartService** (`services/CartService.js`)

Utility service for managing cart operations and localStorage persistence.

**Key Methods:**

#### `addToCart(product, quantity)`
Adds a product to the cart. If the product already exists, increases its quantity.
```javascript
// Add 2 pizzas to cart
CartService.addToCart(pizzaProduct, 2);
```

#### `removeFromCart(productId)`
Removes an item completely from the cart.
```javascript
CartService.removeFromCart(101);
```

#### `updateQuantity(productId, newQuantity)`
Updates the quantity of an existing cart item.
```javascript
CartService.updateQuantity(101, 5);
```

#### `getCart()`
Retrieves all items currently in the cart.
```javascript
const cartItems = CartService.getCart();
// Returns: [
//   { id: 101, name: 'Pepperoni', price: 10.99, quantity: 2 },
//   { id: 201, name: 'Cola', price: 2.99, quantity: 1 }
// ]
```

#### `calculateTotals()`
Calculates subtotal, tax (10%), and final total.
```javascript
const totals = CartService.calculateTotals();
// Returns: {
//   subtotal: 24.97,
//   tax: 2.50,
//   total: 27.47,
//   itemCount: 2,
//   totalItems: 3
// }
```

#### `clearCart()`
Empties the entire shopping cart.
```javascript
CartService.clearCart();
```

#### `exportCart()`
Exports cart data for order processing.
```javascript
const orderData = CartService.exportCart();
// Includes: items, totals, timestamp
```

---

### 3. **ProductService** (`services/ProductService.js`)

Service for fetching product and category data from the backend API.

**Key Methods:**

#### `fetchCategories()`
Gets all product categories with caching.
```javascript
const categories = await ProductService.fetchCategories();
// Returns: [
//   { id: 1, name: 'Pizza', description: '...' },
//   { id: 2, name: 'Cold Drinks', description: '...' },
//   ...
// ]
```

#### `fetchProductsByCategory(categoryId)`
Gets all products in a specific category.
```javascript
const products = await ProductService.fetchProductsByCategory(1);
// Returns array of pizza products
```

#### `fetchAllProducts()`
Gets all products across all categories.
```javascript
const allProducts = await ProductService.fetchAllProducts();
```

#### `fetchProductById(productId)`
Gets details for a specific product.
```javascript
const product = await ProductService.fetchProductById(101);
```

---

### 4. **ProductListingPage** (`pages/ProductListingPage.js`)

Main page component for displaying products in a category.

**Features:**
- Fetches products from API using ProductService
- Manages quantity state for each product
- Handles Add to Cart with CartService
- Shows loading, error, and empty states
- Responsive grid layout

**State Management:**
```javascript
const [products, setProducts] = useState([]);      // Fetched products
const [quantities, setQuantities] = useState({});  // Quantity per product
const [loading, setLoading] = useState(true);     // Loading state
const [error, setError] = useState(null);         // Error state
```

**Key Functions:**

```javascript
// Handle quantity change
const handleQuantityChange = (productId, newQuantity) => {
  setQuantities({
    ...quantities,
    [productId]: newQuantity
  });
};

// Handle Add to Cart
const handleAddToCart = (product, quantity) => {
  CartService.addToCart(product, quantity);  // Save to cart
  addToCart(product);                         // Update parent state
  alert(`✓ Added ${quantity} x ${product.name} to cart!`);
};
```

---

## Data Flow Diagram

```
┌──────────────────────────────────┐
│   ProductListingPage Component   │
│  (Manages page state & logic)    │
└──────────┬───────────────────────┘
           │
           ├─→ ProductService.fetchProductsByCategory()
           │      ↓
           │   Backend API (/api/menu/products/:categoryId)
           │      ↓
           │   Get array of products
           │
           ├─→ Render ProductCard components
           │      ↓
           │   ProductCard receives props
           │   (product, quantity, callbacks)
           │
           ├─→ User clicks "Add to Cart"
           │   CartService.addToCart()
           │      ↓
           │   Save to localStorage
           │   (persistent across sessions)
           │
           └─→ Update parent component state
              (cart counter in navbar)
```

---

## Display Product with Quantity Selector

### ProductCard Component
Displays:
- **Product Icon**: Category-specific emoji (🍕 🥤 🍞)
- **Product Name**: Bold, large text
- **Description**: 2-3 line product details
- **Price**: Large red text, formatted to 2 decimals
- **Quantity Input**: Number field (1-99)
- **Add to Cart Button**: Full-width button with hover effects

### CSS Features:
- Responsive grid layout (280px min-width)
- Hover animations (translateY)
- Focus states for accessibility
- Mobile optimization (reduced font sizes)

---

## Display Product Prices

### Implementation:
```javascript
// In ProductCard.js
<span className="product-price">
  ${product.price.toFixed(2)}
</span>
```

### Styling:
```css
.product-price {
  display: block;
  font-size: 1.5rem;
  color: #ff6b6b;          /* Red color */
  font-weight: bold;
  margin-bottom: 1rem;
}
```

### Features:
- Always formatted to 2 decimal places
- Prominent red color for visibility
- Consistent spacing and typography

---

## Implement Add to Cart Functionality

### User Interaction Flow:
1. User selects product quantity (1-99)
2. User clicks "Add to Cart" button
3. Cart updates in real-time
4. Success message displayed
5. Quantity resets to 1 for next selection

### Implementation:
```javascript
const handleAddToCart = (product, quantity) => {
  try {
    // Add to CartService (manages state + localStorage)
    CartService.addToCart(product, quantity);
    
    // Update parent component for UI
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // User feedback
    alert(`✓ Added ${quantity} x ${product.name} to cart!`);
    
    // Reset quantity selector
    setQuantities({
      ...quantities,
      [product.id]: 1
    });
  } catch (err) {
    console.error('Error adding to cart:', err);
    alert('Failed to add item to cart. Please try again.');
  }
};
```

---

## Store Cart Items with Prices

### LocalStorage Structure:
```javascript
// Stored as JSON in localStorage['pizza-cart']
[
  {
    id: 101,
    name: 'Pepperoni',
    price: 10.99,
    quantity: 2
  },
  {
    id: 201,
    name: 'Cola',
    price: 2.99,
    quantity: 1
  }
]
```

### CartService Methods:

**Get Cart:**
```javascript
const cart = CartService.getCart();
// Automatically loads from localStorage
```

**Save Cart:**
```javascript
CartService.saveCart(cart);
// Automatically persists to localStorage
```

**Calculate Totals:**
```javascript
const { subtotal, tax, total } = CartService.calculateTotals();
// subtotal: 24.97
// tax: 2.50 (10%)
// total: 27.47
```

### Persistence Features:
- ✓ Automatically saved to localStorage
- ✓ Survives browser refresh
- ✓ Survives page navigation
- ✓ Error handling for storage quota
- ✓ Automatic recovery from corrupted data

---

## Error Handling

### ProductListingPage Error States:

**Loading State:**
```javascript
if (loading) {
  return <div className="loading-container">Loading products...</div>;
}
```

**Error State:**
```javascript
if (error) {
  return <div className="error-container">⚠️ {error}</div>;
}
```

**Empty State:**
```javascript
if (products.length === 0) {
  return <div className="empty-container">No products found</div>;
}
```

### CartService Error Handling:
- Try-catch blocks for localStorage operations
- Fallback to empty cart if localStorage fails
- Console logging for debugging

---

## Usage Example

### Complete Cart Workflow:

```javascript
// 1. Import services
import CartService from '../services/CartService';
import ProductService from '../services/ProductService';

// 2. Fetch products
const products = await ProductService.fetchProductsByCategory(1);

// 3. User selects quantity and adds to cart
CartService.addToCart(products[0], 2);

// 4. Get current cart
const cart = CartService.getCart();
// Output: [{ id: 101, name: 'Pepperoni', price: 10.99, quantity: 2 }]

// 5. Calculate totals
const totals = CartService.calculateTotals();
// Output: { subtotal: 21.98, tax: 2.20, total: 24.18, ... }

// 6. Export for order
const order = CartService.exportCart();
// Includes all items and totals with timestamp
```

---

## Testing Checklist

- [ ] Products display correctly for each category
- [ ] Prices show in correct format ($X.XX)
- [ ] Quantity selector accepts values 1-99
- [ ] Add to Cart updates cart counter
- [ ] Cart persists on page refresh
- [ ] Cart persists on browser close/reopen
- [ ] Multiple quantities can be added at once
- [ ] Error messages display properly
- [ ] Loading states show during fetch
- [ ] Responsive design works on mobile

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Considerations

- **Caching**: Categories cached in memory
- **Lazy Loading**: Products fetched on demand
- **LocalStorage**: ~5-10MB available for cart data
- **Bundle Size**: All services are tree-shakeable
