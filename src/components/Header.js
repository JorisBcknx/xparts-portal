import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useASM } from '../context/ASMContext';
import { useAuth } from '../context/AuthContext';
import ASMLogin from './ASMLogin';
import WelcomeTour from './WelcomeTour';
import './Header.css';

function Header({ onMenuClick, onViewToggle, isPosView }) {
  const navigate = useNavigate();
  const { searchQuery, searchResults, performSearch, clearSearch, isSearching, useAPI, toggleDataSource } = useSearch();
  const { getCartCount } = useCart();
  const { asmActive } = useASM();
  const { user, logout } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showASMLogin, setShowASMLogin] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    performSearch(query);
    setShowResults(query.length >= 2);
  };

  const handleResultClick = (product) => {
    setShowResults(false);
    clearSearch();
    navigate(`/product/${product.code}`);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length >= 2) {
      setShowResults(true);
    }
  };

  const accountMenuItems = [
    { label: 'Personal Details', icon: 'user', path: '/account/profile' },
    { label: 'Addresses', icon: 'location', path: '/account/addresses' },
    { label: 'Payment Details', icon: 'card', path: '/account/payment' },
    { label: 'Order History', icon: 'orders', path: '/account/orders' },
    { label: 'Quotes', icon: 'quote', path: '/account/quotes' },
    { label: 'Saved Carts', icon: 'cart', path: '/account/carts' },
    ...(user?.email === 'linda.wolf@rustic-hw.com' ? [
      { label: 'My Company', icon: 'company', path: '/my-company', divider: true }
    ] : []),
    { label: 'Consent Management', icon: 'shield', path: '/account/consent' },
    { label: 'Sign Out', icon: 'logout', path: '/logout', divider: !user || user?.email !== 'linda.wolf@rustic-hw.com' }
  ];

  const handleAccountMenuClick = (item) => {
    setShowAccountMenu(false);
    if (item.path === '/logout') {
      // Handle logout
      logout();
    } else {
      navigate(item.path);
    }
  };

  const getMenuIcon = (iconName) => {
    const icons = {
      user: (
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      location: (
        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      card: (
        <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      orders: (
        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      quote: (
        <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      cart: (
        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      company: (
        <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10M9 6H10M9 9H10M9 12H10M14 6H15M14 9H15M14 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      shield: (
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      logout: (
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )
    };
    return icons[iconName] || icons.user;
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="logo">
          <img src="/assets/XParts logo.png" alt="XParts Portal" className="logo-image" />
          <div className="logo-text">
            <span className="logo-title">XPARTS</span>
            <span className="logo-subtitle">PORTAL</span>
          </div>
        </div>
      </div>

      <div className="header-center" ref={searchRef}>
        <div className="search-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search genuine parts, OEM numbers..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => { clearSearch(); setShowResults(false); }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {showResults && (
          <div className="search-results-dropdown">
            {isSearching ? (
              <div className="search-loading">
                <div className="spinner"></div>
                <p>Searching {useAPI ? 'SAP Commerce' : 'local database'}...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="search-results-header">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                <div className="search-results-list">
                  {searchResults.slice(0, 8).map((product) => (
                    <div
                      key={product.code}
                      className="search-result-item"
                      onClick={() => handleResultClick(product)}
                    >
                      <img src={product.image} alt={product.name} className="search-result-image" />
                      <div className="search-result-info">
                        <div className="search-result-name">{product.name}</div>
                        <div className="search-result-code">OEM: {product.code}</div>
                        <div className="search-result-category">{product.categories}</div>
                      </div>
                      <div className="search-result-price">
                        {product.priceFormatted ||
                         product.price?.formattedValue ||
                         (typeof product.price === 'number' ? `$${product.price.toFixed(2)}` :
                          product.price?.value ? `$${product.price.value.toFixed(2)}` : '$0.00')}
                      </div>
                    </div>
                  ))}
                </div>
                {searchResults.length > 8 && (
                  <div className="search-results-footer" onClick={() => { navigate('/products'); setShowResults(false); }}>
                    View all {searchResults.length} results →
                  </div>
                )}
              </>
            ) : (
              <div className="search-no-results">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>No parts found for "{searchQuery}"</p>
                <span>Try searching by OEM number, part name, or category</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="header-right">
        {onViewToggle && (
          <div className="view-toggle" title={isPosView ? 'Switch to Full Portal' : 'Switch to Point of Sale'}>
            <button className="toggle-button" onClick={onViewToggle}>
              {isPosView ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H10V10H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 3H21V10H14V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14H21V21H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 14H10V21H3V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="api-label">FULL</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 9V21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="api-label">POS</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="api-toggle" title={useAPI ? 'Using SAP Commerce API' : 'Using Local Data'}>
          <button className="toggle-button" onClick={toggleDataSource}>
            {useAPI ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12H22" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="api-label">API</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="api-label">LOCAL</span>
              </>
            )}
          </button>
        </div>

        <div className="asm-toggle" title="Assisted Service Module">
          <button className={`toggle-button asm-button ${asmActive ? 'active' : ''}`} onClick={() => setShowASMLogin(true)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="api-label">{asmActive ? 'ASM ON' : 'ASM'}</span>
          </button>
        </div>

        <button className="tour-button" onClick={() => setShowWelcomeTour(true)} title="Take a Welcome Tour">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.663 17H4C2.343 17 1 15.657 1 14V4C1 2.343 2.343 1 4 1H14C15.657 1 17 2.343 17 4V9.663M12 23L15.878 14.879L23.001 12L14.879 8.121L12 0L9.121 8.121L1 12L9.121 15.879L12 23Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Tour
        </button>

        <button className="icon-button" data-tour="cart" onClick={() => navigate('/cart')} title="Shopping Cart">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {getCartCount() > 0 && <span className="badge">{getCartCount()}</span>}
        </button>

        <div className="user-menu" ref={accountRef} data-tour="account">
          <div className="user-avatar" onClick={() => setShowAccountMenu(!showAccountMenu)}>
            <span>{user?.avatar || 'U'}</span>
          </div>
          <div className="user-info" onClick={() => setShowAccountMenu(!showAccountMenu)}>
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'Member'}</span>
          </div>

          {showAccountMenu && (
            <div className="account-dropdown">
              <div className="account-dropdown-header">
                <div className="account-dropdown-avatar">{user?.avatar || 'U'}</div>
                <div className="account-dropdown-info">
                  <div className="account-dropdown-name">{user?.name || 'User'}</div>
                  <div className="account-dropdown-email">{user?.email || ''}</div>
                </div>
              </div>
              <div className="account-dropdown-divider"></div>
              <div className="account-dropdown-menu">
                {accountMenuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.divider && <div className="account-dropdown-divider"></div>}
                    <div
                      className={`account-menu-item ${item.path === '/logout' ? 'logout' : ''}`}
                      onClick={() => handleAccountMenuClick(item)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {getMenuIcon(item.icon)}
                      </svg>
                      <span>{item.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ASMLogin isOpen={showASMLogin} onClose={() => setShowASMLogin(false)} />
      {showWelcomeTour && <WelcomeTour onClose={() => setShowWelcomeTour(false)} />}
    </header>
  );
}

export default Header;
