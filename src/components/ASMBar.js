import React, { useState, useRef, useEffect } from 'react';
import { useASM } from '../context/ASMContext';
import { useOrders } from '../context/OrderContext';
import ASMDiscrepancies from './ASMDiscrepancies';
import './ASMBar.css';

function ASMBar() {
  const { asmActive, asmAgent, emulatedCustomer, endASMSession } = useASM();
  const { getPendingDiscrepancies } = useOrders();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDiscrepancies, setShowDiscrepancies] = useState(false);
  const dropdownRef = useRef(null);

  const pendingCount = getPendingDiscrepancies().length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!asmActive) return null;

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end the ASM session?')) {
      endASMSession();
    }
  };

  return (
    <div className="asm-bar">
      <div className="asm-bar-content">
        <div className="asm-bar-left">
          <div className="asm-indicator">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="asm-mode-label">ASSISTED SERVICE MODE</span>
          </div>

          <div className="asm-session-info" ref={dropdownRef}>
            <span className="asm-session-text">Emulating:</span>
            <button
              className="asm-customer-dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="asm-customer-avatar-small">
                {emulatedCustomer?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="asm-customer-name-text">{emulatedCustomer?.name}</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-arrow">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showDropdown && (
              <div className="asm-dropdown-menu">
                <div className="asm-dropdown-header">
                  <div className="asm-dropdown-avatar">
                    {emulatedCustomer?.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="asm-dropdown-info">
                    <div className="asm-dropdown-name">{emulatedCustomer?.name}</div>
                    <div className="asm-dropdown-email">{emulatedCustomer?.email}</div>
                    <div className="asm-dropdown-company">{emulatedCustomer?.company}</div>
                  </div>
                </div>
                <div className="asm-dropdown-divider"></div>
                <div className="asm-dropdown-section">
                  <div className="asm-dropdown-label">Agent</div>
                  <div className="asm-dropdown-value">{asmAgent?.email}</div>
                </div>
                <div className="asm-dropdown-section">
                  <div className="asm-dropdown-label">Session Started</div>
                  <div className="asm-dropdown-value">
                    {new Date(asmAgent?.loginTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="asm-bar-right">
          <button className="asm-discrepancies-btn" onClick={() => setShowDiscrepancies(true)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33968 16C2.56986 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Discrepancies
            {pendingCount > 0 && (
              <span className="discrepancy-badge">{pendingCount}</span>
            )}
          </button>
          <button className="asm-end-session-btn" onClick={handleEndSession}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            End Session
          </button>
        </div>
      </div>

      {showDiscrepancies && (
        <ASMDiscrepancies onClose={() => setShowDiscrepancies(false)} />
      )}
    </div>
  );
}

export default ASMBar;
