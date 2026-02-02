/**
 * CartService.js
 * 
 * Utility service for managing shopping cart operations
 * Handles:
 * - Adding items to cart
 * - Removing items from cart
 * - Updating item quantities
 * - Calculating cart totals
 * - Persisting cart to localStorage
 */

const CART_STORAGE_KEY = 'pizza-cart';

/**
 * CartService - All cart-related operations
 */
const CartService = {
  /**
   * Get all items from cart
   * @returns {Array} Array of cart items
   */
  getCart: () => {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error retrieving cart from localStorage:', error);
      return [];
    }
  },

  /**
   * Add item to cart (or increase quantity if already exists)
   * @param {Object} product - Product object with id, name, price
   * @param {number} quantity - Quantity to add
   * @returns {Array} Updated cart
   */
  addToCart: (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return CartService.getCart();
    }

    const cart = CartService.getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Product already in cart - increase quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // New product - add to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }

    // Save to localStorage
    CartService.saveCart(cart);
    return cart;
  },

  /**
   * Remove item from cart
   * @param {number} productId - ID of product to remove
   * @returns {Array} Updated cart
   */
  removeFromCart: (productId) => {
    let cart = CartService.getCart();
    cart = cart.filter(item => item.id !== productId);
    CartService.saveCart(cart);
    return cart;
  },

  /**
   * Update quantity of an item in cart
   * @param {number} productId - ID of product
   * @param {number} newQuantity - New quantity
   * @returns {Array} Updated cart
   */
  updateQuantity: (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return CartService.removeFromCart(productId);
    }

    let cart = CartService.getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQuantity;
      CartService.saveCart(cart);
    }

    return cart;
  },

  /**
   * Clear entire cart
   * @returns {Array} Empty array
   */
  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  },

  /**
   * Calculate cart totals
   * @returns {Object} Object with subtotal, tax, and total
   */
  calculateTotals: () => {
    const cart = CartService.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.10; // 10% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: cart.length,
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  },

  /**
   * Get cart item count
   * @returns {number} Total number of items in cart
   */
  getItemCount: () => {
    const cart = CartService.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  /**
   * Save cart to localStorage
   * @private
   * @param {Array} cart - Cart items to save
   */
  saveCart: (cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  /**
   * Export cart as JSON (useful for orders)
   * @returns {Object} Cart data with items and totals
   */
  exportCart: () => {
    const cart = CartService.getCart();
    const totals = CartService.calculateTotals();

    return {
      items: cart,
      itemCount: totals.itemCount,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      timestamp: new Date().toISOString()
    };
  }
};

export default CartService;
