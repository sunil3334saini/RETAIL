// Menu Routes - Handles menu and product related requests
const express = require('express');
const router = express.Router();

// Sample data - Replace with database queries in production
const categories = [
  { id: 1, name: 'Pizza', description: 'Delicious pizzas' },
  { id: 2, name: 'Cold Drinks', description: 'Refreshing beverages' },
  { id: 3, name: 'Breads', description: 'Fresh baked breads' }
];

const products = {
  1: [
    { id: 101, name: 'Margherita', price: 8.99, description: 'Classic pizza with cheese and tomato' },
    { id: 102, name: 'Pepperoni', price: 10.99, description: 'Pizza with pepperoni toppings' },
    { id: 103, name: 'Veggie', price: 9.99, description: 'Vegetarian pizza' }
  ],
  2: [
    { id: 201, name: 'Cola', price: 2.99, description: 'Cold cola drink' },
    { id: 202, name: 'Lemonade', price: 3.49, description: 'Fresh lemonade' },
    { id: 203, name: 'Iced Tea', price: 2.49, description: 'Chilled iced tea' }
  ],
  3: [
    { id: 301, name: 'Garlic Bread', price: 4.99, description: 'Toasted garlic bread' },
    { id: 302, name: 'Whole Wheat Bread', price: 3.99, description: 'Healthy whole wheat bread' },
    { id: 303, name: 'Ciabatta', price: 5.99, description: 'Italian ciabatta bread' }
  ]
};

// GET all categories
router.get('/categories', (req, res) => {
  res.json(categories);
});

// GET products by category ID
router.get('/products/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  
  if (products[categoryId]) {
    res.json(products[categoryId]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// GET all products
router.get('/products', (req, res) => {
  const allProducts = [];
  for (let categoryId in products) {
    allProducts.push(...products[categoryId]);
  }
  res.json(allProducts);
});

// GET product by ID
router.get('/product/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  
  for (let categoryId in products) {
    const product = products[categoryId].find(p => p.id === productId);
    if (product) {
      return res.json(product);
    }
  }
  
  res.status(404).json({ error: 'Product not found' });
});

module.exports = router;
