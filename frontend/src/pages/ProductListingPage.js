import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductListingPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Category names mapping
const categoryNames = {
  1: 'Pizza',
  2: 'Cold Drinks',
  3: 'Breads'
};

/**
 * Product Listing Page Component
 * - Displays products for selected category
 * - Shows product details (name, price, description)
 * - Allows adding products to cart with quantity selector
 */
function ProductListingPage({ addToCart }) {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch products for the category
  useEffect(() => {
    fetchProducts();
    // Initialize quantities for each product
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu/products/${categoryId}`);
      setProducts(response.data);
      
      // Initialize quantities to 1 for each product
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      setQuantities({
        ...quantities,
        [productId]: quantity
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id];
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  if (loading) return <div className="container"><p>Loading products...</p></div>;

  return (
    <div className="product-listing-page">
      <div className="container">
        <h1>{categoryNames[categoryId]} Products</h1>
        <p className="products-subtitle">Select products and choose quantity</p>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {categoryId === '1' && '🍕'}
                {categoryId === '2' && '🥤'}
                {categoryId === '3' && '🍞'}
              </div>
              
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                
                <div className="product-controls">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="quantity-input"
                  />
                  
                  <button
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
