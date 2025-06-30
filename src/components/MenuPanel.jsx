import React, { useState } from 'react';
import Inventory from './Inventory';
import MapView from './MapView';
import '../MenuPanel.css';

function MenuPanel({
  inventory = [],
  onUseItem,
  onClose,
  world,
  worldPosition,
  monsters,
}) {
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
        <MapView
          inline
          world={world}
          worldPosition={worldPosition}
          monsters={monsters}
          dimensions={{ rows: world?.length || 0, cols: world && world[0] ? world[0].length : 0 }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="menu-overlay" role="dialog" aria-label="menu panel">
      <div className="menu-panel open">
        <div className="drawer-handle" />
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
              className={`btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
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
