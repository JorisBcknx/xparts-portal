import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const heroSlides = [
    {
      image: '/assets/showroom.png',
      title: 'Genuine Parts',
      subtitle: 'Built to Last, Designed to Perform'
    },
    {
      image: '/assets/hero-trucks.png',
      title: 'Premium Quality Parts',
      subtitle: 'For Your Entire Fleet'
    },
    {
      image: '/assets/dealer-repair.jpg',
      title: 'Expert Service & Support',
      subtitle: 'Professional Maintenance Solutions'
    }
  ];

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentSlide + 1) % heroSlides.length;
      setNextSlide(next);
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentSlide(next);
        setIsTransitioning(false);
        setNextSlide(null);
      }, 800); // Match CSS animation duration
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide, heroSlides.length]);

  const stats = [
    { label: 'Total Orders', value: '1,284', change: '+12.5%', trend: 'up', color: '#d4af37' },
    { label: 'Revenue', value: '$124,590', change: '+8.2%', trend: 'up', color: '#00a86b' },
    { label: 'Active Customers', value: '847', change: '+5.1%', trend: 'up', color: '#1a1a1a' },
    { label: 'Low Stock Items', value: '23', change: '-3', trend: 'down', color: '#dc3545' }
  ];

  const recentOrders = [
    { id: 'ORD-2847', customer: 'ABC Logistics', parts: 'Brake Pads Set', amount: '$459', status: 'Shipped', date: '2024-03-02' },
    { id: 'ORD-2846', customer: 'FastFreight Inc', parts: 'Air Filter Kit', amount: '$189', status: 'Processing', date: '2024-03-02' },
    { id: 'ORD-2845', customer: 'Metro Transport', parts: 'Oil Filter, Fuel Filter', amount: '$324', status: 'Delivered', date: '2024-03-01' },
    { id: 'ORD-2844', customer: 'Highway Haulers', parts: 'Suspension Kit', amount: '$1,240', status: 'Shipped', date: '2024-03-01' },
    { id: 'ORD-2843', customer: 'City Express', parts: 'Wiper Blades Set', amount: '$78', status: 'Delivered', date: '2024-02-29' }
  ];

  const topProducts = [
    { name: 'Brake Pad Set - Premium', sales: 245, stock: 1240, trend: 'up' },
    { name: 'Engine Oil Filter', sales: 198, stock: 890, trend: 'up' },
    { name: 'Air Filter Kit', sales: 156, stock: 450, trend: 'down' },
    { name: 'Fuel Filter Assembly', sales: 142, stock: 620, trend: 'up' },
    { name: 'Cabin Air Filter', sales: 128, stock: 380, trend: 'up' }
  ];

  const getStatusClass = (status) => {
    const statusMap = {
      'Shipped': 'status-shipped',
      'Processing': 'status-processing',
      'Delivered': 'status-delivered',
      'Pending': 'status-pending'
    };
    return statusMap[status] || '';
  };

  const handleSlideChange = (index) => {
    if (index !== currentSlide && !isTransitioning) {
      setNextSlide(index);
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
        setNextSlide(null);
      }, 800); // Match CSS animation duration
    }
  };

  return (
    <div className="dashboard">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        {/* Current Slide */}
        <div
          className={`carousel-slide ${isTransitioning ? 'sliding-out' : ''}`}
          style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
        >
          <div className="carousel-overlay"></div>
          <div className="carousel-content">
            <h1 className="carousel-title">{heroSlides[currentSlide].title}</h1>
            <p className="carousel-subtitle">{heroSlides[currentSlide].subtitle}</p>
            <button className="carousel-button">Shop Now</button>
          </div>
        </div>

        {/* Next Slide (only visible during transition) */}
        {nextSlide !== null && (
          <div
            className="carousel-slide sliding-in"
            style={{ backgroundImage: `url(${heroSlides[nextSlide].image})` }}
          >
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              <h1 className="carousel-title">{heroSlides[nextSlide].title}</h1>
              <p className="carousel-subtitle">{heroSlides[nextSlide].subtitle}</p>
              <button className="carousel-button">Shop Now</button>
            </div>
          </div>
        )}

        {/* Indicators */}
        <div className="carousel-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            ></button>
          ))}
        </div>
      </div>

      <div className="page-header">
        <div>
          <h1>Dealer Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your dealership today.</p>
        </div>
        <button className="primary-button">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Order
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {index === 0 && (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {index === 1 && (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {index === 2 && (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 1.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15H17M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {index === 3 && (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                <span className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                </span>
              </div>
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ backgroundColor: stat.color, width: '70%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meritor Discount Banner */}
      <div className="promo-banner">
        <div className="promo-banner-header">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          <span className="promo-text">Enjoy a <strong>10% Discount</strong> on Meritor Premium Products!</span>
          <div className="promo-badge">LIMITED TIME</div>
        </div>
        <img
          src="/assets/meritor-banner.png"
          alt="Meritor Premium Discount - Save on genuine parts"
          className="promo-banner-image"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card wide">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <button className="text-button">View All</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Parts</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td className="customer-name">{order.customer}</td>
                    <td>{order.parts}</td>
                    <td className="amount">{order.amount}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="date">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Top Products</h2>
            <button className="text-button">View All</button>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <div className="product-rank">{index + 1}</div>
                  <div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">{product.sales} sales · {product.stock} in stock</div>
                  </div>
                </div>
                <div className={`product-trend ${product.trend}`}>
                  {product.trend === 'up' ? '↑' : '↓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/quotes')}>
            <div className="action-icon" style={{ backgroundColor: '#d4af37' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>View Quotes</span>
          </button>
          <button className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#ff6b00' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Create Order</span>
          </button>
          <button className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#00a86b' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Add Product</span>
          </button>
          <button className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#007bff' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Add Customer</span>
          </button>
          <button className="action-card">
            <div className="action-icon" style={{ backgroundColor: '#6c757d' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19V6L21 12L9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
