import React, { useState, useEffect } from 'react';
import KitchenService from '../services/KitchenService';
import './OrderStatusTracker.css';

/**
 * Order Status Tracker Component
 * - Shows real-time order status from kitchen
 * - Displays estimated preparation time
 * - Shows current status with progress indicator
 */
function OrderStatusTracker({ orderNumber }) {
  const [kitchenOrder, setKitchenOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusInterval, setStatusInterval] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const order = await KitchenService.getKitchenOrderStatus(orderNumber);
      if (order) {
        setKitchenOrder(order);
      }
      setLoading(false);
    };

    fetchStatus();

    // Subscribe to status updates every 5 seconds
    const intervalId = KitchenService.subscribeToStatusUpdates(
      orderNumber,
      (order) => setKitchenOrder(order),
      5000
    );

    setStatusInterval(intervalId);

    return () => {
      if (intervalId) {
        KitchenService.unsubscribeFromStatusUpdates(intervalId);
      }
    };
  }, [orderNumber]);

  if (loading) {
    return <div className="status-tracker"><p>Loading status...</p></div>;
  }

  if (!kitchenOrder) {
    return <div className="status-tracker"><p>Status unavailable</p></div>;
  }

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

  const getProgressValue = (status) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'preparing':
        return 50;
      case 'ready':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString();
  };

  return (
    <div className="status-tracker">
      <h3>Order Status</h3>

      <div className="status-content">
        <div className="status-info">
          <div className="status-badge" style={{ backgroundColor: getStatusColor(kitchenOrder.status) }}>
            {kitchenOrder.status.toUpperCase()}
          </div>

          {kitchenOrder.assignedTo && (
            <p className="assigned-to">👨‍🍳 Assigned to: {kitchenOrder.assignedTo}</p>
          )}

          {kitchenOrder.estimatedTime && (
            <p className="estimated-time">
              ⏱ Ready by: {formatTime(kitchenOrder.estimatedTime)}
            </p>
          )}
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${getProgressValue(kitchenOrder.status)}%`,
                backgroundColor: getStatusColor(kitchenOrder.status)
              }}
            />
          </div>
          <p className="progress-text">Preparation Progress</p>
        </div>

        <div className="status-timeline">
          <div className={`timeline-item ${kitchenOrder.sentToKitchenAt ? 'completed' : ''}`}>
            <div className="timeline-dot" />
            <span>Sent to Kitchen</span>
          </div>
          <div className={`timeline-item ${kitchenOrder.status === 'preparing' || kitchenOrder.startedAt ? 'completed' : ''}`}>
            <div className="timeline-dot" />
            <span>Preparing</span>
          </div>
          <div className={`timeline-item ${kitchenOrder.status === 'ready' || kitchenOrder.readyAt ? 'completed' : ''}`}>
            <div className="timeline-dot" />
            <span>Ready for Pickup</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusTracker;
