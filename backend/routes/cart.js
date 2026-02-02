// Cart Routes - Handles shopping cart operations
const express = require('express');
const router = express.Router();

// In-memory cart storage (replace with database in production)
const carts = {};

// POST: Add item to cart
router.post('/add', (req, res) => {
  const { cartId, productId, quantity, price, name } = req.body;
  
  if (!cartId || !productId || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Initialize cart if it doesn't exist
  if (!carts[cartId]) {
    carts[cartId] = [];
  }
  
  // Check if product already in cart
  const existingItem = carts[cartId].find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[cartId].push({
      productId,
      quantity,
      price,
      name,
      total: quantity * price
    });
  }
  
  res.json({ message: 'Item added to cart', cart: carts[cartId] });
});

// GET: Retrieve cart
router.get('/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  
  if (carts[cartId]) {
    const total = carts[cartId].reduce((sum, item) => sum + item.total, 0);
    res.json({ items: carts[cartId], total });
  } else {
    res.json({ items: [], total: 0 });
  }
});

// POST: Remove item from cart
router.post('/remove', (req, res) => {
  const { cartId, productId } = req.body;
  
  if (carts[cartId]) {
    carts[cartId] = carts[cartId].filter(item => item.productId !== productId);
    res.json({ message: 'Item removed', cart: carts[cartId] });
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// POST: Clear cart
router.post('/clear', (req, res) => {
  const { cartId } = req.body;
  
  if (carts[cartId]) {
    delete carts[cartId];
    res.json({ message: 'Cart cleared' });
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

module.exports = router;
