# Product Management - Quick Reference

## Quick Links

- **ProductCard Component**: `frontend/src/components/ProductCard.js` - Reusable product display component
- **CartService**: `frontend/src/services/CartService.js` - Cart state management
- **ProductService**: `frontend/src/services/ProductService.js` - API communication
- **ProductListingPage**: `frontend/src/pages/ProductListingPage.js` - Product listing container

---

## Component Structure

```
ProductListingPage
├── Fetches products from backend
├── Manages quantities state
└── Renders ProductCard components
    ├── Product image/icon
    ├── Product name & description
    ├── Price display
    ├── Quantity input
    └── Add to Cart button
```

---

## Common Tasks

### Display a Product
```javascript
<ProductCard
  product={{ id: 101, name: 'Pepperoni', price: 10.99, description: '...' }}
  categoryId="1"
  quantity={1}
  onQuantityChange={(id, qty) => console.log(id, qty)}
  onAddToCart={(product, qty) => console.log('Added', qty, 'items')}
/>
```

### Add Items to Cart
```javascript
import CartService from '../services/CartService';

// Add 2 items
CartService.addToCart(product, 2);

// Get updated cart
const cart = CartService.getCart();
```

### Get Cart Total
```javascript
const { subtotal, tax, total } = CartService.calculateTotals();
console.log(`Total: $${total}`);
```

### Fetch Products by Category
```javascript
import ProductService from '../services/ProductService';

const products = await ProductService.fetchProductsByCategory(1);
console.log(`Found ${products.length} products`);
```

### Clear Cart
```javascript
CartService.clearCart();
```

---

## API Endpoints

### Menu Routes
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/products/:categoryId` - Get products by category  
- `GET /api/menu/products` - Get all products
- `GET /api/menu/product/:productId` - Get specific product

### Example Requests
```javascript
// Fetch categories
GET http://localhost:5000/api/menu/categories

// Fetch Pizza products (categoryId = 1)
GET http://localhost:5000/api/menu/products/1

// Fetch specific product
GET http://localhost:5000/api/menu/product/101
```

---

## CSS Classes

### ProductCard
- `.product-card` - Main container
- `.product-image` - Icon/image display
- `.product-name` - Product name
- `.product-description` - Description text
- `.product-price` - Price display
- `.product-controls` - Quantity + button container
- `.quantity-input` - Number input
- `.add-to-cart-btn` - Add to cart button

### ProductListingPage
- `.product-listing-page` - Main page container
- `.products-grid` - Grid layout
- `.loading-container` - Loading state
- `.error-container` - Error state
- `.empty-container` - Empty state

---

## State Management

### ProductListingPage State
```javascript
const [products, setProducts] = useState([]);        // Fetched products
const [quantities, setQuantities] = useState({});    // Qty per product
const [loading, setLoading] = useState(true);       // Loading state
const [error, setError] = useState(null);           // Error message
```

### CartService State (localStorage)
```javascript
// Stored in localStorage['pizza-cart']
// Format: JSON stringified array of cart items
[
  { id: 101, name: 'Pepperoni', price: 10.99, quantity: 2 },
  { id: 201, name: 'Cola', price: 2.99, quantity: 1 }
]
```

---

## Props Flow

```
ProductListingPage
    ↓
<ProductCard
    product={item}              ← Product data
    quantity={qty}              ← Current quantity
    onQuantityChange={handler}  ← Update quantity
    onAddToCart={handler}       ← Add to cart
/>
```

---

## Error Handling

### ProductService
- Network errors → "Failed to fetch..."
- Invalid category → 404 error
- Missing product ID → "Product ID is required"

### CartService
- localStorage quota exceeded → Logged but doesn't crash
- Corrupted data → Recovers with empty cart

---

## Performance Tips

1. **Quantity Selector**: Debounce input changes for large lists
2. **Image Loading**: Consider lazy loading for product images
3. **Cart Storage**: Clear old carts periodically (older than X days)
4. **API Calls**: Cache categories to reduce API calls
5. **Rendering**: Use React.memo for ProductCard if list is large

```javascript
// Memoize ProductCard to prevent re-renders
export default React.memo(ProductCard);
```

---

## Accessibility Features

- ✓ Semantic HTML (button, input, labels)
- ✓ ARIA labels on inputs
- ✓ Focus states on interactive elements
- ✓ Color contrast meets WCAG AA
- ✓ Keyboard navigation support
- ✓ Screen reader friendly

---

## Testing Examples

```javascript
// Test adding to cart
test('should add product to cart', () => {
  const product = { id: 101, name: 'Pepperoni', price: 10.99 };
  CartService.addToCart(product, 2);
  const cart = CartService.getCart();
  expect(cart).toContainEqual(expect.objectContaining({ id: 101, quantity: 2 }));
});

// Test quantity selector
test('should update quantity', () => {
  const setQty = jest.fn();
  render(<ProductCard quantity={1} onQuantityChange={setQty} />);
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '5' } });
  expect(setQty).toHaveBeenCalledWith(expect.any(Number), 5);
});

// Test calculate totals
test('should calculate totals with tax', () => {
  CartService.addToCart({ id: 1, price: 10.00 }, 1);
  const { subtotal, tax, total } = CartService.calculateTotals();
  expect(subtotal).toBe(10.00);
  expect(tax).toBe(1.00);
  expect(total).toBe(11.00);
});
```

---

## Debugging Tips

### Check Cart Contents
```javascript
// In browser console
const cart = CartService.getCart();
console.table(cart);
```

### Check LocalStorage
```javascript
// In browser console
const stored = localStorage.getItem('pizza-cart');
console.log(JSON.parse(stored));
```

### Clear Cart
```javascript
// In browser console
CartService.clearCart();
console.log('Cart cleared!');
```

### Monitor State Changes
```javascript
// Add to ProductListingPage
useEffect(() => {
  console.log('Products updated:', products);
  console.log('Quantities:', quantities);
}, [products, quantities]);
```

---

## Future Enhancements

- [ ] Product search/filter
- [ ] Product variants (size, toppings)
- [ ] Wishlist feature
- [ ] Product ratings/reviews
- [ ] Stock availability indicator
- [ ] Out of stock handling
- [ ] Seasonal products
- [ ] Special offers/discounts
- [ ] Recommended products
- [ ] Product image gallery
