/**
 * Kitchen API Routes
 * Handles kitchen orders, status updates, and order distribution
 */

const express = require('express');
const router = express.Router();

// In-memory kitchen orders database
let kitchenOrders = [];

/**
 * POST /api/kitchen/send-order
 * Distribute order to kitchen
 */
router.post('/send-order', (req, res) => {
  try {
    const { orderNumber, items, createdAt, userId } = req.body;

    if (!orderNumber || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const kitchenOrder = {
      id: orderNumber,
      orderNumber,
      items,
      createdAt,
      userId,
      status: 'pending',
      assignedTo: null,
      prepTime: 30,
      estimatedTime: new Date(Date.now() + 30 * 60000).toISOString(),
      sentToKitchenAt: new Date().toISOString()
    };

    kitchenOrders.push(kitchenOrder);
    res.status(201).json({ success: true, order: kitchenOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send order to kitchen' });
  }
});

/**
 * GET /api/kitchen/orders
 * Get all kitchen orders
 */
router.get('/orders', (req, res) => {
  try {
    res.json(kitchenOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch kitchen orders' });
  }
});

/**
 * GET /api/kitchen/orders/:orderNumber
 * Get specific kitchen order
 */
router.get('/orders/:orderNumber', (req, res) => {
  try {
    const order = kitchenOrders.find(o => o.orderNumber === req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * PUT /api/kitchen/orders/:orderNumber/status
 * Update order status in kitchen
 */
router.put('/orders/:orderNumber/status', (req, res) => {
  try {
    const { status, prepTime } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = kitchenOrders.find(o => o.orderNumber === req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (prepTime) {
      order.prepTime = prepTime;
      order.estimatedTime = new Date(Date.now() + prepTime * 60000).toISOString();
    }
    if (status === 'preparing' && !order.startedAt) {
      order.startedAt = new Date().toISOString();
    }
    if (status === 'ready') {
      order.readyAt = new Date().toISOString();
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

/**
 * PUT /api/kitchen/orders/:orderNumber/assign
 * Assign order to kitchen staff
 */
router.put('/orders/:orderNumber/assign', (req, res) => {
  try {
    const { staffName } = req.body;
    const order = kitchenOrders.find(o => o.orderNumber === req.params.orderNumber);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.assignedTo = staffName;
    order.assignedAt = new Date().toISOString();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign order' });
  }
});

/**
 * DELETE /api/kitchen/orders/:orderNumber
 * Delete kitchen order
 */
router.delete('/orders/:orderNumber', (req, res) => {
  try {
    kitchenOrders = kitchenOrders.filter(o => o.orderNumber !== req.params.orderNumber);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
