import React from 'react';

function Inventory({ items, onUse }) {
  return (
    <div className="inventory">
      <h2>Inventory</h2>
      <ul>
        {items.length === 0 ? (
          <li>Empty</li>
        ) : (
          items.map((item, index) => (
            <li key={index}>
              {item.name}
              {onUse && (
                <button type="button" onClick={() => onUse(index)}>
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
