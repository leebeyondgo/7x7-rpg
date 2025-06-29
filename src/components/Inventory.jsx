import React from 'react';
import './Inventory.css';

function Inventory({ items, onUse }) {
  return (
    <div className="inventory">
      <h3>Inventory</h3>
      <ul className="inventory-list">
        {items.length === 0 ? (
          <li className="inventory-item">Empty</li>
        ) : (
          items.map((item, index) => (
            <li key={index} className="inventory-item">
              {item.name}
              {onUse && (
                <button
                  type="button"
                  className="use-button btn"
                  onClick={() => onUse(index)}
                >
                  Use
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Inventory;
