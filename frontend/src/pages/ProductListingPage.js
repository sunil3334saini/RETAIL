import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CartService from '../services/CartService';
import ProductService from '../services/ProductService';
import './ProductListingPage.css';

/**
 * Product Listing Page Component
 * 
 * Displays all products for a selected category with:
 * - Product cards with images and details
 * - Quantity selector for each product
 * - Add to Cart functionality
 * - Clean state management using CartService
 */

// Category names mapping
const CATEGORY_NAMES = {
  1: 'Pizza',
  2: 'Cold Drinks',
  3: 'Breads'
};

function ProductListingPage({ addToCart }) {
  const { categoryId } = useParams();
  
  // State management
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch products for the selected category on component mount or category change
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products from backend API
        const fetchedProducts = await ProductService.fetchProductsByCategory(categoryId);
        setProducts(fetchedProducts);
        
        // Initialize quantities to 1 for each product
        const initialQuantities = {};
        fetchedProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  /**
   * Handle quantity change for a product
   * @param {number} productId - ID of the product
   * @param {number} newQuantity - New quantity value
   */
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities({
      ...quantities,
      [productId]: newQuantity
    });
  };

  /**
   * Handle Add to Cart button click
   * Uses CartService to manage cart state and localStorage
   * @param {Object} product - Product object to add
   * @param {number} quantity - Quantity to add
   */
  const handleAddToCart = (product, quantity) => {
    try {
      // Add to cart using CartService
      CartService.addToCart(product, quantity);
      
      // Call parent component callback for UI updates
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      // Show success message
      alert(`✓ Added ${quantity} x ${product.name} to cart!`);
      
      // Reset quantity selector to 1
      setQuantities({
        ...quantities,
        [product.id]: 1
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container loading-container">
        <p className="loading-text">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container error-container">
        <p className="error-text">⚠️ {error}</p>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="container empty-container">
        <p className="empty-text">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="product-listing-page">
      <div className="container">
        {/* Page Header */}
        <h1>{CATEGORY_NAMES[categoryId]} Products</h1>
        <p className="products-subtitle">Select products and choose quantity</p>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryId={categoryId}
              quantity={quantities[product.id] || 1}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
