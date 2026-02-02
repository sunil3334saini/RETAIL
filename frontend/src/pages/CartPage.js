import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

/**
 * Cart Page Component
 * - Displays all items in the shopping cart
 * - Shows item details (name, price, quantity, total)
 * - Calculates cart total
 * - Allows removing items
 * - Proceed to checkout
 */
function CartPage({ cart, removeFromCart }) {
  const navigate = useNavigate();

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add items before placing an order.');
      return;
    }
    // Redirect to order confirmation page
    navigate('/confirmation', { state: { cart } });
  };

  const total = calculateTotal();

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-secondary remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(parseFloat(total) * 1.1).toFixed(2)}</span>
              </div>

              <button className="btn btn-primary order-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
              
              <button className="btn btn-secondary continue-btn" onClick={() => navigate('/menu')}>
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
