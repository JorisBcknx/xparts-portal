import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Review, 3: Payment
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [itemShippingMap, setItemShippingMap] = useState({}); // Maps item index to address ID
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: ''
  });

  // Sample addresses (in real app, fetch from user profile)
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr1',
      firstName: 'Mark',
      lastName: 'Rivers',
      company: 'Rustic Hardware',
      street: '123 Main Street',
      apartment: 'Suite 200',
      city: 'Baltimore',
      state: 'MD',
      zip: '21201',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true
    },
    {
      id: 'addr2',
      firstName: 'Mark',
      lastName: 'Rivers',
      company: 'Rustic Hardware - Warehouse',
      street: '456 Industrial Blvd',
      apartment: '',
      city: 'Greensboro',
      state: 'NC',
      zip: '27401',
      country: 'United States',
      phone: '(555) 987-6543',
      isDefault: false
    },
    {
      id: 'addr3',
      firstName: 'Mark',
      lastName: 'Rivers',
      company: 'Rustic Hardware - Service Center',
      street: '789 Repair Lane',
      apartment: '',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'United States',
      phone: '(555) 456-7890',
      isDefault: false
    }
  ]);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L7 7M17 2L19 7M7 7L6 21H18L17 7M7 7H17M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to proceed with checkout</p>
          <button className="browse-btn" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get item price
  const getItemPrice = (item) => {
    if (item.selectedWarehouse) {
      return item.selectedWarehouse.price;
    }
    if (typeof item.price === 'number') {
      return item.price;
    }
    return item.price?.value || 0;
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = getItemPrice(item);
    return total + (price * item.quantity);
  }, 0);

  const shipping = 15.00; // Flat rate shipping
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const getItemShippingAddress = (itemIndex) => {
    return itemShippingMap[itemIndex] || selectedAddressId;
  };

  const handleAssignAddress = (itemIndex, addressId) => {
    setItemShippingMap(prev => ({
      ...prev,
      [itemIndex]: addressId
    }));
  };

  const handleAssignAllToSameAddress = (addressId) => {
    const newMap = {};
    cartItems.forEach((_, index) => {
      newMap[index] = addressId;
    });
    setItemShippingMap(newMap);
    setSelectedAddressId(addressId);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      ...newAddress,
      id: `addr${Date.now()}`,
      isDefault: false
    };
    setSavedAddresses(prev => [...prev, newAddr]);
    setShowAddAddressForm(false);
    setNewAddress({
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: ''
    });
  };

  const handlePlaceOrder = () => {
    // Group items by shipping address
    const groupedByAddress = {};
    cartItems.forEach((item, index) => {
      const addressId = getItemShippingAddress(index);
      if (!groupedByAddress[addressId]) {
        groupedByAddress[addressId] = [];
      }
      groupedByAddress[addressId].push(item);
    });

    // Create order with shipping information
    const orderData = {
      customer: {
        name: 'Mark Rivers',
        email: 'mark.rivers@rustic-hw.com',
        company: 'Rustic Hardware',
        phone: ''
      },
      items: cartItems.map((item, index) => ({
        ...item,
        originalPrice: getItemPrice(item),
        finalPrice: getItemPrice(item),
        discountPercent: 0,
        shippingAddressId: getItemShippingAddress(index)
      })),
      shippingAddresses: Object.keys(groupedByAddress).map(addressId => {
        const address = savedAddresses.find(a => a.id === addressId);
        return {
          ...address,
          items: groupedByAddress[addressId].map(item => item.code)
        };
      }),
      subtotal,
      discount: 0,
      discountPercent: 0,
      tax,
      shipping,
      total,
      notes: ''
    };

    const order = createOrder(orderData);

    if (order) {
      clearCart();
      navigate('/orders', { state: { orderConfirmation: order.id } });
    }
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      // Check if all items have shipping addresses assigned
      return cartItems.every((_, index) => getItemShippingAddress(index) !== null);
    }
    return true;
  };

  return (
    <div className="checkout-page">
      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">
            {currentStep > 1 ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : '1'}
          </div>
          <div className="step-label">Shipping Address</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">
            {currentStep > 2 ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : '2'}
          </div>
          <div className="step-label">Review Order</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Payment</div>
        </div>
      </div>

      <div className="checkout-content">
        {/* Step 1: Shipping Address */}
        {currentStep === 1 && (
          <div className="checkout-step-content">
            <h2>Shipping Address</h2>
            <p className="step-description">Select delivery addresses for your items. You can ship different items to different locations.</p>

            {/* Address Selection */}
            <div className="address-section">
              <h3>Saved Addresses</h3>
              <div className="addresses-grid">
                {savedAddresses.map(address => (
                  <div
                    key={address.id}
                    className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    {address.isDefault && <div className="default-badge">Default</div>}
                    <div className="address-name">{address.firstName} {address.lastName}</div>
                    {address.company && <div className="address-company">{address.company}</div>}
                    <div className="address-street">{address.street}</div>
                    {address.apartment && <div className="address-apartment">{address.apartment}</div>}
                    <div className="address-city">{address.city}, {address.state} {address.zip}</div>
                    <div className="address-phone">{address.phone}</div>

                    <button
                      className="assign-all-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignAllToSameAddress(address.id);
                      }}
                    >
                      Ship All Items Here
                    </button>
                  </div>
                ))}

                <div className="address-card add-new" onClick={() => setShowAddAddressForm(true)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="add-new-label">Add New Address</div>
                </div>
              </div>
            </div>

            {/* Item Shipping Assignment */}
            {selectedAddressId && (
              <div className="items-shipping-section">
                <h3>Assign Items to Addresses</h3>
                <p className="section-note">Click on an item to change its shipping address</p>

                <div className="items-shipping-list">
                  {cartItems.map((item, index) => {
                    const itemAddressId = getItemShippingAddress(index);

                    return (
                      <div key={index} className="item-shipping-card">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-code">OEM: {item.code}</div>
                          <div className="item-qty">Quantity: {item.quantity}</div>
                        </div>
                        <div className="item-shipping-select">
                          <label>Ship to:</label>
                          <select
                            value={itemAddressId || ''}
                            onChange={(e) => handleAssignAddress(index, e.target.value)}
                          >
                            <option value="">Select address...</option>
                            {savedAddresses.map(addr => (
                              <option key={addr.id} value={addr.id}>
                                {addr.company || `${addr.firstName} ${addr.lastName}`} - {addr.city}, {addr.state}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review Order */}
        {currentStep === 2 && (
          <div className="checkout-step-content">
            <h2>Review Your Order</h2>
            <p className="step-description">Please review your order details before proceeding to payment.</p>

            {/* Group items by shipping address */}
            {Object.entries(
              cartItems.reduce((acc, item, index) => {
                const addressId = getItemShippingAddress(index);
                if (!acc[addressId]) acc[addressId] = [];
                acc[addressId].push({ ...item, index });
                return acc;
              }, {})
            ).map(([addressId, items]) => {
              const address = savedAddresses.find(a => a.id === addressId);
              return (
                <div key={addressId} className="shipping-group">
                  <div className="shipping-group-header">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div>
                      <div className="group-title">Shipping to: {address.company || `${address.firstName} ${address.lastName}`}</div>
                      <div className="group-address">{address.street}, {address.city}, {address.state} {address.zip}</div>
                    </div>
                  </div>
                  <div className="group-items">
                    {items.map(item => (
                      <div key={item.index} className="review-item">
                        <img src={item.image} alt={item.name} />
                        <div className="review-item-info">
                          <div className="review-item-name">{item.name}</div>
                          <div className="review-item-code">OEM: {item.code}</div>
                          <div className="review-item-qty">Qty: {item.quantity}</div>
                        </div>
                        <div className="review-item-price">
                          ${(getItemPrice(item) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="checkout-step-content">
            <h2>Payment Information</h2>
            <p className="step-description">Choose your payment method to complete your order.</p>

            <div className="payment-methods">
              <div className="payment-method selected">
                <input type="radio" name="payment" id="purchase-order" defaultChecked />
                <label htmlFor="purchase-order">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <div>
                    <div className="method-name">Purchase Order</div>
                    <div className="method-desc">Pay via company purchase order</div>
                  </div>
                </label>
              </div>

              <div className="payment-method">
                <input type="radio" name="payment" id="invoice" />
                <label htmlFor="invoice">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M1 10H23M1 14H23" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <div>
                    <div className="method-name">Invoice (Net 30)</div>
                    <div className="method-desc">Pay within 30 days of invoice</div>
                  </div>
                </label>
              </div>

              <div className="payment-method">
                <input type="radio" name="payment" id="credit" />
                <label htmlFor="credit">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <div>
                    <div className="method-name">Credit Card</div>
                    <div className="method-desc">Pay with company credit card</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="payment-note">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Your payment information is secure and encrypted. All transactions are processed through Mack Financial Services.</p>
            </div>
          </div>
        )}

        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal ({cartItems.length} items):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Navigation Buttons */}
            <div className="checkout-actions">
              {currentStep > 1 && (
                <button className="back-btn" onClick={() => setCurrentStep(currentStep - 1)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  className="continue-btn"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNextStep()}
                >
                  Continue
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Place Order
                </button>
              )}
            </div>

            <div className="secure-checkout">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17 22 21 18 21 13V5L12 2L3 5V13C3 18 7 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressForm && (
        <div className="modal-overlay" onClick={() => setShowAddAddressForm(false)}>
          <div className="address-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddAddressForm(false)}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2>Add New Address</h2>
            <form onSubmit={handleAddAddress} className="address-form">
              <div className="form-row">
                <div className="form-field">
                  <label>First Name *</label>
                  <input type="text" required value={newAddress.firstName} onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Last Name *</label>
                  <input type="text" required value={newAddress.lastName} onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-field">
                <label>Company</label>
                <input type="text" value={newAddress.company} onChange={(e) => setNewAddress({...newAddress, company: e.target.value})} />
              </div>
              <div className="form-field">
                <label>Street Address *</label>
                <input type="text" required value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} />
              </div>
              <div className="form-field">
                <label>Apartment, Suite, etc.</label>
                <input type="text" value={newAddress.apartment} onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>City *</label>
                  <input type="text" required value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>State *</label>
                  <input type="text" required value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>ZIP Code *</label>
                  <input type="text" required value={newAddress.zip} onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} />
                </div>
              </div>
              <div className="form-field">
                <label>Phone *</label>
                <input type="tel" required value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddAddressForm(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
