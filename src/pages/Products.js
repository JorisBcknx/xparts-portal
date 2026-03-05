import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import './Products.css';

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts, searchResults, searchQuery } = useSearch();
  const [filter, setFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');

  // Use search results if there's a query, otherwise show all products
  const baseProducts = searchQuery ? searchResults : allProducts;

  // Extract unique categories
  const categories = ['all', ...new Set(allProducts.flatMap(p =>
    p.categories.split(',').map(c => c.trim())
  ))].sort();

  // Filter by category and local search
  const filteredProducts = baseProducts.filter(product => {
    const matchesCategory = filter === 'all' || product.categories.includes(filter);
    const matchesLocalSearch = !localSearch ||
      product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.code.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.categories.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCategory && matchesLocalSearch;
  });

  // Scroll to product if coming from search
  useEffect(() => {
    if (location.state?.selectedProduct) {
      setTimeout(() => {
        const element = document.getElementById(`product-${location.state.selectedProduct}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-product');
          setTimeout(() => element.classList.remove('highlight-product'), 2000);
        }
      }, 100);
    }
  }, [location]);

  const getStatusFromStock = (stock) => {
    if (stock < 20) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Mack Genuine Parts Catalog</h1>
          <p className="page-subtitle">
            {searchQuery
              ? `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : 'Browse and manage authentic Mack truck parts inventory'
            }
          </p>
        </div>
        <div className="header-buttons">
          <button className="quick-order-button" onClick={() => navigate('/quick-order')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Quick Order
          </button>
          <button className="primary-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-tabs">
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat}
              className={`filter-tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        <div className="search-filter">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Filter by part name, OEM number, or category..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.code} id={`product-${product.code}`} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} className="product-img" />
              <span className={`stock-badge ${getStatusFromStock(product.stock) === 'Low Stock' ? 'low' : 'in-stock'}`}>
                {getStatusFromStock(product.stock)}
              </span>
            </div>

            <div className="product-details">
              <div className="product-category">{product.categories.split(',')[0]}</div>
              <h3 className="product-title">{product.name}</h3>

              <div className="product-specs">
                <div className="spec-item">
                  <span className="spec-label">OEM:</span>
                  <span className="spec-value">{product.code}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Stock:</span>
                  <span className="spec-value">{product.stock} units</span>
                </div>
              </div>

              <div className="product-footer">
                <div className="product-price">${product.price.toFixed(2)}</div>
                <div className="product-stock">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {product.stock} available
                </div>
              </div>

              <div className="product-actions">
                <button className="secondary-button">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit
                </button>
                <button className="action-button" onClick={() => navigate(`/product/${product.code}`)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

export default Products;
