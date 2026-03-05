import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../context/QuoteContext';
import './ASM.css';

function ASM() {
  const navigate = useNavigate();
  const { quotes: allQuotes, updateQuote, sendQuoteToCustomer } = useQuotes();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [asmNotes, setAsmNotes] = useState('');

  // Mock customer data - in real app, this would come from API
  const customers = [
    {
      email: 'mark.rivers@rustic-hw.com',
      name: 'Mark Rivers',
      company: 'Rustic Hardware',
      phone: '(555) 123-4567',
      status: 'active'
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    // Accept any email/password for demo
    if (email && password) {
      setIsAuthenticated(true);
      // Auto-select Mark Rivers
      setSelectedCustomer(customers[0]);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setSelectedCustomer(null);
    setSelectedQuote(null);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSelectedQuote(null);
    setDiscountPercent(0);
    setAsmNotes('');
  };

  const handleQuoteSelect = (quote) => {
    setSelectedQuote(quote);
    setDiscountPercent(quote.discountPercent || 0);
    setAsmNotes(quote.asmNotes || '');
  };

  const handleApplyDiscount = () => {
    if (selectedQuote && discountPercent >= 0 && discountPercent <= 100) {
      updateQuote(selectedQuote.id, {
        discountPercent: parseFloat(discountPercent),
        lastModifiedBy: 'asm'
      });

      // Refresh the selected quote
      const updatedQuote = allQuotes.find(q => q.id === selectedQuote.id);
      setSelectedQuote(updatedQuote);

      alert(`Discount of ${discountPercent}% applied successfully!`);
    }
  };

  const handleSendQuote = () => {
    if (selectedQuote && window.confirm('Send this quote to the customer?')) {
      sendQuoteToCustomer(selectedQuote.id, asmNotes);
      alert('Quote sent successfully to customer!');

      // Refresh the selected quote
      const updatedQuote = allQuotes.find(q => q.id === selectedQuote.id);
      setSelectedQuote(updatedQuote);
    }
  };

  const customerQuotes = selectedCustomer
    ? allQuotes.filter(q => q.customer.email === selectedCustomer.email)
    : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Review', class: 'pending' },
      sent: { label: 'Sent to Customer', class: 'sent' },
      accepted: { label: 'Accepted', class: 'accepted' },
      rejected: { label: 'Rejected', class: 'rejected' },
      expired: { label: 'Expired', class: 'expired' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const calculateDiscountedTotal = () => {
    if (!selectedQuote) return 0;
    const subtotal = selectedQuote.subtotal;
    const discount = subtotal * (discountPercent / 100);
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.08;
    return discountedSubtotal + tax + 25.00;
  };

  if (!isAuthenticated) {
    return (
      <div className="asm-page">
        <div className="asm-login-container">
          <div className="asm-login-card">
            <div className="asm-login-header">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h1>Assisted Service Module</h1>
              <p>Service Representative Login</p>
            </div>

            <form onSubmit={handleLogin} className="asm-login-form">
              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter any email..."
                  required
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter any password..."
                  required
                />
              </div>

              <button type="submit" className="asm-login-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Login to ASM
              </button>

              <div className="asm-login-note">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Demo Mode: Any email and password will work</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="asm-page authenticated">
      <div className="asm-header">
        <div className="asm-header-left">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <div>
            <h1>Assisted Service Module</h1>
            <p>Managing customer: <strong>{selectedCustomer?.name}</strong></p>
          </div>
        </div>
        <div className="asm-header-right">
          <button className="asm-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
          <button className="asm-return-btn" onClick={() => navigate('/')}>
            Return to Portal
          </button>
        </div>
      </div>

      <div className="asm-content">
        <div className="asm-sidebar">
          <div className="customer-info-card">
            <h3>Customer Information</h3>
            <div className="customer-info">
              <div className="customer-avatar">{selectedCustomer?.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="customer-details">
                <div className="customer-name">{selectedCustomer?.name}</div>
                <div className="customer-email">{selectedCustomer?.email}</div>
                <div className="customer-company">{selectedCustomer?.company}</div>
                <div className="customer-phone">{selectedCustomer?.phone}</div>
              </div>
            </div>
          </div>

          <div className="quotes-list-card">
            <h3>Customer Quotes ({customerQuotes.length})</h3>
            <div className="asm-quotes-list">
              {customerQuotes.length === 0 ? (
                <div className="no-quotes">
                  <p>No quotes found for this customer</p>
                </div>
              ) : (
                customerQuotes.map((quote) => {
                  const status = getStatusBadge(quote.status);
                  return (
                    <div
                      key={quote.id}
                      className={`asm-quote-item ${selectedQuote?.id === quote.id ? 'selected' : ''}`}
                      onClick={() => handleQuoteSelect(quote)}
                    >
                      <div className="asm-quote-header">
                        <span className="asm-quote-id">{quote.id}</span>
                        <span className={`asm-quote-status ${status.class}`}>{status.label}</span>
                      </div>
                      <div className="asm-quote-info">
                        <div className="asm-quote-date">{formatDate(quote.createdAt)}</div>
                        <div className="asm-quote-total">${quote.total.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="asm-main">
          {selectedQuote ? (
            <div className="quote-management">
              <div className="quote-management-header">
                <h2>Quote Management: {selectedQuote.id}</h2>
                <div className={`status-badge ${getStatusBadge(selectedQuote.status).class}`}>
                  {getStatusBadge(selectedQuote.status).label}
                </div>
              </div>

              <div className="discount-control-section">
                <h3>Apply Discount</h3>
                <div className="discount-control">
                  <div className="discount-input-group">
                    <label>Discount Percentage</label>
                    <div className="discount-input">
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="discount-symbol">%</span>
                    </div>
                  </div>

                  <div className="discount-preview">
                    <div className="preview-line">
                      <span>Original Subtotal:</span>
                      <span>${selectedQuote.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="preview-line discount-line">
                      <span>Discount ({discountPercent}%):</span>
                      <span>-${(selectedQuote.subtotal * discountPercent / 100).toFixed(2)}</span>
                    </div>
                    <div className="preview-line total-line">
                      <span>New Total:</span>
                      <span>${calculateDiscountedTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className="apply-discount-btn"
                    onClick={handleApplyDiscount}
                    disabled={selectedQuote.status === 'accepted' || selectedQuote.status === 'rejected'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Apply Discount
                  </button>
                </div>
              </div>

              <div className="asm-notes-section">
                <h3>Message to Customer</h3>
                <textarea
                  value={asmNotes}
                  onChange={(e) => setAsmNotes(e.target.value)}
                  placeholder="Add a message that will be sent to the customer with the quote..."
                  rows="4"
                />
              </div>

              <div className="quote-items-section">
                <h3>Quote Items ({selectedQuote.items.length})</h3>
                <div className="asm-items-list">
                  {selectedQuote.items.map((item, index) => (
                    <div key={index} className="asm-item">
                      <img src={item.image} alt={item.name} />
                      <div className="asm-item-info">
                        <div className="asm-item-name">{item.name}</div>
                        <div className="asm-item-code">OEM: {item.code}</div>
                        <div className="asm-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="asm-item-pricing">
                        {selectedQuote.discountPercent > 0 && (
                          <div className="original-price">${item.originalPrice.toFixed(2)}</div>
                        )}
                        <div className="final-price">${item.finalPrice.toFixed(2)}</div>
                        <div className="item-total">${(item.finalPrice * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="send-quote-section">
                <button
                  className="send-quote-btn"
                  onClick={handleSendQuote}
                  disabled={selectedQuote.status === 'accepted' || selectedQuote.status === 'rejected'}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Quote to Customer
                </button>
                {(selectedQuote.status === 'accepted' || selectedQuote.status === 'rejected') && (
                  <p className="quote-finalized-notice">
                    This quote has been {selectedQuote.status} and cannot be modified.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="asm-empty-state">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No Quote Selected</h3>
              <p>Select a quote from the list to manage it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ASM;
