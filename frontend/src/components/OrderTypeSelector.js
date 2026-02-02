import React, { useState } from 'react';
import './OrderTypeSelector.css';

/**
 * Order Type Selector Component
 * - Choose between Carryout and Dine-in
 * - Saves selection to parent component
 */
function OrderTypeSelector({ onSelectType, selectedType = 'carryout' }) {
  return (
    <div className="order-type-selector">
      <h3>Order Type</h3>
      <div className="type-options">
        <button
          className={`type-option ${selectedType === 'carryout' ? 'active' : ''}`}
          onClick={() => onSelectType('carryout')}
        >
          <div className="icon">🛍️</div>
          <span>Carryout</span>
        </button>
        <button
          className={`type-option ${selectedType === 'dine-in' ? 'active' : ''}`}
          onClick={() => onSelectType('dine-in')}
        >
          <div className="icon">🍽️</div>
          <span>Dine-in</span>
        </button>
      </div>
    </div>
  );
}

export default OrderTypeSelector;
