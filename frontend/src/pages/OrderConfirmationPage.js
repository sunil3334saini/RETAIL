import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderConfirmationPage.css';

/**
 * Order Confirmation Page Component
 * - Displays order confirmation after checkout
 * - Shows order number/code
 * - Displays order summary
 * - Option to continue shopping or view order history
 */
function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderNumber] = useState('ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const cart = location.state?.cart || [];

  // Calculate total
  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return {
      subtotal: subtotal.toFixed(2),
      tax: (subtotal * 0.1).toFixed(2),
      total: (subtotal * 1.1).toFixed(2)
    };
  };

  const totals = calculateTotal();

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  return (
    <div className="order-confirmation-page">
      <div className="container confirmation-container">
        <div className="confirmation-box">
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order</p>
          </div>

          <div className="order-details">
            <div className="order-number">
              <p>Order Number:</p>
              <h2>{orderNumber}</h2>
            </div>

            <div className="order-info">
              <p>Your order has been received and will be prepared shortly.</p>
              <p>Please save your order number for reference.</p>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="order-items">
              <h3>Order Summary</h3>
              <table className="confirmation-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal}</span>
                </div>
                <div className="total-row">
                  <span>Tax (10%):</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="total-row total">
                  <span>Total:</span>
                  <span>${totals.total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
