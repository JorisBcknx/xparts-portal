import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import './ASMDiscrepancies.css';

function ASMDiscrepancies({ onClose }) {
  const { orders, approveDiscrepancy, rejectDiscrepancy, processRefund, completeRefund } = useOrders();
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [agentNotes, setAgentNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [refundTransactionId, setRefundTransactionId] = useState('');

  // Get all orders with discrepancies
  const ordersWithDiscrepancies = orders.filter(order => order.discrepancy);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'refund-processing': 'status-processing',
      'refunded': 'status-refunded'
    };
    return statusMap[status] || '';
  };

  const handleApprove = () => {
    if (selectedDiscrepancy) {
      approveDiscrepancy(selectedDiscrepancy.id, agentNotes);
      setShowApproveModal(false);
      setAgentNotes('');
      setSelectedDiscrepancy(null);
    }
  };

  const handleReject = () => {
    if (selectedDiscrepancy && rejectionReason.trim()) {
      rejectDiscrepancy(selectedDiscrepancy.id, rejectionReason, agentNotes);
      setShowRejectModal(false);
      setRejectionReason('');
      setAgentNotes('');
      setSelectedDiscrepancy(null);
    }
  };

  const handleProcessRefund = (order) => {
    processRefund(order.id);
    setSelectedDiscrepancy(null);
  };

  const handleCompleteRefund = () => {
    if (selectedDiscrepancy) {
      completeRefund(selectedDiscrepancy.id, refundTransactionId);
      setShowRefundModal(false);
      setRefundTransactionId('');
      setSelectedDiscrepancy(null);
    }
  };

  return (
    <div className="asm-discrepancies-overlay" onClick={onClose}>
      <div className="asm-discrepancies-modal" onClick={(e) => e.stopPropagation()}>
        <div className="asm-discrepancies-header">
          <div>
            <h2>Order Discrepancies</h2>
            <p className="subtitle">Review and manage customer discrepancy claims</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="asm-discrepancies-content">
          {ordersWithDiscrepancies.length === 0 ? (
            <div className="no-discrepancies">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No Discrepancies</h3>
              <p>All orders are in good standing</p>
            </div>
          ) : (
            <div className="discrepancies-list">
              {ordersWithDiscrepancies.map(order => (
                <div key={order.id} className={`discrepancy-card ${getStatusBadgeClass(order.discrepancy.status)}`}>
                  <div className="discrepancy-card-header">
                    <div className="order-info">
                      <h3>{order.id}</h3>
                      <p className="customer-name">{order.customer.name} ({order.customer.email})</p>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(order.discrepancy.status)}`}>
                      {order.discrepancy.status === 'pending' && '⏳ Pending Review'}
                      {order.discrepancy.status === 'approved' && '✓ Approved'}
                      {order.discrepancy.status === 'rejected' && '✗ Rejected'}
                      {order.discrepancy.status === 'refund-processing' && '💳 Processing'}
                      {order.discrepancy.status === 'refunded' && '✓ Refunded'}
                    </span>
                  </div>

                  <div className="discrepancy-details">
                    <div className="detail-row">
                      <strong>Type:</strong>
                      <span>
                        {order.discrepancy.type === 'incomplete' && '📦 Incomplete Order'}
                        {order.discrepancy.type === 'damaged' && '⚠️ Damaged Parts'}
                        {order.discrepancy.type === 'wrong-item' && '🔄 Wrong Item'}
                        {order.discrepancy.type === 'other' && '❓ Other'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <strong>Filed:</strong>
                      <span>{formatDate(order.discrepancy.filedAt)}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Requested Refund:</strong>
                      <span className="refund-amount">${parseFloat(order.discrepancy.requestedAmount).toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Description:</strong>
                      <span>{order.discrepancy.description}</span>
                    </div>
                    {order.discrepancy.affectedItems.length > 0 && (
                      <div className="detail-row">
                        <strong>Affected Items:</strong>
                        <ul className="affected-items">
                          {order.discrepancy.affectedItems.map((itemCode, idx) => {
                            const item = order.items.find(i => i.code === itemCode);
                            return <li key={idx}>{item ? item.name : itemCode}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="discrepancy-actions">
                    {order.discrepancy.status === 'pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => {
                            setSelectedDiscrepancy(order);
                            setShowApproveModal(true);
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => {
                            setSelectedDiscrepancy(order);
                            setShowRejectModal(true);
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Reject
                        </button>
                      </>
                    )}
                    {order.discrepancy.status === 'approved' && (
                      <button
                        className="btn-refund"
                        onClick={() => handleProcessRefund(order)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 10H13C14.1046 10 15 10.8954 15 12V21M3 10L8 5M3 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Push to ERP (Process Refund)
                      </button>
                    )}
                    {order.discrepancy.status === 'refund-processing' && (
                      <button
                        className="btn-complete"
                        onClick={() => {
                          setSelectedDiscrepancy(order);
                          setShowRefundModal(true);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Complete Refund
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedDiscrepancy && (
        <div className="action-modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Approve Discrepancy</h3>
            <p>Are you sure you want to approve this discrepancy claim for <strong>${parseFloat(selectedDiscrepancy.discrepancy.requestedAmount).toFixed(2)}</strong>?</p>
            <div className="form-group">
              <label>Agent Notes (Optional)</label>
              <textarea
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                rows="3"
                placeholder="Add any notes for this approval..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button className="btn-confirm-approve" onClick={handleApprove}>Approve Claim</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedDiscrepancy && (
        <div className="action-modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Discrepancy</h3>
            <p>Please provide a reason for rejecting this discrepancy claim.</p>
            <div className="form-group">
              <label>Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="3"
                placeholder="Why is this claim being rejected?"
                required
              />
            </div>
            <div className="form-group">
              <label>Agent Notes (Optional)</label>
              <textarea
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                rows="2"
                placeholder="Additional notes..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button
                className="btn-confirm-reject"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Refund Modal */}
      {showRefundModal && selectedDiscrepancy && (
        <div className="action-modal-overlay" onClick={() => setShowRefundModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Complete Refund</h3>
            <p>Confirm that the refund of <strong>${parseFloat(selectedDiscrepancy.discrepancy.requestedAmount).toFixed(2)}</strong> has been processed.</p>
            <div className="form-group">
              <label>Transaction ID (Optional)</label>
              <input
                type="text"
                value={refundTransactionId}
                onChange={(e) => setRefundTransactionId(e.target.value)}
                placeholder="Enter ERP transaction ID..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowRefundModal(false)}>Cancel</button>
              <button className="btn-confirm-complete" onClick={handleCompleteRefund}>Mark as Refunded</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ASMDiscrepancies;
