/**
 * KitchenService - Manages kitchen order distribution and status updates
 * Syncs orders with kitchen API
 */

const API_BASE_URL = 'http://localhost:5000/api/kitchen';

class KitchenService {
  /**
   * Send order to kitchen
   */
  static async sendOrderToKitchen(order) {
    try {
      const response = await fetch(`${API_BASE_URL}/send-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          items: order.items,
          createdAt: order.createdAt,
          userId: order.userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send order to kitchen');
      }

      return response.json();
    } catch (error) {
      console.error('Error sending order to kitchen:', error);
      throw error;
    }
  }

  /**
   * Get kitchen order status
   */
  static async getKitchenOrderStatus(orderNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}`);

      if (!response.ok) {
        throw new Error('Order not found in kitchen');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching kitchen order:', error);
      return null;
    }
  }

  /**
   * Get all kitchen orders
   */
  static async getAllKitchenOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);

      if (!response.ok) {
        throw new Error('Failed to fetch kitchen orders');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      return [];
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderNumber, status, prepTime = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, prepTime })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Assign order to staff
   */
  static async assignOrderToStaff(orderNumber, staffName) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffName })
      });

      if (!response.ok) {
        throw new Error('Failed to assign order');
      }

      return response.json();
    } catch (error) {
      console.error('Error assigning order:', error);
      throw error;
    }
  }

  /**
   * Subscribe to order status updates (polling)
   */
  static subscribeToStatusUpdates(orderNumber, callback, interval = 5000) {
    const intervalId = setInterval(async () => {
      const order = await this.getKitchenOrderStatus(orderNumber);
      if (order) {
        callback(order);
      }
    }, interval);

    return intervalId;
  }

  /**
   * Unsubscribe from status updates
   */
  static unsubscribeFromStatusUpdates(intervalId) {
    clearInterval(intervalId);
  }
}

export default KitchenService;
