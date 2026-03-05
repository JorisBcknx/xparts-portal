import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyPurchaseLimits.css';

function CompanyPurchaseLimits() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const purchaseLimits = [
    {
      id: 1,
      user: 'Linda Wolf',
      email: 'linda.wolf@rustic-hw.com',
      role: 'Company Administrator',
      orderLimit: null, // Unlimited
      transactionLimit: null, // Unlimited
      dailyLimit: null, // Unlimited
      requiresApproval: false,
      status: 'Active'
    },
    {
      id: 2,
      user: 'Mark Rivers',
      email: 'mark.rivers@rustic-hw.com',
      role: 'Dealer',
      orderLimit: null, // No limits
      transactionLimit: null, // No limits
      dailyLimit: null, // No limits
      requiresApproval: false,
      status: 'Active'
    },
    {
      id: 3,
      user: 'John Smith',
      email: 'john.smith@rustic-hw.com',
      role: 'Purchaser',
      orderLimit: 50000,
      transactionLimit: 10000,
      dailyLimit: 25000,
      requiresApproval: true,
      approvalThreshold: 10000,
      status: 'Active'
    },
    {
      id: 4,
      user: 'Sarah Johnson',
      email: 'sarah.johnson@rustic-hw.com',
      role: 'Approver',
      orderLimit: 100000,
      transactionLimit: 25000,
      dailyLimit: 50000,
      requiresApproval: false,
      status: 'Active'
    },
    {
      id: 5,
      user: 'Michael Brown',
      email: 'michael.brown@rustic-hw.com',
      role: 'Purchaser',
      orderLimit: 25000,
      transactionLimit: 5000,
      dailyLimit: 15000,
      requiresApproval: true,
      approvalThreshold: 5000,
      status: 'Active'
    },
    {
      id: 6,
      user: 'Emily Davis',
      email: 'emily.davis@rustic-hw.com',
      role: 'Viewer',
      orderLimit: 0,
      transactionLimit: 0,
      dailyLimit: 0,
      requiresApproval: true,
      status: 'Inactive'
    }
  ];

  const filteredLimits = purchaseLimits.filter(limit =>
    limit.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    limit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    limit.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Unlimited';
    if (amount === 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getLimitBadgeClass = (limit) => {
    if (limit === null) return 'unlimited';
    if (limit === 0) return 'none';
    if (limit >= 50000) return 'high';
    if (limit >= 10000) return 'medium';
    return 'low';
  };

  return (
    <div className="company-purchase-limits-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="back-button" onClick={() => navigate('/my-company')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to My Company
          </button>
          <h1>Purchase Limits</h1>
          <p className="page-subtitle">Define transaction and order limits per user</p>
        </div>
      </div>

      {/* Search */}
      <div className="purchase-limits-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by user, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Purchase Limits List */}
      <div className="purchase-limits-list">
        {filteredLimits.map(limit => (
          <div key={limit.id} className="purchase-limit-card">
            <div className="limit-card-header">
              <div className="user-avatar-large">
                {limit.user.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="user-info">
                <h3>{limit.user}</h3>
                <p className="user-email">{limit.email}</p>
                <span className={`role-badge ${limit.role.toLowerCase().replace(' ', '-')}`}>
                  {limit.role}
                </span>
              </div>
              <div className="limit-actions">
                <button className="icon-btn" title="Edit limits">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.8789 20 1.8789C20.5626 1.8789 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1211 3.43741 22.1211 4C22.1211 4.56259 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="limits-grid">
              <div className="limit-item">
                <div className="limit-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="limit-content">
                  <div className="limit-label">Per Order Limit</div>
                  <div className={`limit-value ${getLimitBadgeClass(limit.orderLimit)}`}>
                    {formatCurrency(limit.orderLimit)}
                  </div>
                </div>
              </div>

              <div className="limit-item">
                <div className="limit-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="limit-content">
                  <div className="limit-label">Per Transaction</div>
                  <div className={`limit-value ${getLimitBadgeClass(limit.transactionLimit)}`}>
                    {formatCurrency(limit.transactionLimit)}
                  </div>
                </div>
              </div>

              <div className="limit-item">
                <div className="limit-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="limit-content">
                  <div className="limit-label">Daily Limit</div>
                  <div className={`limit-value ${getLimitBadgeClass(limit.dailyLimit)}`}>
                    {formatCurrency(limit.dailyLimit)}
                  </div>
                </div>
              </div>
            </div>

            {limit.requiresApproval && (
              <div className="approval-info">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  Requires approval for orders above {formatCurrency(limit.approvalThreshold || 0)}
                </span>
              </div>
            )}

            {(limit.orderLimit === null && limit.transactionLimit === null) && (
              <div className="unlimited-badge">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>No Purchase Limits Applied</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyPurchaseLimits;
