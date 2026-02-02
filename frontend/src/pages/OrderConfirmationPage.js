import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderService from '../services/OrderService';
import OrderStatusTracker from '../components/OrderStatusTracker';
import './OrderConfirmationPage.css';

/**
 * Order Confirmation Page Component
 * - Displays order confirmation with unique order number
 * - Shows order summary and totals
 * - Saves order to database and localStorage
 * - Provides navigation options
 */
function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      if (cartItems.length > 0) {
        const newOrder = await OrderService.createOrder(cartItems);
        setOrder(newOrder);
      }
      setLoading(false);
    };
    saveOrder();
  }, [cartItems]);

  if (loading) {
    return <div className="order-confirmation-page"><p>Processing order...</p></div>;
  }

  if (!order || !cartItems.length) {
    return (
      <div className="order-confirmation-page">
        <div className="container confirmation-container">
          <div className="confirmation-box">
            <p>No order data available.</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <h2>{order.orderNumber}</h2>
            </div>

            <div className="order-info">
              <p>Your order has been received and will be prepared shortly.</p>
              <p className="info-small">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="info-small">Status: <span className="status-badge">{order.status}</span></p>
            </div>
          </div>

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
                {cartItems.map((item) => (
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
                <span>${order.totals.subtotal}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>${order.totals.tax}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${order.totals.total}</span>
              </div>
            </div>
          </div>

          <OrderStatusTracker orderNumber={order.orderNumber} />

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Continue Shopping
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/order-history')}>
              View Order History
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
