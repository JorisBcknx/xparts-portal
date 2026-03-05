import React from 'react';
import './Customers.css';

function Customers() {
  const customers = [
    { id: 'CUST-001', name: 'ABC Logistics', contact: 'Michael Chen', email: 'orders@abclogistics.com', phone: '+1 (555) 123-4567', totalOrders: 142, totalSpent: '$45,890', lastOrder: '2024-03-02', status: 'Active' },
    { id: 'CUST-002', name: 'FastFreight Inc', contact: 'Sarah Johnson', email: 'purchasing@fastfreight.com', phone: '+1 (555) 234-5678', totalOrders: 98, totalSpent: '$32,450', lastOrder: '2024-03-02', status: 'Active' },
    { id: 'CUST-003', name: 'Metro Transport', contact: 'David Rodriguez', email: 'parts@metrotrans.com', phone: '+1 (555) 345-6789', totalOrders: 156, totalSpent: '$58,920', lastOrder: '2024-03-01', status: 'Active' },
    { id: 'CUST-004', name: 'Highway Haulers', contact: 'Emily Wilson', email: 'supply@highwayhaulers.com', phone: '+1 (555) 456-7890', totalOrders: 203, totalSpent: '$78,340', lastOrder: '2024-03-01', status: 'VIP' },
    { id: 'CUST-005', name: 'City Express', contact: 'James Brown', email: 'orders@cityexpress.com', phone: '+1 (555) 567-8901', totalOrders: 87, totalSpent: '$28,670', lastOrder: '2024-02-29', status: 'Active' },
    { id: 'CUST-006', name: 'Rapid Routes', contact: 'Lisa Martinez', email: 'procurement@rapidroutes.com', phone: '+1 (555) 678-9012', totalOrders: 45, totalSpent: '$15,230', lastOrder: '2024-02-29', status: 'Active' },
    { id: 'CUST-007', name: 'Global Freight Co', contact: 'Robert Taylor', email: 'parts@globalfreight.com', phone: '+1 (555) 789-0123', totalOrders: 178, totalSpent: '$65,780', lastOrder: '2024-02-28', status: 'VIP' }
  ];

  const getStatusClass = (status) => {
    return status === 'VIP' ? 'status-vip' : 'status-active';
  };

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Customer Management</h1>
          <p className="page-subtitle">Manage your B2B customer relationships</p>
        </div>
        <button className="primary-button">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add New Customer
        </button>
      </div>

      <div className="customers-stats">
        <div className="stat-card-lg">
          <div className="stat-card-icon" style={{ backgroundColor: '#007bff' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total Customers</div>
            <div className="stat-card-value">847</div>
            <div className="stat-card-change positive">+12.5% from last month</div>
          </div>
        </div>

        <div className="stat-card-lg">
          <div className="stat-card-icon" style={{ backgroundColor: '#ffc107' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">VIP Customers</div>
            <div className="stat-card-value">142</div>
            <div className="stat-card-change positive">+8 new VIPs</div>
          </div>
        </div>

        <div className="stat-card-lg">
          <div className="stat-card-icon" style={{ backgroundColor: '#00a86b' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Active This Month</div>
            <div className="stat-card-value">634</div>
            <div className="stat-card-change positive">74.9% activity rate</div>
          </div>
        </div>
      </div>

      <div className="customers-container">
        <div className="customers-filters">
          <div className="search-filter-wide">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search customers by name, email, or phone..." />
          </div>
          <div className="filter-buttons">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Active</button>
            <button className="filter-btn">VIP</button>
            <button className="filter-btn">Inactive</button>
          </div>
        </div>

        <div className="customers-grid">
          {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">
                  {customer.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div className="customer-main">
                  <h3>{customer.name}</h3>
                  <span className={`customer-status ${getStatusClass(customer.status)}`}>
                    {customer.status === 'VIP' && '⭐ '}
                    {customer.status}
                  </span>
                </div>
              </div>

              <div className="customer-details">
                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{customer.contact}</span>
                </div>

                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{customer.email}</span>
                </div>

                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{customer.phone}</span>
                </div>
              </div>

              <div className="customer-stats">
                <div className="customer-stat">
                  <div className="stat-value-sm">{customer.totalOrders}</div>
                  <div className="stat-label-sm">Orders</div>
                </div>
                <div className="customer-stat">
                  <div className="stat-value-sm">{customer.totalSpent}</div>
                  <div className="stat-label-sm">Total Spent</div>
                </div>
                <div className="customer-stat">
                  <div className="stat-value-sm">{customer.lastOrder}</div>
                  <div className="stat-label-sm">Last Order</div>
                </div>
              </div>

              <div className="customer-actions">
                <button className="customer-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  View Profile
                </button>
                <button className="customer-btn primary">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Send Email
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customers;
