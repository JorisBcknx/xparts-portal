import React from 'react';
import './Inventory.css';

function Inventory() {
  const inventoryItems = [
    { sku: 'SKU-001', name: 'Brake Pad Set - Premium', category: 'Brake System', stock: 1240, reorderLevel: 200, location: 'Warehouse A - A12', lastRestocked: '2024-02-28', status: 'Optimal' },
    { sku: 'SKU-002', name: 'Engine Oil Filter', category: 'Engine Parts', stock: 890, reorderLevel: 150, location: 'Warehouse A - B05', lastRestocked: '2024-02-25', status: 'Optimal' },
    { sku: 'SKU-003', name: 'Air Filter Kit', category: 'Filtration', stock: 450, reorderLevel: 100, location: 'Warehouse B - C08', lastRestocked: '2024-02-20', status: 'Optimal' },
    { sku: 'SKU-004', name: 'Fuel Filter Assembly', category: 'Fuel System', stock: 620, reorderLevel: 120, location: 'Warehouse A - D15', lastRestocked: '2024-02-22', status: 'Optimal' },
    { sku: 'SKU-005', name: 'Suspension Kit Complete', category: 'Suspension', stock: 85, reorderLevel: 50, location: 'Warehouse C - E03', lastRestocked: '2024-02-15', status: 'Low' },
    { sku: 'SKU-006', name: 'Cabin Air Filter', category: 'Filtration', stock: 380, reorderLevel: 80, location: 'Warehouse B - F11', lastRestocked: '2024-02-18', status: 'Optimal' },
    { sku: 'SKU-007', name: 'Alternator Belt', category: 'Drive System', stock: 15, reorderLevel: 40, location: 'Warehouse A - G07', lastRestocked: '2024-01-30', status: 'Critical' },
    { sku: 'SKU-008', name: 'Wiper Blade Set', category: 'Accessories', stock: 520, reorderLevel: 100, location: 'Warehouse B - H14', lastRestocked: '2024-02-26', status: 'Optimal' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Optimal': '#00a86b',
      'Low': '#ffc107',
      'Critical': '#dc3545'
    };
    return colors[status] || '#666';
  };

  const getStockLevel = (stock, reorderLevel) => {
    const percentage = (stock / (reorderLevel * 3)) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p className="page-subtitle">Monitor stock levels and warehouse locations</p>
        </div>
        <div className="header-actions">
          <button className="secondary-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Report
          </button>
          <button className="primary-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Restock Items
          </button>
        </div>
      </div>

      <div className="inventory-summary">
        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#007bff' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total SKUs</div>
            <div className="summary-value">248</div>
            <div className="summary-subtitle">Active products</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#00a86b' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Optimal Stock</div>
            <div className="summary-value">198</div>
            <div className="summary-subtitle">Items in good stock</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#ffc107' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55297 18.6453 1.55199 18.9945C1.55101 19.3437 1.64149 19.6871 1.81442 19.9905C1.98735 20.2939 2.23672 20.5467 2.53771 20.7239C2.8387 20.9011 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.9011 21.4623 20.7239C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Low Stock</div>
            <div className="summary-value">23</div>
            <div className="summary-subtitle">Need attention</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#dc3545' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Critical</div>
            <div className="summary-value">8</div>
            <div className="summary-subtitle">Reorder now</div>
          </div>
        </div>
      </div>

      <div className="inventory-container">
        <div className="inventory-header">
          <h2>Stock Overview</h2>
          <div className="view-toggle">
            <button className="toggle-btn active">Table View</button>
            <button className="toggle-btn">Card View</button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Location</th>
                <th>Last Restocked</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.sku}>
                  <td className="sku-cell">{item.sku}</td>
                  <td className="name-cell">{item.name}</td>
                  <td className="category-cell">{item.category}</td>
                  <td>
                    <div className="stock-info">
                      <div className="stock-number">{item.stock} units</div>
                      <div className="stock-bar">
                        <div
                          className="stock-bar-fill"
                          style={{
                            width: `${getStockLevel(item.stock, item.reorderLevel)}%`,
                            backgroundColor: getStatusColor(item.status)
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="reorder-cell">{item.reorderLevel} units</td>
                  <td className="location-cell">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {item.location}
                  </td>
                  <td className="date">{item.lastRestocked}</td>
                  <td>
                    <span
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-link">Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
