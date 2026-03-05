import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../context/QuoteContext';
import { useOrders } from '../context/OrderContext';
import { useASM } from '../context/ASMContext';
import './Quotes.css';

function Quotes() {
  const navigate = useNavigate();
  const { getQuotesByCustomer, acceptQuote, rejectQuote, getQuoteById, updateQuote, sendQuoteToCustomer } = useQuotes();
  const { createOrderFromQuote } = useOrders();
  const { asmActive } = useASM();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [asmDiscountPercent, setAsmDiscountPercent] = useState(0);
  const [asmNotes, setAsmNotes] = useState('');
  const [itemDiscounts, setItemDiscounts] = useState({});

  // Filter quotes for current user (Mark Rivers)
  const userEmail = 'mark.rivers@rustic-hw.com';
  const quotes = getQuotesByCustomer(userEmail);

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setAsmDiscountPercent(quote.discountPercent || 0);
    setAsmNotes(quote.asmNotes || '');

    // Initialize item discounts from quote
    const itemDisc = {};
    quote.items.forEach((item, index) => {
      itemDisc[index] = item.discountPercent || 0;
    });
    setItemDiscounts(itemDisc);
  };

  const handleItemDiscountChange = (index, value) => {
    setItemDiscounts({
      ...itemDiscounts,
      [index]: parseFloat(value) || 0
    });
  };

  const handleAcceptQuote = (quoteId) => {
    if (window.confirm('Are you sure you want to accept this quote? This will create an order.')) {
      const quote = getQuoteById(quoteId);

      // Create order from quote
      const order = createOrderFromQuote(quote);

      if (order) {
        // Mark quote as accepted
        acceptQuote(quoteId);

        // Show success message with order ID
        alert(`Quote accepted! Order #${order.id} has been created successfully.\n\nYou will receive an order confirmation email shortly.`);

        // Navigate to orders page
        navigate('/orders');
      } else {
        alert('Failed to create order. Please try again.');
      }
    }
  };

  const handleRejectQuote = () => {
    if (selectedQuote && rejectionReason.trim()) {
      rejectQuote(selectedQuote.id, rejectionReason);
      alert('Quote rejected successfully.');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedQuote(getQuoteById(selectedQuote.id));
    }
  };

  // ASM handlers
  const handleASMApplyDiscount = () => {
    if (selectedQuote && asmDiscountPercent >= 0 && asmDiscountPercent <= 100) {
      // Apply item-level discounts if any are set
      const updatedItems = selectedQuote.items.map((item, index) => ({
        ...item,
        discountPercent: itemDiscounts[index] || 0,
        originalPrice: item.originalPrice || item.price?.value || item.price || 0,
        finalPrice: (item.originalPrice || item.price?.value || item.price || 0) * (1 - (itemDiscounts[index] || 0) / 100)
      }));

      updateQuote(selectedQuote.id, {
        discountPercent: parseFloat(asmDiscountPercent),
        items: updatedItems,
        asmNotes: asmNotes,
        lastModifiedBy: 'asm'
      });
      const updatedQuote = getQuoteById(selectedQuote.id);
      setSelectedQuote(updatedQuote);
      alert('Discounts applied successfully!');
    }
  };

  const handleASMSendQuote = () => {
    if (selectedQuote) {
      sendQuoteToCustomer(selectedQuote.id, asmNotes);
      alert('Quote sent to customer successfully!');
      const updatedQuote = getQuoteById(selectedQuote.id);
      setSelectedQuote(updatedQuote);
    }
  };

  const calculateDiscountedTotal = (quote) => {
    if (!quote) return 0;
    const subtotal = quote.items.reduce((sum, item) => {
      const price = item.selectedWarehouse?.price || item.price?.value || item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    const discount = subtotal * (asmDiscountPercent / 100);
    return subtotal - discount;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Review', class: 'pending' },
      sent: { label: 'Awaiting Your Response', class: 'sent' },
      accepted: { label: 'Accepted', class: 'accepted' },
      rejected: { label: 'Rejected', class: 'rejected' },
      expired: { label: 'Expired', class: 'expired' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  if (quotes.length === 0) {
    return (
      <div className="quotes-page">
        <div className="quotes-header">
          <h1>My Quotes</h1>
        </div>
        <div className="quotes-empty">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>No Quotes Yet</h2>
          <p>Request a quote from your shopping cart to get started</p>
          <button className="browse-btn" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quotes-page">
      <div className="quotes-header">
        <h1>My Quotes</h1>
        <div className="quotes-count">{quotes.length} {quotes.length === 1 ? 'Quote' : 'Quotes'}</div>
      </div>

      <div className="quotes-content">
        <div className="quotes-list-section">
          <div className="quotes-filters">
            <button className="filter-btn active">All Quotes</button>
            <button className="filter-btn">Pending</button>
            <button className="filter-btn">Sent</button>
            <button className="filter-btn">Accepted</button>
          </div>

          <div className="quotes-list">
            {quotes.map((quote) => {
              const status = getStatusBadge(quote.status);
              const expired = isExpired(quote.validUntil);

              return (
                <div
                  key={quote.id}
                  className={`quote-card ${selectedQuote?.id === quote.id ? 'selected' : ''}`}
                  onClick={() => handleViewQuote(quote)}
                >
                  <div className="quote-card-header">
                    <div className="quote-id">{quote.id}</div>
                    <div className={`quote-status ${status.class}`}>
                      {expired && quote.status === 'sent' ? 'Expired' : status.label}
                    </div>
                  </div>

                  <div className="quote-card-body">
                    <div className="quote-info-row">
                      <span className="label">Created:</span>
                      <span className="value">{formatDate(quote.createdAt)}</span>
                    </div>
                    <div className="quote-info-row">
                      <span className="label">Items:</span>
                      <span className="value">{quote.items.length} {quote.items.length === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div className="quote-info-row">
                      <span className="label">Total:</span>
                      <span className="value total">${quote.total.toFixed(2)}</span>
                    </div>
                    {quote.discountPercent > 0 && (
                      <div className="quote-discount-badge">
                        {quote.discountPercent}% Discount Applied
                      </div>
                    )}
                  </div>

                  {expired && quote.status === 'sent' && (
                    <div className="quote-expired-notice">
                      Quote expired on {formatDate(quote.validUntil)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="quote-detail-panel">
          {selectedQuote ? (
            <div className="quote-detail">
              <div className="quote-detail-header">
                <div>
                  <h2>{selectedQuote.id}</h2>
                  <div className={`quote-status-large ${getStatusBadge(selectedQuote.status).class}`}>
                    {getStatusBadge(selectedQuote.status).label}
                  </div>
                </div>
                {selectedQuote.status === 'sent' && !isExpired(selectedQuote.validUntil) && (
                  <div className="quote-actions-header">
                    <button className="accept-btn" onClick={() => handleAcceptQuote(selectedQuote.id)}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Accept Quote
                    </button>
                    <button className="reject-btn" onClick={() => setShowRejectModal(true)}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="quote-detail-content">
                <div className="quote-section">
                  <h3>Quote Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Quote Number:</span>
                      <span className="value">{selectedQuote.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Created:</span>
                      <span className="value">{formatDate(selectedQuote.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Valid Until:</span>
                      <span className="value">{formatDate(selectedQuote.validUntil)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Last Updated:</span>
                      <span className="value">{formatDate(selectedQuote.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {asmActive && (selectedQuote.status === 'pending' || selectedQuote.status === 'sent') && (
                  <div className="quote-section asm-discount-section">
                    <div className="asm-section-header">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 8H10.5M12 8H15M9 12H10.5M12 12H15M9 16H10.5M12 16H15M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 3.58579C19.0391 3.21071 18.5304 3 18 3H6C5.46957 3 4.96086 3.21071 4.58579 3.58579C4.21071 3.96086 4 4.46957 4 5V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3>ASM - Apply Discount</h3>
                    </div>

                    <div className="asm-discount-controls">
                      <div className="asm-discount-input-group">
                        <label>Discount Percentage:</label>
                        <div className="asm-discount-input-wrapper">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={asmDiscountPercent}
                            onChange={(e) => setAsmDiscountPercent(parseFloat(e.target.value) || 0)}
                          />
                          <span className="input-suffix">%</span>
                        </div>
                      </div>

                      <div className="asm-discount-preview">
                        <div className="preview-item">
                          <span className="preview-label">Original Total:</span>
                          <span className="preview-value">${selectedQuote.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="preview-item discount">
                          <span className="preview-label">Discount ({asmDiscountPercent}%):</span>
                          <span className="preview-value">-${(selectedQuote.subtotal * (asmDiscountPercent / 100)).toFixed(2)}</span>
                        </div>
                        <div className="preview-item total">
                          <span className="preview-label">New Total:</span>
                          <span className="preview-value">${calculateDiscountedTotal(selectedQuote).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="asm-notes-input-group">
                        <label>Message to Customer:</label>
                        <textarea
                          value={asmNotes}
                          onChange={(e) => setAsmNotes(e.target.value)}
                          placeholder="Add a message for the customer about this quote..."
                          rows="3"
                        />
                      </div>

                      <div className="asm-action-buttons">
                        <button className="asm-apply-discount-btn" onClick={handleASMApplyDiscount}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Apply Discount
                        </button>
                        <button className="asm-send-quote-btn" onClick={handleASMSendQuote}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Send Quote to Customer
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuote.asmNotes && (
                  <div className="quote-section asm-notes-section">
                    <div className="asm-notes-header">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3>Message from Sales Team</h3>
                    </div>
                    <p className="asm-notes-text">{selectedQuote.asmNotes}</p>
                  </div>
                )}

                {selectedQuote.notes && (
                  <div className="quote-section customer-notes-section">
                    <div className="customer-notes-header">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3>Customer Notes & Discount Requests</h3>
                    </div>
                    <p className="quote-notes">{selectedQuote.notes}</p>
                  </div>
                )}

                <div className="quote-section">
                  <h3>Items ({selectedQuote.items.length})</h3>
                  <div className="quote-items-list">
                    {selectedQuote.items.map((item, index) => {
                      const itemPrice = item.originalPrice || item.price?.value || item.price || 0;
                      const itemDiscount = itemDiscounts[index] || 0;
                      const discountedPrice = itemPrice * (1 - itemDiscount / 100);

                      return (
                        <div key={index} className="quote-item">
                          <img src={item.image} alt={item.name} className="quote-item-image" />
                          <div className="quote-item-info">
                            <div className="quote-item-name">{item.name}</div>
                            <div className="quote-item-code">OEM: {item.code}</div>
                            <div className="quote-item-qty">Quantity: {item.quantity}</div>
                            {item.selectedWarehouse && (
                              <div className="quote-item-warehouse">
                                {item.selectedWarehouse.location} - {item.selectedWarehouse.deliveryDays}
                              </div>
                            )}
                          </div>
                          <div className="quote-item-pricing">
                            {asmActive && (selectedQuote.status === 'pending' || selectedQuote.status === 'sent') ? (
                              <div className="asm-item-discount-control">
                                <label>Item Discount:</label>
                                <div className="asm-item-discount-input">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={itemDiscount}
                                    onChange={(e) => handleItemDiscountChange(index, e.target.value)}
                                  />
                                  <span>%</span>
                                </div>
                                {itemDiscount > 0 && (
                                  <div className="item-discount-preview">
                                    <div className="original-price">${itemPrice.toFixed(2)}</div>
                                    <div className="discounted-price">${discountedPrice.toFixed(2)}</div>
                                  </div>
                                )}
                                {itemDiscount === 0 && (
                                  <div className="item-price-single">${itemPrice.toFixed(2)} each</div>
                                )}
                                <div className="item-subtotal">${(discountedPrice * item.quantity).toFixed(2)}</div>
                              </div>
                            ) : (
                              <>
                                {item.discountPercent > 0 && (
                                  <div className="original-price">${itemPrice.toFixed(2)}</div>
                                )}
                                <div className="item-price">${(item.finalPrice || itemPrice).toFixed(2)} each</div>
                                <div className="item-subtotal">${((item.finalPrice || itemPrice) * item.quantity).toFixed(2)}</div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="quote-section quote-summary">
                  <h3>Quote Summary</h3>
                  <div className="summary-lines">
                    {(() => {
                      // Calculate preview discount including pending item-level discounts
                      const itemLevelDiscountTotal = selectedQuote.items.reduce((sum, item, index) => {
                        const originalPrice = item.originalPrice || item.price?.value || item.price || 0;
                        const itemDiscount = (itemDiscounts[index] || item.discountPercent || 0) / 100;
                        const discountAmount = originalPrice * item.quantity * itemDiscount;
                        return sum + discountAmount;
                      }, 0);

                      const subtotalAfterItemDiscounts = selectedQuote.items.reduce((sum, item, index) => {
                        const originalPrice = item.originalPrice || item.price?.value || item.price || 0;
                        const itemDiscount = (itemDiscounts[index] || item.discountPercent || 0) / 100;
                        const finalPrice = originalPrice * (1 - itemDiscount);
                        return sum + (finalPrice * item.quantity);
                      }, 0);

                      const overallDiscount = subtotalAfterItemDiscounts * ((asmDiscountPercent || selectedQuote.discountPercent || 0) / 100);
                      const totalDiscountPreview = itemLevelDiscountTotal + overallDiscount;
                      const hasItemDiscounts = Object.values(itemDiscounts).some(d => d > 0) || selectedQuote.items?.some(item => item.discountPercent > 0);

                      return (
                        <>
                          <div className="summary-line">
                            <span>Subtotal:</span>
                            <span>${selectedQuote.subtotal.toFixed(2)}</span>
                          </div>
                          <div className={`summary-line ${(totalDiscountPreview > 0) ? 'discount' : ''}`}>
                            <span>
                              Discount
                              {(asmDiscountPercent > 0 || selectedQuote.discountPercent > 0) && ` (${asmDiscountPercent || selectedQuote.discountPercent}%)`}
                              {hasItemDiscounts && ' (incl. item discounts)'}:
                            </span>
                            <span>{totalDiscountPreview > 0 ? '-' : ''}${totalDiscountPreview.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                    <div className="summary-line">
                      <span>Tax (8%):</span>
                      <span>${selectedQuote.tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-line">
                      <span>Shipping:</span>
                      <span>${selectedQuote.shipping.toFixed(2)}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-line total">
                      <span>Total:</span>
                      <span>${selectedQuote.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* ASM Action Buttons - Repeated after summary for easier workflow */}
                {asmActive && selectedQuote.status === 'pending' && (
                  <div className="asm-action-buttons-summary">
                    <button className="asm-apply-discount-btn" onClick={handleASMApplyDiscount}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Apply Discount
                    </button>
                    <button className="asm-send-quote-btn" onClick={handleASMSendQuote}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Send Quote to Customer
                    </button>
                  </div>
                )}

                {selectedQuote.status === 'sent' && !isExpired(selectedQuote.validUntil) && (
                  <div className="quote-actions-footer">
                    <button className="accept-btn-large" onClick={() => handleAcceptQuote(selectedQuote.id)}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Accept Quote & Create Order
                    </button>
                    <button className="reject-btn-large" onClick={() => setShowRejectModal(true)}>
                      Reject Quote
                    </button>
                  </div>
                )}

                {selectedQuote.status === 'accepted' && (
                  <div className="quote-accepted-notice">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <h4>Quote Accepted</h4>
                      <p>This quote was accepted on {formatDate(selectedQuote.acceptedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="quote-detail-empty">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Select a Quote</h3>
              <p>Choose a quote from the list to view details</p>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Quote</h3>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Please provide a reason for rejecting this quote:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter your reason..."
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button
                className="modal-confirm"
                onClick={handleRejectQuote}
                disabled={!rejectionReason.trim()}
              >
                Reject Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quotes;
