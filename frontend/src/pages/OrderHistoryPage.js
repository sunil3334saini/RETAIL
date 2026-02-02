import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './OrderHistoryPage.css';

/**
 * Order History Page Component
 * - Displays all previous orders
 * - Shows order details, dates, and status
 * - Allows viewing order details
 */
function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await OrderService.getAllOrders();
      setOrders(allOrders.reverse());
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  if (loading) {
    return <div className="order-history-page"><p>Loading orders...</p></div>;
  }

  return (
    <div className="order-history-page">
      <div className="container history-container">
        <h1>Order History</h1>

        {orders.length === 0 ? (
          <div className="empty-history">
            <p>No orders found</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header" onClick={() => handleOrderClick(order)}>
                  <div className="order-card-info">
                    <h3>{order.orderNumber}</h3>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="order-card-summary">
                    <span className={`status ${order.status}`}>{order.status}</span>
                    <span className="total">${order.totals.total}</span>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="order-card-details">
                    <div className="items-section">
                      <h4>Items</h4>
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="totals-section">
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>${order.totals.subtotal}</span>
                      </div>
                      <div className="total-row">
                        <span>Tax:</span>
                        <span>${order.totals.tax}</span>
                      </div>
                      <div className="total-row total">
                        <span>Total:</span>
                        <span>${order.totals.total}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-secondary" onClick={() => navigate('/menu')}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
