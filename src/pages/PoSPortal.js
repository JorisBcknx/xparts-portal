import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { productsData } from '../data/productsData';
import { getWarehouseStock } from '../data/warehouseStock';
import './PoSPortal.css';

function PoSPortal() {
  const navigate = useNavigate();
  const { searchQuery, searchResults, performSearch, clearSearch, isSearching } = useSearch();
  const [currentView, setCurrentView] = useState('menu'); // menu, product, question, order, ticket
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Most frequently viewed products
  const [frequentlyViewed] = useState([
    productsData.find(p => p.code === '85142795'), // ULTRASHIFT DM Clutch
    productsData.find(p => p.code === '85138270'), // Air Dryer Kit
    productsData.find(p => p.code === '2191-P181057'), // Engine Air Filter
    productsData.find(p => p.code === '85153001'), // ESP ECU
    productsData.find(p => p.code === '85066'), // Shock Absorber
    productsData.find(p => p.code === '3041-40014SP'), // Service Parts Kit
  ].filter(Boolean));

  const handleSearchChange = (e) => {
    const query = e.target.value;
    performSearch(query);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedProduct(null);
    setSelectedOrder(null);
    clearSearch();
    setOrderNumber('');
    setQuestionText('');
    setTicketSubject('');
    setTicketDescription('');
  };

  const getStockStatus = (stock) => {
    if (!stock || stock === 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (stock < 10) return { label: 'Low Stock', class: 'low-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  const getPrice = (product) => {
    if (product.priceFormatted) return product.priceFormatted;
    if (product.price?.formattedValue) return product.price.formattedValue;
    if (typeof product.price === 'number') return `$${product.price.toFixed(2)}`;
    if (product.price?.value) return `$${product.price.value.toFixed(2)}`;
    return 'Contact for Price';
  };

  // Mock orders data with detailed tracking info
  const mockOrders = [
    {
      id: 'ORD-2024-1847',
      date: '2024-02-28',
      status: 'In Transit',
      total: '$3,456.89',
      items: 5,
      eta: 'Mar 4, 2024',
      tracking: 'TRK-897456123',
      carrier: 'FedEx Freight',
      shipDate: '2024-03-01',
      trackingSteps: [
        { date: '2024-03-01 09:15 AM', status: 'Order Picked Up', location: 'Mack Distribution Center - Allentown, PA', completed: true },
        { date: '2024-03-02 02:30 PM', status: 'In Transit', location: 'FedEx Hub - Philadelphia, PA', completed: true },
        { date: '2024-03-03 11:00 AM', status: 'Out for Delivery', location: 'Local Delivery Center', completed: false },
        { date: '2024-03-04 (Est.)', status: 'Delivered', location: 'Your Location', completed: false }
      ],
      orderItems: [
        { name: 'Brake Pad Set - Front Axle', code: '85108272', qty: 2, price: '$291.00' },
        { name: 'Air Filter Element', code: '22329187', qty: 4, price: '$211.20' },
        { name: 'Oil Filter Cartridge', code: '85135476', qty: 6, price: '$110.88' },
        { name: 'Fuel Filter Assembly', code: '85112344', qty: 2, price: '$189.50' },
        { name: 'Cabin Air Filter', code: '85119876', qty: 1, price: '$87.40' }
      ]
    },
    {
      id: 'ORD-2024-1802',
      date: '2024-02-15',
      status: 'Delivered',
      total: '$1,892.50',
      items: 3,
      eta: 'Delivered Feb 18',
      tracking: 'TRK-882341567',
      carrier: 'UPS Freight',
      shipDate: '2024-02-16',
      deliveredDate: '2024-02-18 10:45 AM',
      trackingSteps: [
        { date: '2024-02-16 08:00 AM', status: 'Order Picked Up', location: 'Mack Distribution Center - Allentown, PA', completed: true },
        { date: '2024-02-17 01:15 PM', status: 'In Transit', location: 'UPS Hub - Baltimore, MD', completed: true },
        { date: '2024-02-18 07:30 AM', status: 'Out for Delivery', location: 'Local Delivery Center', completed: true },
        { date: '2024-02-18 10:45 AM', status: 'Delivered', location: 'Rustic Hardware - Signed by M. Rivers', completed: true }
      ],
      orderItems: [
        { name: 'ULTRASHIFT DM Clutch Assembly', code: '85142795', qty: 1, price: '$1,249.99' },
        { name: 'Air Dryer Kit', code: '85138270', qty: 2, price: '$491.98' },
        { name: 'Wiper Blade Set', code: '85122455', qty: 1, price: '$52.80' }
      ]
    },
    {
      id: 'ORD-2024-1756',
      date: '2024-01-30',
      status: 'Processing',
      total: '$5,234.00',
      items: 8,
      eta: 'Mar 6, 2024',
      tracking: null,
      carrier: 'Pending',
      shipDate: null,
      trackingSteps: [
        { date: '2024-01-30 02:30 PM', status: 'Order Received', location: 'Mack Parts Portal', completed: true },
        { date: '2024-01-31 09:00 AM', status: 'Payment Confirmed', location: 'Finance Department', completed: true },
        { date: '2024-02-01 10:15 AM', status: 'Parts Allocated', location: 'Warehouse', completed: true },
        { date: 'Pending', status: 'Ready to Ship', location: 'Warehouse', completed: false },
        { date: 'Pending', status: 'Shipped', location: 'TBD', completed: false }
      ],
      orderItems: [
        { name: 'ESP Electronic Control Unit', code: '85153001', qty: 1, price: '$892.50' },
        { name: 'Suspension Kit - Complete', code: '85167890', qty: 1, price: '$2,340.00' },
        { name: 'Brake Pad Set', code: '85108272', qty: 4, price: '$582.00' },
        { name: 'Air Filter Elements', code: '22329187', qty: 6, price: '$316.80' },
        { name: 'Oil Filters', code: '85135476', qty: 10, price: '$184.80' },
        { name: 'Fuel Filters', code: '85112344', qty: 4, price: '$378.00' },
        { name: 'Coolant Hoses', code: '85198765', qty: 2, price: '$267.40' },
        { name: 'V-Belt Set', code: '85176543', qty: 1, price: '$89.50' }
      ]
    },
  ];

  // Render Main Menu
  const renderMenu = () => (
    <div className="pos-menu">
      <div className="pos-menu-header">
        <h2>How can we help you today?</h2>
        <p>Select an option to get started</p>
      </div>

      <div className="pos-menu-grid">
        <div className="pos-menu-card" onClick={() => setCurrentView('product')}>
          <div className="pos-menu-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Look for a Product</h3>
          <p>Search our catalog for parts and check availability</p>
        </div>

        <div className="pos-menu-card" onClick={() => setCurrentView('question')}>
          <div className="pos-menu-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.228 9C8.61599 7.58623 9.99167 6.59 11.4999 6.59H12.4999C14.433 6.59 15.9999 8.15686 15.9999 10.09C15.9999 11.6241 15.0103 12.9503 13.5999 13.4299C12.7927 13.7002 12.2299 14.4497 12.2299 15.3V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12.01 18.5V18.51L11.9999 18.5101V18.5H12.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Ask a Question</h3>
          <p>Get expert help from our parts specialists</p>
        </div>

        <div className="pos-menu-card" onClick={() => setCurrentView('order')}>
          <div className="pos-menu-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Check on Order</h3>
          <p>Track your order status and delivery updates</p>
        </div>

        <div className="pos-menu-card" onClick={() => setCurrentView('ticket')}>
          <div className="pos-menu-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Create a Ticket</h3>
          <p>Report an issue or request service support</p>
        </div>
      </div>
    </div>
  );

  // Render Product Search View
  const renderProductSearch = () => (
    <div className="pos-view-container">
      <div className="pos-view-header">
        <button className="pos-back-btn" onClick={handleBackToMenu}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Menu
        </button>
        <h2>Product Search</h2>
      </div>

      <div className="pos-content-split">
        <div className="pos-search-panel">
          <div className="pos-search-box">
            <input
              type="text"
              placeholder="Enter part number or product name..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              className="pos-search-input"
            />
            {searchQuery && (
              <button className="pos-clear-btn" onClick={() => { clearSearch(); setSelectedProduct(null); }}>
                Clear
              </button>
            )}
          </div>

          <div className="pos-results">
            {isSearching ? (
              <div className="pos-loading">
                <div className="spinner"></div>
                <p>Searching...</p>
              </div>
            ) : searchQuery.length >= 2 ? (
              searchResults.length > 0 ? (
                <div className="pos-results-list">
                  {searchResults.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div
                        key={index}
                        className={`pos-result-item ${selectedProduct?.code === product.code ? 'selected' : ''}`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <img src={product.image} alt={product.name} className="pos-result-thumb" />
                        <div className="pos-result-main">
                          <div className="pos-result-name">{product.name}</div>
                          <div className="pos-result-code">OEM: {product.code}</div>
                        </div>
                        <div className="pos-result-right">
                          <div className={`pos-stock-badge ${stockStatus.class}`}>
                            {stockStatus.label}
                          </div>
                          <div className="pos-result-price">{getPrice(product)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pos-empty-state">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="pos-empty-text">No products found</div>
                  <div className="pos-empty-hint">Try a different search term</div>
                </div>
              )
            ) : (
              <div className="pos-frequently-viewed">
                <div className="pos-fv-header">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3>Most Frequently Viewed</h3>
                </div>
                <div className="pos-fv-list">
                  {frequentlyViewed.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div
                        key={product.code}
                        className={`pos-fv-item ${selectedProduct?.code === product.code ? 'selected' : ''}`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <img src={product.image} alt={product.name} className="pos-fv-image" />
                        <div className="pos-fv-info">
                          <div className="pos-fv-name">{product.name}</div>
                          <div className="pos-fv-code">{product.code}</div>
                        </div>
                        <div className="pos-fv-right">
                          <div className={`pos-stock-badge ${stockStatus.class}`}>
                            {stockStatus.label}
                          </div>
                          <div className="pos-fv-price">{getPrice(product)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pos-detail-panel">
          {selectedProduct ? (
            <div className="pos-product-detail">
              <div className="pos-detail-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>

              <div className="pos-detail-info">
                <h3 className="pos-detail-name">{selectedProduct.name}</h3>
                <div className="pos-detail-code">Part #: {selectedProduct.code}</div>
                {selectedProduct.categories && (
                  <div className="pos-detail-category">Category: {selectedProduct.categories}</div>
                )}

                <div className="pos-price-section">
                  <div className="pos-price-label">Price</div>
                  <div className="pos-price-value">{getPrice(selectedProduct)}</div>
                </div>

                <div className="pos-stock-section">
                  <div className="pos-stock-label">Availability</div>
                  <div className="pos-stock-details">
                    {(() => {
                      const stockStatus = getStockStatus(selectedProduct.stock);
                      return (
                        <>
                          <div className={`pos-stock-status ${stockStatus.class}`}>
                            {stockStatus.label}
                          </div>
                          {selectedProduct.stock > 0 && (
                            <div className="pos-stock-count">{selectedProduct.stock} units in main inventory</div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Warehouse Stock Breakdown */}
                {(() => {
                  const basePrice = typeof selectedProduct.price === 'number'
                    ? selectedProduct.price
                    : selectedProduct.price?.value || 0;
                  const warehouseStock = getWarehouseStock(selectedProduct.code, basePrice);

                  return (
                    <div className="pos-warehouse-section">
                      <div className="pos-warehouse-header">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21H21M4 18H20V9L12 3L4 9V18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Warehouse Availability</span>
                      </div>
                      <div className="pos-warehouse-list">
                        {warehouseStock.map((wh, index) => (
                          <div key={index} className={`pos-warehouse-item ${wh.type}`}>
                            <div className="pos-warehouse-info">
                              <div className="pos-warehouse-name">{wh.location}</div>
                              <div className="pos-warehouse-city">{wh.city}</div>
                            </div>
                            <div className="pos-warehouse-details">
                              <div className="pos-warehouse-price">
                                ${wh.price.toFixed(2)}
                              </div>
                              <div className="pos-warehouse-stock">
                                <span className="stock-count">{wh.stock}</span>
                                <span className="stock-units">units</span>
                              </div>
                              <div className="pos-warehouse-delivery">{wh.deliveryDays}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {selectedProduct.description && (
                  <div className="pos-description">
                    <div className="pos-description-label">Description</div>
                    <div className="pos-description-text">{selectedProduct.description}</div>
                  </div>
                )}

                <div className="pos-actions">
                  <button className="pos-action-btn primary">Add to Cart</button>
                  <button className="pos-action-btn secondary" onClick={() => navigate(`/product/${selectedProduct.code}`)}>
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pos-detail-empty">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="pos-detail-empty-text">Select a product</div>
              <div className="pos-detail-empty-hint">Search and click on a product to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Ask Question View
  const renderQuestion = () => (
    <div className="pos-view-container">
      <div className="pos-view-header">
        <button className="pos-back-btn" onClick={handleBackToMenu}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Menu
        </button>
        <h2>Ask a Question</h2>
      </div>

      <div className="pos-single-panel">
        <div className="pos-form-container">
          <div className="pos-form-header">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.228 9C8.61599 7.58623 9.99167 6.59 11.4999 6.59H12.4999C14.433 6.59 15.9999 8.15686 15.9999 10.09C15.9999 11.6241 15.0103 12.9503 13.5999 13.4299C12.7927 13.7002 12.2299 14.4497 12.2299 15.3V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12.01 18.5V18.51L11.9999 18.5101V18.5H12.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h3>Get Expert Help</h3>
              <p>Our parts specialists are here to assist you</p>
            </div>
          </div>

          <div className="pos-form-content">
            <div className="pos-info-cards">
              <div className="pos-info-card">
                <div className="pos-info-card-icon">📞</div>
                <div className="pos-info-card-content">
                  <h4>Call Us</h4>
                  <p>1-800-MACK-PARTS</p>
                  <span>Mon-Fri: 7am - 7pm EST</span>
                </div>
              </div>
              <div className="pos-info-card">
                <div className="pos-info-card-icon">✉️</div>
                <div className="pos-info-card-content">
                  <h4>Email Support</h4>
                  <p>parts@macktrucks.com</p>
                  <span>Response within 24 hours</span>
                </div>
              </div>
              <div className="pos-info-card">
                <div className="pos-info-card-icon">💬</div>
                <div className="pos-info-card-content">
                  <h4>Live Chat</h4>
                  <p>Chat with a specialist</p>
                  <span>Available now</span>
                </div>
              </div>
            </div>

            <div className="pos-form-section">
              <label className="pos-form-label">Your Question</label>
              <textarea
                className="pos-form-textarea"
                placeholder="Describe your question or what you need help with..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows="8"
              />
              <button className="pos-submit-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Order Tracking View
  const renderOrderTracking = () => (
    <div className="pos-view-container">
      <div className="pos-view-header">
        <button className="pos-back-btn" onClick={handleBackToMenu}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Menu
        </button>
        <h2>Order Tracking</h2>
      </div>

      <div className="pos-single-panel">
        <div className="pos-form-container">
          <div className="pos-form-header">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h3>Track Your Order</h3>
              <p>Enter your order number to check status</p>
            </div>
          </div>

          <div className="pos-form-content">
            <div className="pos-form-section">
              <label className="pos-form-label">Order Number</label>
              <input
                type="text"
                className="pos-form-input"
                placeholder="ORD-2024-XXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
              <button className="pos-submit-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Track Order
              </button>
            </div>

            <div className="pos-divider">
              <span>Recent Orders</span>
            </div>

            <div className="pos-orders-list">
              {mockOrders.map((order) => (
                <div key={order.id} className="pos-order-card">
                  <div className="pos-order-header">
                    <div className="pos-order-id">{order.id}</div>
                    <div className={`pos-order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </div>
                  </div>
                  <div className="pos-order-details">
                    <div className="pos-order-detail">
                      <span className="label">Date:</span>
                      <span className="value">{order.date}</span>
                    </div>
                    <div className="pos-order-detail">
                      <span className="label">Items:</span>
                      <span className="value">{order.items} items</span>
                    </div>
                    <div className="pos-order-detail">
                      <span className="label">Total:</span>
                      <span className="value">{order.total}</span>
                    </div>
                    <div className="pos-order-detail">
                      <span className="label">ETA:</span>
                      <span className="value">{order.eta}</span>
                    </div>
                  </div>
                  <button
                    className="pos-order-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Create Ticket View
  const renderTicket = () => (
    <div className="pos-view-container">
      <div className="pos-view-header">
        <button className="pos-back-btn" onClick={handleBackToMenu}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Menu
        </button>
        <h2>Create Support Ticket</h2>
      </div>

      <div className="pos-single-panel">
        <div className="pos-form-container">
          <div className="pos-form-header">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h3>Report an Issue</h3>
              <p>Submit a support ticket for technical assistance</p>
            </div>
          </div>

          <div className="pos-form-content">
            <div className="pos-form-section">
              <label className="pos-form-label">Issue Category</label>
              <select className="pos-form-select">
                <option>Select a category...</option>
                <option>Product Quality Issue</option>
                <option>Wrong Part Received</option>
                <option>Delivery Issue</option>
                <option>Technical Support</option>
                <option>Warranty Claim</option>
                <option>Other</option>
              </select>
            </div>

            <div className="pos-form-section">
              <label className="pos-form-label">Subject</label>
              <input
                type="text"
                className="pos-form-input"
                placeholder="Brief description of the issue..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>

            <div className="pos-form-section">
              <label className="pos-form-label">Description</label>
              <textarea
                className="pos-form-textarea"
                placeholder="Please provide detailed information about the issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                rows="6"
              />
            </div>

            <div className="pos-form-section">
              <label className="pos-form-label">Priority</label>
              <div className="pos-priority-options">
                <label className="pos-radio-option">
                  <input type="radio" name="priority" value="low" defaultChecked />
                  <span>Low</span>
                </label>
                <label className="pos-radio-option">
                  <input type="radio" name="priority" value="medium" />
                  <span>Medium</span>
                </label>
                <label className="pos-radio-option">
                  <input type="radio" name="priority" value="high" />
                  <span>High</span>
                </label>
                <label className="pos-radio-option">
                  <input type="radio" name="priority" value="urgent" />
                  <span>Urgent</span>
                </label>
              </div>
            </div>

            <button className="pos-submit-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Order Details Modal
  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="pos-modal-overlay" onClick={() => setSelectedOrder(null)}>
        <div className="pos-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="pos-modal-header">
            <h2>Order Details</h2>
            <button className="pos-modal-close" onClick={() => setSelectedOrder(null)}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="pos-modal-body">
            {/* Order Summary */}
            <div className="pos-order-summary">
              <div className="pos-order-summary-row">
                <div className="pos-order-summary-item">
                  <span className="label">Order ID</span>
                  <span className="value">{selectedOrder.id}</span>
                </div>
                <div className="pos-order-summary-item">
                  <span className="label">Status</span>
                  <span className={`pos-order-status ${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <div className="pos-order-summary-row">
                <div className="pos-order-summary-item">
                  <span className="label">Order Date</span>
                  <span className="value">{selectedOrder.date}</span>
                </div>
                <div className="pos-order-summary-item">
                  <span className="label">Total Amount</span>
                  <span className="value total">{selectedOrder.total}</span>
                </div>
              </div>
              {selectedOrder.tracking && (
                <div className="pos-order-summary-row">
                  <div className="pos-order-summary-item">
                    <span className="label">Tracking Number</span>
                    <span className="value">{selectedOrder.tracking}</span>
                  </div>
                  <div className="pos-order-summary-item">
                    <span className="label">Carrier</span>
                    <span className="value">{selectedOrder.carrier}</span>
                  </div>
                </div>
              )}
              {selectedOrder.deliveredDate && (
                <div className="pos-order-summary-row">
                  <div className="pos-order-summary-item full-width">
                    <span className="label">Delivered</span>
                    <span className="value delivered">{selectedOrder.deliveredDate}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            <div className="pos-tracking-section">
              <h3>Tracking Status</h3>
              <div className="pos-tracking-timeline">
                {selectedOrder.trackingSteps.map((step, index) => (
                  <div key={index} className={`pos-tracking-step ${step.completed ? 'completed' : 'pending'}`}>
                    <div className="pos-tracking-dot">
                      {step.completed ? (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="pos-tracking-dot-empty"></div>
                      )}
                    </div>
                    <div className="pos-tracking-content">
                      <div className="pos-tracking-status">{step.status}</div>
                      <div className="pos-tracking-location">{step.location}</div>
                      <div className="pos-tracking-date">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="pos-items-section">
              <h3>Order Items ({selectedOrder.items} items)</h3>
              <div className="pos-items-list">
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="pos-item-row">
                    <div className="pos-item-info">
                      <div className="pos-item-name">{item.name}</div>
                      <div className="pos-item-code">Part #: {item.code}</div>
                    </div>
                    <div className="pos-item-qty">Qty: {item.qty}</div>
                    <div className="pos-item-price">{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="pos-items-total">
                <span>Order Total:</span>
                <span className="total-amount">{selectedOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pos-portal">
      <div className="pos-header">
        <div className="pos-logo">
          <img src="/assets/mack-logo.png" alt="Mack" className="pos-logo-img" />
          <div>
            <div className="pos-title">MACK PARTS</div>
            <div className="pos-subtitle">Point of Sale Terminal</div>
          </div>
        </div>
      </div>

      <div className="pos-main">
        {currentView === 'menu' && renderMenu()}
        {currentView === 'product' && renderProductSearch()}
        {currentView === 'question' && renderQuestion()}
        {currentView === 'order' && renderOrderTracking()}
        {currentView === 'ticket' && renderTicket()}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && renderOrderDetailsModal()}
    </div>
  );
}

export default PoSPortal;
