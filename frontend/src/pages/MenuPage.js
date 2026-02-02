import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Menu Page Component
 * - Displays product categories
 * - Each category can be clicked to view products
 */
function MenuPage({ addToCart }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu/categories`);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  // Navigate to product listing page
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  if (loading) return <div className="container"><p>Loading categories...</p></div>;

  return (
    <div className="menu-page">
      <div className="container">
        <h1>Menu</h1>
        <p className="menu-subtitle">Choose a category to browse our delicious offerings</p>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon">
                {category.id === 1 && '🍕'}
                {category.id === 2 && '🥤'}
                {category.id === 3 && '🍞'}
              </div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <button className="btn btn-primary">Browse {category.name}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
