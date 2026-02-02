/**
 * OrderService - Manages order data with localStorage and API integration
 * Handles order creation, retrieval, and history for both authenticated and guest users
 */

import AuthService from './AuthService';

const API_BASE_URL = 'http://localhost:5000/api/orders';

class OrderService {
  /**
   * Generate unique order number
   */
  static generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create new order
   */
  static async createOrder(cartItems) {
    const orderNumber = this.generateOrderNumber();
    const currentUser = AuthService.getCurrentUser();
    
    const order = {
      id: orderNumber,
      orderNumber,
      userId: currentUser?.id || null,
      userName: currentUser?.name || 'Guest',
      items: cartItems,
      totals: this.calculateTotals(cartItems),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Save to localStorage
    const orders = this.getOrdersFromStorage();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Save to backend
    try {
      await this.saveOrderToBackend(order);
    } catch (error) {
      console.error('Error saving order to backend:', error);
    }

    return order;
  }

  /**
   * Calculate totals from cart items
   */
  static calculateTotals(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2)
    };
  }

  /**
   * Save order to backend database
   */
  static async saveOrderToBackend(order) {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error('Failed to save order');
    return response.json();
  }

  /**
   * Get single order by ID
   */
  static getOrderById(orderId) {
    const orders = this.getOrdersFromStorage();
    return orders.find(order => order.id === orderId || order.orderNumber === orderId);
  }

  /**
   * Get all orders from localStorage
   */
  static getOrdersFromStorage() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }

  /**
   * Get all orders (from backend or localStorage)
   */
  static async getAllOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error('Error fetching orders from backend:', error);
    }
    return this.getOrdersFromStorage();
  }

  /**
   * Get orders for authenticated user only
   */
  static getUserOrders() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const orders = this.getOrdersFromStorage();
    return orders.filter(order => order.userId === currentUser.id);
  }

  /**
   * Search orders by order number or date
   */
  static searchOrders(query, userOnly = false) {
    const orders = userOnly ? this.getUserOrders() : this.getOrdersFromStorage();
    const lowerQuery = query.toLowerCase();
    
    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(lowerQuery) ||
      new Date(order.createdAt).toLocaleDateString().includes(query)
    );
  }

  /**
   * Get recent orders
   */
  static getRecentOrders(limit = 5, userOnly = false) {
    const orders = userOnly ? this.getUserOrders() : this.getOrdersFromStorage();
    return orders.reverse().slice(0, limit);
  }

  /**
   * Clear all orders
   */
  static clearOrders() {
    localStorage.removeItem('orders');
  }
}

export default OrderService;
