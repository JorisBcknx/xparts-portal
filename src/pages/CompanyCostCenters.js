import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyCostCenters.css';

function CompanyCostCenters() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const costCenters = [
    {
      id: 1,
      code: 'CC-001',
      name: 'Marketing',
      unit: 'Headquarters',
      budget: 'BDG-2026-HQ',
      manager: 'Sarah Johnson',
      monthlySpend: 12450.50,
      yearlyBudget: 150000,
      activeUsers: 3,
      status: 'Active'
    },
    {
      id: 2,
      code: 'CC-002',
      name: 'Operations',
      unit: 'Headquarters',
      budget: 'BDG-2026-HQ',
      manager: 'Mark Rivers',
      monthlySpend: 28750.00,
      yearlyBudget: 200000,
      activeUsers: 5,
      status: 'Active'
    },
    {
      id: 3,
      code: 'CC-003',
      name: 'Parts Purchasing',
      unit: 'Procurement',
      budget: 'BDG-2026-PROC',
      manager: 'John Smith',
      monthlySpend: 45890.25,
      yearlyBudget: 500000,
      activeUsers: 4,
      status: 'Active'
    },
    {
      id: 4,
      code: 'CC-004',
      name: 'Vehicle Maintenance',
      unit: 'Maintenance',
      budget: 'BDG-2026-MAINT',
      manager: 'Robert Wilson',
      monthlySpend: 8920.75,
      yearlyBudget: 75000,
      activeUsers: 2,
      status: 'Active'
    },
    {
      id: 5,
      code: 'CC-005',
      name: 'Administration',
      unit: 'Headquarters',
      budget: 'BDG-2026-HQ',
      manager: 'Linda Wolf',
      monthlySpend: 6540.00,
      yearlyBudget: 80000,
      activeUsers: 3,
      status: 'Active'
    }
  ];

  const filteredCostCenters = costCenters.filter(cc =>
    cc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cc.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateUtilization = (monthlySpend, yearlyBudget) => {
    const currentMonth = new Date().getMonth() + 1; // March = 3
    const actualSpend = monthlySpend * currentMonth; // Total spent so far (3 months)
    return Math.min((actualSpend / yearlyBudget) * 100, 100); // Percentage of yearly budget used
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="company-cost-centers-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="back-button" onClick={() => navigate('/my-company')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to My Company
          </button>
          <h1>Cost Centers</h1>
          <p className="page-subtitle">Manage departmental budgets and spending</p>
        </div>
        <button className="add-cost-center-btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create Cost Center
        </button>
      </div>

      {/* Search */}
      <div className="cost-centers-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search cost centers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Cost Centers List */}
      <div className="cost-centers-list">
        {filteredCostCenters.map(cc => {
          const utilization = calculateUtilization(cc.monthlySpend, cc.yearlyBudget);

          return (
            <div key={cc.id} className="cost-center-card">
              <div className="cost-center-header">
                <div className="cost-center-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10M9 6H10M9 9H10M14 6H15M14 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="cost-center-main-info">
                  <h3>{cc.name}</h3>
                  <p className="cost-center-code">{cc.code}</p>
                </div>
                <div className="cost-center-actions">
                  <button className="icon-btn" title="Edit cost center">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.8789 20 1.8789C20.5626 1.8789 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1211 3.43741 22.1211 4C22.1211 4.56259 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="cost-center-details">
                <div className="detail-row">
                  <span className="label">Unit:</span>
                  <span className="value">{cc.unit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Manager:</span>
                  <span className="value">{cc.manager}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Budget:</span>
                  <span className="value budget-ref">{cc.budget}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Active Users:</span>
                  <span className="value">{cc.activeUsers}</span>
                </div>
              </div>

              <div className="cost-center-spending">
                <div className="spending-row">
                  <span className="label">Monthly Spend:</span>
                  <span className="value">{formatCurrency(cc.monthlySpend)}</span>
                </div>
                <div className="spending-row">
                  <span className="label">Yearly Budget:</span>
                  <span className="value">{formatCurrency(cc.yearlyBudget)}</span>
                </div>
              </div>

              <div className="cost-center-progress">
                <div className="progress-header">
                  <span>Budget Utilization (YTD)</span>
                  <span className="percentage">{utilization.toFixed(1)}%</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${utilization}%`,
                      background: getUtilizationColor(utilization)
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

export default CompanyCostCenters;
