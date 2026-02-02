import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import pages
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import ProductListingPage from './pages/ProductListingPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [cart, setCart] = useState([]);
  const [cartId] = useState('cart-' + Math.random().toString(36).substr(2, 9));

  // Load cart from localStorage on app start
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${cartId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [cartId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`cart-${cartId}`, JSON.stringify(cart));
  }, [cart, cartId]);

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Get total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">🍕 Pizza & Breads</Link>
            <div className="nav-links">
              <Link to="/menu">Menu</Link>
              <Link to="/cart" className="cart-link">
                🛒 Cart ({cartItemCount})
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
          <Route path="/category/:categoryId" element={<ProductListingPage addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
