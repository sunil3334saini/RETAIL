import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import OrderService from '../services/OrderService';
import OrderStatusTracker from '../components/OrderStatusTracker';
import './OrderHistoryPage.css';

/**
 * Order History Page Component
 * - Display user's orders (authenticated users only)
 * - Search orders by order number or date
 * - Show order details, items, totals
 */
function OrderHistoryPage() {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      const userOrders = OrderService.getUserOrders();
      setOrders(userOrders.reverse());
      setFilteredOrders(userOrders.reverse());
      setLoading(false);
    };
    fetchOrders();
  }, [currentUser, navigate]);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const results = OrderService.searchOrders(query, true);
      setFilteredOrders(results.reverse());
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="order-history-page"><p>Loading orders...</p></div>;
  }

  return (
    <div className="order-history-page">
      <div className="container history-container">
        <div className="history-header">
          <div>
            <h1>Order History</h1>
            <p>Welcome, {currentUser.name}!</p>
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order number or date..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="btn-clear"
              onClick={() => {
                setSearchQuery('');
                setFilteredOrders(orders);
              }}
            >
              Clear
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-history">
            <p>{searchQuery ? 'No orders found matching your search.' : 'No orders yet'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
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
                    <OrderStatusTracker orderNumber={order.orderNumber} />

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
