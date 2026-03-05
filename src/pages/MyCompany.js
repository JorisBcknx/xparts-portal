import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyCompany.css';

function MyCompany() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const organizationSections = [
    {
      id: 'users',
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: (
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 8,
      path: '/my-company/users'
    },
    {
      id: 'user-groups',
      title: 'User Groups',
      description: 'Organize users into groups with specific permissions',
      icon: (
        <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C7.88236 14.8234 9.3163 14 11 14H13C14.6837 14 16.1176 14.8234 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 4,
      path: '/my-company/user-groups'
    },
    {
      id: 'cost-centers',
      title: 'Cost Centers',
      description: 'Manage departmental budgets and spending',
      icon: (
        <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M14 21V16C14 15.4477 13.5523 15 13 15H11C10.4477 15 10 15.4477 10 16V21M14 21H10M9 6H10M9 9H10M14 6H15M14 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 5,
      path: '/my-company/cost-centers'
    },
    {
      id: 'budgets',
      title: 'Budgets',
      description: 'Set and monitor spending limits',
      icon: (
        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 3,
      path: '/my-company/budgets'
    },
    {
      id: 'purchase-limits',
      title: 'Purchase Limits',
      description: 'Define transaction and order limits',
      icon: (
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 6,
      path: '/my-company/purchase-limits'
    },
    {
      id: 'addresses',
      title: 'Addresses',
      description: 'Manage company shipping and billing addresses',
      icon: (
        <>
          <path d="M17.657 16.657L13.414 20.9C13.039 21.275 12.5306 21.4854 12.0005 21.4854C11.4704 21.4854 10.962 21.275 10.587 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3 12 3C13.5822 3 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657V16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ),
      count: 12,
      path: '/my-company/addresses'
    },
    {
      id: 'approvals',
      title: 'Approval Processes',
      description: 'Configure order approval workflows',
      icon: (
        <path d="M9 12L11 14L15 10M3 5H21M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 2,
      path: '/my-company/approvals'
    },
    {
      id: 'units',
      title: 'Units',
      description: 'Organizational structure and hierarchy',
      icon: (
        <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H21M19 21H14M5 21H3M5 21H10M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14M9 6H10M9 9H10M9 12H10M14 6H15M14 9H15M14 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ),
      count: 3,
      path: '/my-company/units'
    }
  ];

  const companyStats = {
    name: user?.company || 'Rustic Hardware',
    accountNumber: user?.accountNumber || 'RH-10234',
    activeUsers: 8,
    pendingApprovals: 3,
    monthlySpend: 45678.90,
    budgetUtilization: 67
  };

  return (
    <div className="my-company-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>My Company</h1>
          <p className="page-subtitle">Manage your organization and team members</p>
        </div>
      </div>

      {/* Company Overview Card */}
      <div className="company-overview-card">
        <div className="company-header">
          <div className="company-logo-circle">
            <span>{companyStats.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="company-info">
            <h2>{companyStats.name}</h2>
            <p className="company-account">Account #: {companyStats.accountNumber}</p>
          </div>
        </div>

        <div className="company-stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{companyStats.activeUsers}</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon approvals">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{companyStats.pendingApprovals}</div>
              <div className="stat-label">Pending Approvals</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon spending">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">${(companyStats.monthlySpend / 1000).toFixed(1)}k</div>
              <div className="stat-label">Monthly Spend</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon budget">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19V6L16 12L9 19Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{companyStats.budgetUtilization}%</div>
              <div className="stat-label">Budget Used</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${companyStats.budgetUtilization}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Sections */}
      <div className="organization-sections">
        <h2>Organization Management</h2>
        <div className="sections-grid">
          {organizationSections.map(section => (
            <div
              key={section.id}
              className="section-card"
              onClick={() => navigate(section.path)}
            >
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {section.icon}
                </svg>
              </div>
              <div className="section-content">
                <div className="section-header">
                  <h3>{section.title}</h3>
                  <span className="section-count">{section.count}</span>
                </div>
                <p>{section.description}</p>
              </div>
              <div className="section-arrow">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyCompany;
