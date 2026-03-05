import React, { useState } from 'react';
import { useASM } from '../context/ASMContext';
import './ASMCustomerSelection.css';

function ASMCustomerSelection({ isOpen, onClose }) {
  const { selectCustomer, endASMSession } = useASM();
  const [searchQuery, setSearchQuery] = useState('');

  // Customer options - Mark Rivers is the only one that fully works
  const customers = [
    {
      id: 1,
      email: 'mark.rivers@rustic-hw.com',
      name: 'Mark Rivers',
      company: 'Rustic Hardware',
      role: 'Admin',
      accountNumber: 'RH-10234',
      status: 'Active',
      isFullyFunctional: true
    },
    {
      id: 2,
      email: 'sarah.chen@buildpro.com',
      name: 'Sarah Chen',
      company: 'BuildPro Construction',
      role: 'Buyer',
      accountNumber: 'BP-20891',
      status: 'Active',
      isFullyFunctional: false
    },
    {
      id: 3,
      email: 'james.wilson@megafleet.com',
      name: 'James Wilson',
      company: 'MegaFleet Logistics',
      role: 'Fleet Manager',
      accountNumber: 'MF-31567',
      status: 'Active',
      isFullyFunctional: false
    },
    {
      id: 4,
      email: 'maria.garcia@transportco.com',
      name: 'Maria Garcia',
      company: 'TransportCo Inc.',
      role: 'Procurement',
      accountNumber: 'TC-42398',
      status: 'Pending',
      isFullyFunctional: false
    }
  ];

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCustomer = (customer) => {
    selectCustomer({
      email: customer.email,
      name: customer.name,
      company: customer.company,
      role: customer.role,
      accountNumber: customer.accountNumber
    });
    onClose(); // Close the modal after selecting customer
  };

  const handleCancel = () => {
    endASMSession();
    onClose();
  };

  return (
    <div className="asm-customer-selection-overlay" onClick={handleCancel}>
      <div className="asm-customer-selection-modal" onClick={(e) => e.stopPropagation()}>
        <button className="asm-selection-close" onClick={handleCancel}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="asm-selection-header">
          <div className="asm-selection-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Select Customer to Assist</h2>
          <p>Choose which customer you would like to help</p>
        </div>

        <div className="asm-search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, company, or account number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="asm-customers-list">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className={`asm-customer-card ${!customer.isFullyFunctional ? 'demo-only' : ''}`}
              onClick={() => handleSelectCustomer(customer)}
            >
              <div className="customer-avatar">
                <span>{customer.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="customer-info">
                <div className="customer-name-row">
                  <h3>{customer.name}</h3>
                  {customer.isFullyFunctional && (
                    <span className="functional-badge">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Fully Functional
                    </span>
                  )}
                  {!customer.isFullyFunctional && (
                    <span className="demo-badge">Demo Only</span>
                  )}
                </div>
                <div className="customer-details">
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{customer.email}</span>
                  </div>
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{customer.company}</span>
                  </div>
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M1 10H23M1 14H23" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Account: {customer.accountNumber}</span>
                  </div>
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Role: {customer.role}</span>
                  </div>
                </div>
              </div>
              <div className="customer-arrow">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="asm-no-results">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No customers found matching "{searchQuery}"</p>
          </div>
        )}

        <div className="asm-selection-footer">
          <button className="asm-cancel-btn" onClick={handleCancel}>Cancel Session</button>
        </div>
      </div>
    </div>
  );
}

export default ASMCustomerSelection;
