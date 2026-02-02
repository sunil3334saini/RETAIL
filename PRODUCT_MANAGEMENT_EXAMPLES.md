# Product Management - Code Examples

## Table of Contents
1. [Display Products](#display-products)
2. [Quantity Selector](#quantity-selector)
3. [Price Display](#price-display)
4. [Add to Cart](#add-to-cart)
5. [Cart Storage](#cart-storage)

---

## Display Products

### Basic Product Display
```javascript
import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';

function ProductList({ categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.fetchProductsByCategory(categoryId);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span>${product.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
```

### Using ProductCard Component
```javascript
import ProductCard from '../components/ProductCard';

// In your render:
{products.map(product => (
  <ProductCard
    key={product.id}
    product={product}
    categoryId={categoryId}
    quantity={quantities[product.id] || 1}
    onQuantityChange={handleQuantityChange}
    onAddToCart={handleAddToCart}
  />
))}
```

### Display Products with Images/Icons
```javascript
function ProductWithImage({ product, categoryId }) {
  const getCategoryIcon = (id) => {
    switch(id) {
      case '1': return '🍕';
      case '2': return '🥤';
      case '3': return '🍞';
      default: return '📦';
    }
  };

  return (
    <div className="product">
      <div className="product-icon">
        {getCategoryIcon(categoryId)}
      </div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </div>
  );
}
```

---

## Quantity Selector

### Simple Quantity Input
```javascript
function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      className="quantity-input"
    />
  );
}
```

### Quantity with Plus/Minus Buttons
```javascript
function QuantityWithButtons({ value, onChange, min = 1, max = 99 }) {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="quantity-controls">
      <button onClick={handleDecrement}>−</button>
      <input
        type="number"
        value={value}
        readOnly
        className="quantity-display"
      />
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
```

### Quantity State Management
```javascript
// In ProductListingPage
const [quantities, setQuantities] = useState({});

const handleQuantityChange = (productId, newQuantity) => {
  setQuantities(prev => ({
    ...prev,
    [productId]: newQuantity
  }));
};

const getQuantity = (productId) => {
  return quantities[productId] || 1;
};
```

---

## Price Display

### Basic Price Display
```javascript
function ProductPrice({ price }) {
  return (
    <div className="price">
      ${price.toFixed(2)}
    </div>
  );
}
```

### Price with Currency Symbol
```javascript
function PriceDisplay({ price, currency = 'USD' }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });

  return <span>{formatter.format(price)}</span>;
}

// Usage:
<PriceDisplay price={19.99} currency="USD" />
// Output: $19.99
```

### Price with Quantity Calculation
```javascript
function PriceWithQuantity({ price, quantity }) {
  const subtotal = price * quantity;

  return (
    <div className="price-info">
      <span>Unit: ${price.toFixed(2)}</span>
      <span>×{quantity}</span>
      <span className="total">${subtotal.toFixed(2)}</span>
    </div>
  );
}
```

### Bulk Price Discount Display
```javascript
function PriceWithDiscount({ price, quantity, bulkDiscount = 0.1 }) {
  let finalPrice = price;
  let discount = 0;

  if (quantity >= 5) {
    discount = price * bulkDiscount;
    finalPrice = price - discount;
  }

  return (
    <div className="price-display">
      {discount > 0 && (
        <span className="original">
          ${price.toFixed(2)}
        </span>
      )}
      <span className="final">
        ${finalPrice.toFixed(2)}
      </span>
      {discount > 0 && (
        <span className="savings">
          Save ${discount.toFixed(2)}
        </span>
      )}
    </div>
  );
}
```

---

## Add to Cart

### Simple Add to Cart
```javascript
function AddToCartButton({ product, quantity }) {
  const handleAddToCart = () => {
    CartService.addToCart(product, quantity);
    alert(`Added ${quantity} x ${product.name} to cart`);
  };

  return (
    <button onClick={handleAddToCart} className="btn btn-primary">
      Add to Cart
    </button>
  );
}
```

### Add to Cart with Validation
```javascript
function AddToCartWithValidation({ product, quantity, onSuccess }) {
  const handleAddToCart = async () => {
    // Validate product
    if (!product || !product.id) {
      alert('Invalid product');
      return;
    }

    // Validate quantity
    if (quantity <= 0 || quantity > 99) {
      alert('Invalid quantity. Please enter between 1 and 99.');
      return;
    }

    try {
      // Add to cart
      CartService.addToCart(product, quantity);
      
      // Show success
      alert(`✓ Added ${quantity} x ${product.name} to cart!`);
      
      // Call callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert('Failed to add item. Please try again.');
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!product || quantity <= 0}
      className="btn btn-primary"
    >
      Add to Cart
    </button>
  );
}
```

### Add to Cart with Loading State
```javascript
function AddToCartButton({ product, quantity }) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Simulate API call if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      CartService.addToCart(product, quantity);
      alert(`Added ${quantity} x ${product.name} to cart!`);
    } catch (error) {
      alert('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Multiple Items Add to Cart
```javascript
function BulkAddToCart({ products, quantities }) {
  const handleAddMultiple = () => {
    let successCount = 0;

    products.forEach(product => {
      const quantity = quantities[product.id] || 1;
      CartService.addToCart(product, quantity);
      successCount++;
    });

    alert(`Added ${successCount} different items to cart!`);
  };

  return (
    <button onClick={handleAddMultiple} className="btn btn-primary">
      Add All to Cart
    </button>
  );
}
```

---

## Cart Storage

### Save Cart to LocalStorage
```javascript
// CartService.addToCart() automatically saves
function saveCart(items) {
  try {
    const cartJSON = JSON.stringify(items);
    localStorage.setItem('pizza-cart', cartJSON);
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}
```

### Load Cart from LocalStorage
```javascript
function loadCart() {
  try {
    const cartJSON = localStorage.getItem('pizza-cart');
    return cartJSON ? JSON.parse(cartJSON) : [];
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
}
```

### Clear Cart from LocalStorage
```javascript
function clearStoredCart() {
  try {
    localStorage.removeItem('pizza-cart');
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}
```

### Get Cart Summary
```javascript
function getCartSummary() {
  const cart = CartService.getCart();
  const { subtotal, tax, total } = CartService.calculateTotals();

  return {
    items: cart.length,
    itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  };
}

// Usage:
const summary = getCartSummary();
console.log(`Cart has ${summary.items} products, Total: $${summary.total}`);
```

### Persist Cart Across Sessions
```javascript
function usePersistentCart() {
  const [cart, setCart] = useState(() => {
    // Load from localStorage on first render
    return CartService.getCart();
  });

  useEffect(() => {
    // Save to localStorage whenever cart changes
    CartService.saveCart(cart);
  }, [cart]);

  return [cart, setCart];
}

// Usage in component:
function MyComponent() {
  const [cart, setCart] = usePersistentCart();
  // cart will persist across page refreshes
}
```

### Export Cart for Order
```javascript
function prepareOrderData() {
  const cartData = CartService.exportCart();

  const order = {
    orderNumber: `ORD-${Date.now()}`,
    items: cartData.items,
    subtotal: cartData.subtotal,
    tax: cartData.tax,
    total: cartData.total,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  return order;
}

// Usage:
const order = prepareOrderData();
console.log(order);
// {
//   orderNumber: 'ORD-1643298456789',
//   items: [...],
//   subtotal: 24.97,
//   tax: 2.50,
//   total: 27.47,
//   timestamp: '2022-01-27T10:00:56.789Z',
//   status: 'pending'
// }
```

---

## Complete Example: Full Product with Add to Cart

```javascript
import React, { useState } from 'react';
import CartService from '../services/CartService';
import './Product.css';

function Product({ product, categoryId }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const getCategoryIcon = () => {
    switch(categoryId) {
      case '1': return '🍕';
      case '2': return '🥤';
      case '3': return '🍞';
      default: return '📦';
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      CartService.addToCart(product, quantity);
      alert(`✓ Added ${quantity} x ${product.name} to cart!`);
      setQuantity(1);
    } catch (error) {
      alert('Failed to add to cart');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      {/* Product Image/Icon */}
      <div className="product-image">
        {getCategoryIcon()}
      </div>

      {/* Product Name & Description */}
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>

      {/* Price Display */}
      <div className="product-price">
        ${product.price.toFixed(2)}
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="product-controls">
        <input
          type="number"
          min="1"
          max="99"
          value={quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
          disabled={loading}
        />
        
        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default Product;
```

---

## CSS Styling Examples

### Product Card Styling
```css
.product-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 1rem;
}

.product-controls {
  display: flex;
  gap: 0.5rem;
}

.quantity-input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-primary {
  background-color: #ff6b6b;
  color: white;
}

.btn-primary:hover {
  background-color: #ff5252;
}
```
