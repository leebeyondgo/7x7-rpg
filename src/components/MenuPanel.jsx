import React, { useState } from 'react';
import Inventory from './Inventory';
import '../MenuPanel.css';

function MenuPanel({ inventory = [], onUseItem, onClose }) {
  const tabs = [
    {
      id: 'inventory',
      label: 'Inventory',
      content: <Inventory items={inventory} onUse={onUseItem} />,
    },
    {
      id: 'map',
      label: 'Map',
      content: (
        <div className="map-placeholder">Map coming soon...</div>
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="menu-overlay" role="dialog" aria-label="menu panel">
      <div className="menu-panel open">
        <button
          type="button"
          className="close-button btn"
          onClick={onClose}
          aria-label="close menu"
        >
          ×
        </button>
        <div className="tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {tabs.find((t) => t.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}

export default MenuPanel;
