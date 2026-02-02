import React, { useState, useEffect } from 'react';
import KitchenService from '../services/KitchenService';
import './KitchenDashboard.css';

/**
 * Kitchen Dashboard Component
 * - View all pending orders
 * - Update order status
 * - Assign orders to staff
 * - Track preparation progress
 */
function KitchenDashboard() {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffName, setStaffName] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await KitchenService.getAllKitchenOrders();
      setKitchenOrders(orders);
      setLoading(false);
    };

    fetchOrders();

    // Refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderNumber, newStatus) => {
    try {
      const result = await KitchenService.updateOrderStatus(orderNumber, newStatus);
      if (result.success) {
        setKitchenOrders(kitchenOrders.map(o =>
          o.orderNumber === orderNumber ? result.order : o
        ));
      }
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const handleAssignOrder = async (orderNumber) => {
    if (!staffName.trim()) {
      alert('Please enter staff name');
      return;
    }

    try {
      const result = await KitchenService.assignOrderToStaff(orderNumber, staffName);
      if (result.success) {
        setKitchenOrders(kitchenOrders.map(o =>
          o.orderNumber === orderNumber ? result.order : o
        ));
        setStaffName('');
      }
    } catch (error) {
      alert('Error assigning order: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'preparing':
        return '#17a2b8';
      case 'ready':
        return '#28a745';
      case 'completed':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const pendingOrders = kitchenOrders.filter(o => o.status === 'pending');
  const preparingOrders = kitchenOrders.filter(o => o.status === 'preparing');
  const readyOrders = kitchenOrders.filter(o => o.status === 'ready');

  if (loading) {
    return <div className="kitchen-dashboard"><p>Loading orders...</p></div>;
  }

  return (
    <div className="kitchen-dashboard">
      <div className="kitchen-header">
        <h1>🍕 Kitchen Dashboard</h1>
        <div className="order-summary">
          <div className="summary-card pending">
            <h3>{pendingOrders.length}</h3>
            <p>Pending</p>
          </div>
          <div className="summary-card preparing">
            <h3>{preparingOrders.length}</h3>
            <p>Preparing</p>
          </div>
          <div className="summary-card ready">
            <h3>{readyOrders.length}</h3>
            <p>Ready</p>
          </div>
        </div>
      </div>

      <div className="kitchen-board">
        {pendingOrders.length > 0 && (
          <div className="order-column">
            <h2>Pending</h2>
            <div className="orders-container">
              {pendingOrders.map((order) => (
                <div key={order.orderNumber} className="kitchen-order-card">
                  <div className="order-header">
                    <h3>{order.orderNumber}</h3>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="item">
                        <span>{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-actions">
                    <input
                      type="text"
                      placeholder="Staff name"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="staff-input"
                    />
                    <button
                      className="btn btn-assign"
                      onClick={() => handleAssignOrder(order.orderNumber)}
                    >
                      Assign
                    </button>
                    <button
                      className="btn btn-start"
                      onClick={() => handleStatusChange(order.orderNumber, 'preparing')}
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {preparingOrders.length > 0 && (
          <div className="order-column">
            <h2>Preparing</h2>
            <div className="orders-container">
              {preparingOrders.map((order) => (
                <div key={order.orderNumber} className="kitchen-order-card">
                  <div className="order-header">
                    <h3>{order.orderNumber}</h3>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="item">
                        <span>{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {order.assignedTo && (
                    <p className="assigned">👨‍🍳 {order.assignedTo}</p>
                  )}

                  <button
                    className="btn btn-ready"
                    onClick={() => handleStatusChange(order.orderNumber, 'ready')}
                  >
                    Mark Ready
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {readyOrders.length > 0 && (
          <div className="order-column">
            <h2>Ready</h2>
            <div className="orders-container">
              {readyOrders.map((order) => (
                <div key={order.orderNumber} className="kitchen-order-card ready">
                  <div className="order-header">
                    <h3>{order.orderNumber}</h3>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="item">
                        <span>{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-complete"
                    onClick={() => handleStatusChange(order.orderNumber, 'completed')}
                  >
                    Completed
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {kitchenOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders in kitchen</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default KitchenDashboard;
