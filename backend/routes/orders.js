/**
 * Orders API Routes
 * Handles order creation, retrieval, and storage
 */

const express = require('express');
const router = express.Router();

// In-memory orders database (replace with real DB in production)
let orders = [];

/**
 * POST /api/orders/create
 * Create new order
 */
router.post('/create', (req, res) => {
  try {
    const order = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    orders.push(order);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * GET /api/orders
 * Get all orders
 */
router.get('/', (req, res) => {
  res.json(orders);
});

/**
 * GET /api/orders/:orderId
 * Get specific order by ID
 */
router.get('/:orderId', (req, res) => {
  const order = orders.find(o => o.id === req.params.orderId || o.orderNumber === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

/**
 * PUT /api/orders/:orderId/status
 * Update order status
 */
router.put('/:orderId/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.status = req.body.status;
  res.json(order);
});

/**
 * DELETE /api/orders/:orderId
 * Delete order
 */
router.delete('/:orderId', (req, res) => {
  orders = orders.filter(o => o.id !== req.params.orderId);
  res.json({ success: true });
});

module.exports = router;
