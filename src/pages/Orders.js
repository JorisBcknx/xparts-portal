import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useASM } from '../context/ASMContext';
import OrderDetailModal from '../components/OrderDetailModal';
import OrderPageTour from '../components/OrderPageTour';
import './Orders.css';

function Orders() {
  const { orders: allOrders, getOrdersByCustomer } = useOrders();
  const { asmActive, emulatedCustomer } = useASM();
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPageTour, setShowPageTour] = useState(false);

  // If in ASM mode, show orders for emulated customer, otherwise show all orders
  const orders = asmActive && emulatedCustomer
    ? getOrdersByCustomer(emulatedCustomer.email)
    : allOrders;

  // Filter by status
  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  // Calculate stats
  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Processing').length,
    delivered: orders.filter(o => o.status === 'Delivered' || o.status === 'Partially Delivered').length,
    shipped: orders.filter(o => o.status === 'Shipped').length
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Shipped': 'status-shipped',
      'Processing': 'status-processing',
      'Delivered': 'status-delivered',
      'Partially Delivered': 'status-partial',
      'Pending': 'status-pending',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
  };

  const getPaymentClass = (payment) => {
    const paymentMap = {
      'Paid': 'payment-paid',
      'Pending': 'payment-pending',
      'Refunded': 'payment-refunded'
    };
    return paymentMap[payment] || 'payment-pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderItemsSummary = (items) => {
    if (!items || items.length === 0) return 'No items';
    if (items.length === 1) return items[0].name;
    if (items.length === 2) return `${items[0].name}, ${items[1].name}`;
    return `${items[0].name}, ${items[1].name} +${items.length - 2} more`;
  };

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="page-header">
          <div>
            <h1>Orders</h1>
            <p className="page-subtitle">Track and manage your orders</p>
          </div>
        </div>
        <div className="orders-empty">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>No Orders Yet</h2>
          <p>Orders created from accepted quotes will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">Track and manage customer orders</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="page-tour-button" onClick={() => setShowPageTour(true)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.228 9C8.68 7.8 9.8 7 11 7C12.7 7 14 8.3 14 10C14 11.7 12.7 13 11 13C9.8 13 8.7 12.2 8.2 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Page Tour
          </button>
          <button className="primary-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Order
          </button>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#007bff' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Processing</div>
            <div className="stat-value">{stats.processing}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#00a86b' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Delivered</div>
            <div className="stat-value">{stats.delivered}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#ff6b00' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Shipped</div>
            <div className="stat-value">{stats.shipped}</div>
          </div>
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-filters">
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Parts Ordered</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="order-id">{order.id}</div>
                    {order.quoteId && (
                      <div className="quote-reference">From Quote: {order.quoteId}</div>
                    )}
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.customer.name}</div>
                      <div className="customer-email">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="parts-cell">{getOrderItemsSummary(order.items)}</td>
                  <td className="amount">${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    {order.status === 'Partially Delivered' && order.partialDeliveryInfo && (
                      <div className="partial-delivery-info">
                        <small>
                          {order.partialDeliveryInfo.delivered.length} of {order.items.length} shipments received
                        </small>
                      </div>
                    )}
                    {order.discrepancy && (
                      <div className={`discrepancy-indicator ${order.discrepancy.status}`}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33968 16C2.56986 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>
                          {order.discrepancy.status === 'pending' && 'Discrepancy Filed'}
                          {order.discrepancy.status === 'approved' && 'Discrepancy Approved'}
                          {order.discrepancy.status === 'rejected' && 'Discrepancy Rejected'}
                          {order.discrepancy.status === 'refund-processing' && 'Refund Processing'}
                          {order.discrepancy.status === 'refunded' && 'Refunded'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`payment-badge ${getPaymentClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="date">{formatDate(order.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="View Details" onClick={() => setSelectedOrder(order)}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                      {order.trackingNumber && (
                        <button className="icon-btn" title={`Track: ${order.trackingNumber}`}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
                          </svg>
                        </button>
                      )}
                      <button className="icon-btn" title="Print Invoice">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {showPageTour && (
        <OrderPageTour onClose={() => setShowPageTour(false)} />
      )}
    </div>
  );
}

export default Orders;
