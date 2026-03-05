import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyBudgets.css';

function CompanyBudgets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const budgets = [
    {
      id: 1,
      code: 'BDG-2026-HQ',
      name: 'Headquarters Annual Budget',
      amount: 500000,
      spent: 304567.50,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      currency: 'USD',
      unit: 'Headquarters',
      costCenters: ['Marketing', 'Operations', 'Administration'],
      status: 'Active'
    },
    {
      id: 2,
      code: 'BDG-2026-PROC',
      name: 'Procurement Department Budget',
      amount: 750000,
      spent: 523450.75,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      currency: 'USD',
      unit: 'Procurement',
      costCenters: ['Parts Purchasing', 'Equipment'],
      status: 'Active'
    },
    {
      id: 3,
      code: 'BDG-2026-MAINT',
      name: 'Maintenance Budget Q1',
      amount: 125000,
      spent: 125000,
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      currency: 'USD',
      unit: 'Maintenance',
      costCenters: ['Vehicle Maintenance', 'Facility Maintenance'],
      status: 'Exhausted'
    }
  ];

  const filteredBudgets = budgets.filter(budget =>
    budget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    budget.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculatePercentage = (spent, total) => {
    return Math.min((spent / total) * 100, 100);
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#10b981';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="company-budgets-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="back-button" onClick={() => navigate('/my-company')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to My Company
          </button>
          <h1>Budgets</h1>
          <p className="page-subtitle">Monitor spending limits and budget utilization</p>
        </div>
        <button className="add-budget-btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create Budget
        </button>
      </div>

      {/* Search */}
      <div className="budgets-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Budgets List */}
      <div className="budgets-list">
        {filteredBudgets.map(budget => {
          const percentage = calculatePercentage(budget.spent, budget.amount);
          const remaining = budget.amount - budget.spent;

          return (
            <div key={budget.id} className="budget-card">
              <div className="budget-header">
                <div className="budget-main-info">
                  <h3>{budget.name}</h3>
                  <p className="budget-code">{budget.code}</p>
                  <span className={`status-badge ${getStatusClass(budget.status)}`}>
                    {budget.status}
                  </span>
                </div>
                <div className="budget-actions">
                  <button className="icon-btn" title="Edit budget">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.8789 20 1.8789C20.5626 1.8789 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1211 3.43741 22.1211 4C22.1211 4.56259 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="budget-details">
                <div className="budget-period">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </div>
                <div className="budget-unit">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {budget.unit}
                </div>
              </div>

              <div className="budget-cost-centers">
                <strong>Cost Centers:</strong>
                <div className="cost-center-tags">
                  {budget.costCenters.map((cc, idx) => (
                    <span key={idx} className="cost-center-tag">{cc}</span>
                  ))}
                </div>
              </div>

              <div className="budget-amounts">
                <div className="amount-row">
                  <span className="label">Total Budget:</span>
                  <span className="value total">{formatCurrency(budget.amount)}</span>
                </div>
                <div className="amount-row">
                  <span className="label">Spent:</span>
                  <span className="value spent">{formatCurrency(budget.spent)}</span>
                </div>
                <div className="amount-row">
                  <span className="label">Remaining:</span>
                  <span className={`value remaining ${remaining < 0 ? 'negative' : ''}`}>
                    {formatCurrency(Math.abs(remaining))}
                    {remaining < 0 && ' (Over budget)'}
                  </span>
                </div>
              </div>

              <div className="budget-progress">
                <div className="progress-header">
                  <span>Utilization</span>
                  <span className="percentage">{percentage.toFixed(1)}%</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      background: getProgressColor(percentage)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompanyBudgets;
