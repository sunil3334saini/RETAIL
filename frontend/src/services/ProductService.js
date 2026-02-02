/**
 * ProductService.js
 * 
 * Utility service for fetching product and menu data from backend API
 * Handles:
 * - Fetching categories
 * - Fetching products by category
 * - Fetching single product details
 * - Error handling and caching
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simple in-memory cache for categories
let categoriesCache = null;

/**
 * ProductService - All product-related API calls
 */
const ProductService = {
  /**
   * Fetch all product categories
   * @returns {Promise<Array>} Array of category objects
   * @throws {Error} If API call fails
   */
  fetchCategories: async () => {
    try {
      // Return cached categories if available
      if (categoriesCache) {
        return categoriesCache;
      }

      const response = await apiClient.get('/menu/categories');
      categoriesCache = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories. Please try again later.');
    }
  },

  /**
   * Fetch products for a specific category
   * @param {number|string} categoryId - Category ID
   * @returns {Promise<Array>} Array of product objects
   * @throws {Error} If API call fails
   */
  fetchProductsByCategory: async (categoryId) => {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const response = await apiClient.get(`/menu/products/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw new Error(`Failed to fetch products. Please try again later.`);
    }
  },

  /**
   * Fetch all products across all categories
   * @returns {Promise<Array>} Array of all product objects
   * @throws {Error} If API call fails
   */
  fetchAllProducts: async () => {
    try {
      const response = await apiClient.get('/menu/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products. Please try again later.');
    }
  },

  /**
   * Fetch details for a specific product
   * @param {number|string} productId - Product ID
   * @returns {Promise<Object>} Product object
   * @throws {Error} If API call fails
   */
  fetchProductById: async (productId) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await apiClient.get(`/menu/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw new Error('Failed to fetch product details. Please try again later.');
    }
  },

  /**
   * Search products by name (requires backend implementation)
   * @param {string} searchTerm - Search query
   * @returns {Promise<Array>} Array of matching products
   */
  searchProducts: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return [];
      }

      const response = await apiClient.get('/menu/search', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  /**
   * Clear the categories cache (useful after data updates)
   */
  clearCache: () => {
    categoriesCache = null;
  }
};

export default ProductService;
