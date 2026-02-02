import React from 'react';
import './ProductCard.css';

/**
 * ProductCard Component
 * 
 * Displays a single product with:
 * - Product image/icon
 * - Product name and description
 * - Price display
 * - Quantity input selector
 * - Add to Cart button
 * 
 * Props:
 *   - product: Object containing id, name, price, description
 *   - quantity: Current selected quantity
 *   - onQuantityChange: Callback when quantity changes
 *   - onAddToCart: Callback when Add to Cart is clicked
 */
function ProductCard({ product, quantity, onQuantityChange, onAddToCart, categoryId }) {
  // Get category icon based on category ID
  const getCategoryIcon = () => {
    switch(categoryId) {
      case '1': return '🍕';
      case '2': return '🥤';
      case '3': return '🍞';
      default: return '📦';
    }
  };

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      onQuantityChange(product.id, value);
    }
  };

  // Handle Add to Cart click
  const handleAddClick = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="product-card">
      {/* Product Icon/Image */}
      <div className="product-image">
        {getCategoryIcon()}
      </div>

      {/* Product Name */}
      <h3 className="product-name">{product.name}</h3>

      {/* Product Description */}
      <p className="product-description">{product.description}</p>

      {/* Product Footer - Price and Actions */}
      <div className="product-footer">
        {/* Display Price */}
        <span className="product-price">${product.price.toFixed(2)}</span>

        {/* Quantity and Add to Cart Controls */}
        <div className="product-controls">
          {/* Quantity Input */}
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
            aria-label="Product quantity"
            title="Enter quantity (1-99)"
          />

          {/* Add to Cart Button */}
          <button
            className="btn btn-primary add-to-cart-btn"
            onClick={handleAddClick}
            title={`Add ${quantity} x ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
