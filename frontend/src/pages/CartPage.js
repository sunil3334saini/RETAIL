import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';
import './CartPage.css';

/**
 * Cart Page Component
 * Displays shopping cart with:
 * - Items in cart with prices
 * - Quantity for each item
 * - Subtotal, tax, and total calculation
 * - Remove item functionality
 * - Place order button
 */
function CartPage({ cart, removeFromCart }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(cart);

  // Update cart when prop changes
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Calculate totals using CartService
  const getTotals = () => {
    const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = itemsTotal * 0.1;
    return {
      subtotal: itemsTotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (itemsTotal + tax).toFixed(2)
    };
  };

  // Handle remove from cart
  const handleRemove = (productId) => {
    removeFromCart(productId);
    CartService.removeFromCart(productId);
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty. Please add items before placing an order.');
      return;
    }
    navigate('/confirmation', { state: { cartItems } });
  };

  const totals = getTotals();

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items Table */}
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="product-name">{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td className="quantity-col">{item.quantity}</td>
                      <td className="subtotal-col">${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${totals.subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>${totals.tax}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${totals.total}</span>
              </div>

              <button 
                className="btn btn-primary btn-full"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
              
              <button 
                className="btn btn-secondary btn-full"
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
