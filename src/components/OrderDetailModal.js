import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import './OrderDetailModal.css';

function OrderDetailModal({ order, onClose }) {
  const { user } = useAuth();
  const { fileDiscrepancy } = useOrders();
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [discrepancyForm, setDiscrepancyForm] = useState({
    type: 'incomplete',
    description: '',
    affectedItems: []
  });

  if (!order) return null;

  const canFileDiscrepancy = () => {
    // Only delivered or partially delivered orders can have discrepancies filed
    // And user must be the customer
    return (
      (order.status === 'Delivered' || order.status === 'Partially Delivered') &&
      user?.email === order.customer.email &&
      !order.discrepancy
    );
  };

  const calculateRefundAmount = () => {
    if (discrepancyForm.affectedItems.length === 0) return 0;

    return discrepancyForm.affectedItems.reduce((total, itemCode) => {
      const item = order.items.find(i => i.code === itemCode);
      if (item) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleDiscrepancySubmit = (e) => {
    e.preventDefault();
    const refundAmount = calculateRefundAmount();

    fileDiscrepancy(order.id, {
      ...discrepancyForm,
      requestedAmount: refundAmount,
      filedBy: user.name,
      filedAt: new Date().toISOString(),
      status: 'pending'
    });
    setShowDiscrepancyModal(false);
    setDiscrepancyForm({
      type: 'incomplete',
      description: '',
      affectedItems: []
    });
  };

  const handleItemToggle = (itemCode) => {
    setDiscrepancyForm(prev => ({
      ...prev,
      affectedItems: prev.affectedItems.includes(itemCode)
        ? prev.affectedItems.filter(code => code !== itemCode)
        : [...prev.affectedItems, itemCode]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': '#ff9800',
      'Shipped': '#2196f3',
      'Delivered': '#4caf50',
      'Partially Delivered': '#ffc107',
      'Cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="order-modal-header">
          <div className="order-modal-title">
            <h2>Order Details</h2>
            <div className="order-modal-id">{order.id}</div>
          </div>
          <div
            className="order-modal-status-badge"
            style={{ background: getStatusColor(order.status) }}
          >
            {order.status}
          </div>
        </div>

        <div className="order-modal-content">
          {/* Customer Information */}
          <div className="order-detail-section">
            <h3>Customer Information</h3>
            <div className="order-detail-grid">
              <div className="order-detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{order.customer.name}</span>
              </div>
              <div className="order-detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{order.customer.email}</span>
              </div>
              <div className="order-detail-item">
                <span className="detail-label">Company:</span>
                <span className="detail-value">{order.customer.company}</span>
              </div>
              {order.customer.phone && (
                <div className="order-detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{order.customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="order-detail-section">
            <h3>Order Information</h3>
            <div className="order-detail-grid">
              <div className="order-detail-item">
                <span className="detail-label">Order Date:</span>
                <span className="detail-value">{formatDate(order.createdAt)}</span>
              </div>
              <div className="order-detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{formatDate(order.updatedAt)}</span>
              </div>
              <div className="order-detail-item">
                <span className="detail-label">Payment Status:</span>
                <span className={`detail-value payment-${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.estimatedDelivery && (
                <div className="order-detail-item">
                  <span className="detail-label">Estimated Delivery:</span>
                  <span className="detail-value">{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="order-detail-item">
                  <span className="detail-label">Tracking Number:</span>
                  <span className="detail-value tracking-number">{order.trackingNumber}</span>
                </div>
              )}
              {order.quoteId && (
                <div className="order-detail-item">
                  <span className="detail-label">From Quote:</span>
                  <span className="detail-value quote-ref">{order.quoteId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address(es) */}
          {order.shippingAddresses && order.shippingAddresses.length > 0 && (
            <div className="order-detail-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '20px', height: '20px', verticalAlign: 'middle', marginRight: '8px'}}>
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
                </svg>
                Shipping {order.shippingAddresses.length > 1 ? 'Addresses' : 'Address'}
              </h3>

              {order.shippingAddresses.length === 1 ? (
                // Single address view
                <div className="shipping-address-single">
                  <div className="address-details">
                    <div className="address-line">
                      <strong>{order.shippingAddresses[0].firstName} {order.shippingAddresses[0].lastName}</strong>
                    </div>
                    {order.shippingAddresses[0].company && (
                      <div className="address-line company">{order.shippingAddresses[0].company}</div>
                    )}
                    <div className="address-line">{order.shippingAddresses[0].street}</div>
                    {order.shippingAddresses[0].apartment && (
                      <div className="address-line">{order.shippingAddresses[0].apartment}</div>
                    )}
                    <div className="address-line">
                      {order.shippingAddresses[0].city}, {order.shippingAddresses[0].state} {order.shippingAddresses[0].zip}
                    </div>
                    <div className="address-line">{order.shippingAddresses[0].country}</div>
                    {order.shippingAddresses[0].phone && (
                      <div className="address-line phone">{order.shippingAddresses[0].phone}</div>
                    )}
                  </div>
                </div>
              ) : (
                // Multiple addresses view
                <div className="shipping-addresses-multi">
                  {order.shippingAddresses.map((address, index) => (
                    <div key={index} className="shipping-address-card">
                      <div className="address-card-header">
                        <span className="address-badge">Address {index + 1}</span>
                        {address.items && (
                          <span className="items-count">{address.items.length} {address.items.length === 1 ? 'item' : 'items'}</span>
                        )}
                      </div>
                      <div className="address-details">
                        <div className="address-line">
                          <strong>{address.firstName} {address.lastName}</strong>
                        </div>
                        {address.company && (
                          <div className="address-line company">{address.company}</div>
                        )}
                        <div className="address-line">{address.street}</div>
                        {address.apartment && (
                          <div className="address-line">{address.apartment}</div>
                        )}
                        <div className="address-line">
                          {address.city}, {address.state} {address.zip}
                        </div>
                        <div className="address-line">{address.country}</div>
                        {address.phone && (
                          <div className="address-line phone">{address.phone}</div>
                        )}
                      </div>
                      {address.items && address.items.length > 0 && (
                        <div className="address-items">
                          <strong>Parts shipping to this address:</strong>
                          <ul>
                            {address.items.map((itemCode, idx) => {
                              const item = order.items.find(i => i.code === itemCode);
                              return (
                                <li key={idx}>{item ? item.name : itemCode}</li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Partial Delivery Information */}
          {order.status === 'Partially Delivered' && order.partialDeliveryInfo && (
            <div className="order-detail-section partial-delivery-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
                </svg>
                Split Shipment Status
              </h3>
              <div className="split-shipment-info">
                <div className="shipment-group delivered">
                  <h4>✓ Delivered Items</h4>
                  <ul>
                    {order.partialDeliveryInfo.delivered.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="shipment-group pending">
                  <h4>🚚 Items In Transit</h4>
                  <ul>
                    {order.partialDeliveryInfo.pending.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {order.trackingNumbers && (
                <div className="tracking-numbers">
                  <strong>Tracking Numbers:</strong>
                  {order.trackingNumbers.map((tracking, idx) => (
                    <span key={idx} className="tracking-chip">{tracking}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="order-detail-section">
            <h3>Order Items ({order.items.length})</h3>
            <div className="order-items-table">
              {order.items.map((item, index) => {
                // Find the shipping address for this item
                const itemShippingAddress = order.shippingAddresses && order.shippingAddresses.length > 1
                  ? order.shippingAddresses.find(addr =>
                      addr.items && addr.items.includes(item.code)
                    )
                  : null;

                return (
                  <div key={index} className="order-item-row">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-code">Part #: {item.code}</div>
                      {item.selectedWarehouse && (
                        <div className="order-item-warehouse">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '14px', height: '14px'}}>
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {item.selectedWarehouse.location}
                        </div>
                      )}
                      {itemShippingAddress && (
                        <div className="order-item-shipping-to">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '14px', height: '14px'}}>
                            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
                          </svg>
                          Ships to: {itemShippingAddress.city}, {itemShippingAddress.state}
                        </div>
                      )}
                      {item.shipmentStatus && (
                        <div className={`shipment-status ${item.shipmentStatus}`}>
                          {item.shipmentStatus === 'delivered' && `✓ Delivered (${item.deliveredQuantity}/${item.quantity})`}
                          {item.shipmentStatus === 'shipped' && '🚚 In Transit'}
                        </div>
                      )}
                    </div>
                    <div className="order-item-pricing">
                      <div className="order-item-quantity">Qty: {item.quantity}</div>
                      {item.discountPercent > 0 && (
                        <div className="order-item-original-price">${item.originalPrice.toFixed(2)}</div>
                      )}
                      <div className="order-item-price">${item.price.toFixed(2)} each</div>
                      <div className="order-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="order-detail-section">
              <h3>Order Notes</h3>
              <div className="order-notes">{order.notes}</div>
            </div>
          )}

          {/* Cancellation Reason */}
          {order.cancellationReason && (
            <div className="order-detail-section cancellation-section">
              <h3>Cancellation Reason</h3>
              <div className="cancellation-reason">{order.cancellationReason}</div>
            </div>
          )}

          {/* Order Summary */}
          <div className="order-detail-section order-summary-section">
            <h3>Order Summary</h3>
            <div className="order-summary-lines">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountPercent > 0 && (
                <div className="summary-line discount">
                  <span>Discount ({order.discountPercent}%):</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Discrepancy Section */}
          {order.discrepancy && (
            <div className={`order-detail-section discrepancy-section ${order.discrepancy.status}`}>
              <h3>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '20px', height: '20px', verticalAlign: 'middle', marginRight: '8px'}}>
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33968 16C2.56986 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Order Discrepancy
              </h3>
              <div className="discrepancy-info">
                <div className="discrepancy-header">
                  <span className={`discrepancy-status-badge ${order.discrepancy.status}`}>
                    {order.discrepancy.status === 'pending' && '⏳ Pending Review'}
                    {order.discrepancy.status === 'approved' && '✓ Approved'}
                    {order.discrepancy.status === 'rejected' && '✗ Rejected'}
                    {order.discrepancy.status === 'refund-processing' && '💳 Refund Processing'}
                    {order.discrepancy.status === 'refunded' && '✓ Refunded'}
                  </span>
                  <span className="discrepancy-date">Filed: {formatDate(order.discrepancy.filedAt)}</span>
                </div>
                <div className="discrepancy-details">
                  <div className="discrepancy-row">
                    <strong>Type:</strong>
                    <span className="discrepancy-type">
                      {order.discrepancy.type === 'incomplete' && '📦 Incomplete Order'}
                      {order.discrepancy.type === 'damaged' && '⚠️ Damaged Parts'}
                      {order.discrepancy.type === 'wrong-item' && '🔄 Wrong Item Received'}
                      {order.discrepancy.type === 'other' && '❓ Other Issue'}
                    </span>
                  </div>
                  <div className="discrepancy-row">
                    <strong>Description:</strong>
                    <span>{order.discrepancy.description}</span>
                  </div>
                  {order.discrepancy.affectedItems.length > 0 && (
                    <div className="discrepancy-row">
                      <strong>Affected Items:</strong>
                      <ul className="affected-items-list">
                        {order.discrepancy.affectedItems.map((itemCode, idx) => {
                          const item = order.items.find(i => i.code === itemCode);
                          return <li key={idx}>{item ? item.name : itemCode}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="discrepancy-row">
                    <strong>Requested Refund:</strong>
                    <span className="refund-amount">${parseFloat(order.discrepancy.requestedAmount).toFixed(2)}</span>
                  </div>
                  {order.discrepancy.agentNotes && (
                    <div className="discrepancy-row agent-notes">
                      <strong>Agent Notes:</strong>
                      <span>{order.discrepancy.agentNotes}</span>
                    </div>
                  )}
                  {order.discrepancy.status === 'rejected' && order.discrepancy.rejectionReason && (
                    <div className="discrepancy-row rejection-reason">
                      <strong>Rejection Reason:</strong>
                      <span>{order.discrepancy.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="order-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <div className="footer-actions-right">
            {canFileDiscrepancy() && (
              <button className="btn-discrepancy" onClick={() => setShowDiscrepancyModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33968 16C2.56986 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                File Discrepancy
              </button>
            )}
            <button className="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Discrepancy Modal */}
      {showDiscrepancyModal && (
        <div className="discrepancy-modal-overlay" onClick={() => setShowDiscrepancyModal(false)}>
          <div className="discrepancy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="discrepancy-modal-header">
              <h2>File Order Discrepancy</h2>
              <button className="close-btn" onClick={() => setShowDiscrepancyModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleDiscrepancySubmit} className="discrepancy-form">
              <p className="discrepancy-intro">
                If your order arrived incomplete, damaged, or with incorrect items, please provide details below.
                Our team will review your claim and process a refund if approved.
              </p>

              <div className="form-group">
                <label>Discrepancy Type *</label>
                <select
                  value={discrepancyForm.type}
                  onChange={(e) => setDiscrepancyForm({...discrepancyForm, type: e.target.value})}
                  required
                >
                  <option value="incomplete">Incomplete Order - Missing Items</option>
                  <option value="damaged">Damaged or Broken Parts</option>
                  <option value="wrong-item">Wrong Item Received</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              <div className="form-group">
                <label>Affected Items *</label>
                <div className="items-checkbox-list">
                  {order.items.map((item) => (
                    <label key={item.code} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={discrepancyForm.affectedItems.includes(item.code)}
                        onChange={() => handleItemToggle(item.code)}
                      />
                      <span>{item.name} (Part #{item.code})</span>
                    </label>
                  ))}
                </div>
                {discrepancyForm.affectedItems.length === 0 && (
                  <span className="field-hint">Please select at least one affected item</span>
                )}
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={discrepancyForm.description}
                  onChange={(e) => setDiscrepancyForm({...discrepancyForm, description: e.target.value})}
                  required
                  rows="4"
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              <div className="form-group refund-display">
                <label>Calculated Refund Amount</label>
                <div className="refund-amount-display">
                  ${calculateRefundAmount().toFixed(2)}
                </div>
                <span className="field-hint">
                  {discrepancyForm.affectedItems.length === 0
                    ? 'Select affected items to calculate refund'
                    : `Based on ${discrepancyForm.affectedItems.length} affected item(s)`}
                </span>
              </div>

              <div className="discrepancy-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowDiscrepancyModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={discrepancyForm.affectedItems.length === 0}
                >
                  Submit Discrepancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetailModal;
