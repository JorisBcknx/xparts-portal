import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useQuotes } from '../context/QuoteContext';
import { useSearch } from '../context/SearchContext';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { createQuote } = useQuotes();
  const { allProducts } = useSearch();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showItemDiscountModal, setShowItemDiscountModal] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);
  const [itemDiscountRequests, setItemDiscountRequests] = useState({});
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [csvProcessing, setCsvProcessing] = useState(false);
  const [csvError, setCsvError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [quickAddCode, setQuickAddCode] = useState('');
  const [quickAddQty, setQuickAddQty] = useState(1);
  const [quickAddError, setQuickAddError] = useState('');
  const [quickAddSuccess, setQuickAddSuccess] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentDiscountRequest, setCurrentDiscountRequest] = useState({
    requestedDiscount: '',
    reason: ''
  });
  const [quoteData, setQuoteData] = useState({
    customerName: 'Mark Rivers',
    email: 'mark.rivers@rustic-hw.com',
    phone: '',
    company: 'Rustic Hardware',
    notes: ''
  });

  const handleQuantityChange = (item, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (qty > 0 && qty <= 999) {
      updateQuantity(item.code, qty, item.selectedWarehouse?.location);
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.code, item.selectedWarehouse?.location);
  };

  const getItemPrice = (item) => {
    return item.selectedWarehouse?.price ||
           (typeof item.price === 'number' ? item.price : item.price?.value || 0);
  };

  const getItemSubtotal = (item) => {
    return getItemPrice(item) * item.quantity;
  };

  const handleQuickAddInputChange = (value) => {
    setQuickAddCode(value);
    setQuickAddError('');

    if (value.trim().length > 0) {
      // Filter products by code or name
      const matches = allProducts.filter(p =>
        p.code.toLowerCase().includes(value.toLowerCase()) ||
        p.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions

      setFilteredProducts(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setFilteredProducts([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (product) => {
    setQuickAddCode(product.code);
    setShowSuggestions(false);
    setFilteredProducts([]);
  };

  const handleQuickAdd = () => {
    setQuickAddError('');
    setQuickAddSuccess('');

    if (!quickAddCode.trim()) {
      setQuickAddError('Please enter a product code');
      return;
    }

    // Find product by code (case-insensitive)
    const product = allProducts.find(p =>
      p.code.toLowerCase() === quickAddCode.trim().toLowerCase()
    );

    if (!product) {
      setQuickAddError(`Product "${quickAddCode}" not found`);
      return;
    }

    const qty = parseInt(quickAddQty) || 1;
    if (qty < 1 || qty > 999) {
      setQuickAddError('Quantity must be between 1 and 999');
      return;
    }

    // Add to cart
    addToCart(product, qty);
    setQuickAddSuccess(`Added ${qty}x ${product.name} to cart`);
    setQuickAddCode('');
    setQuickAddQty(1);
    setShowSuggestions(false);
    setFilteredProducts([]);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setQuickAddSuccess('');
    }, 3000);
  };

  const handleQuickAddKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuickAdd();
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = cartItems.length > 0 ? 25.00 : 0; // Flat rate shipping
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleRequestQuote = () => {
    setShowQuoteForm(true);
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();

    // Build notes that include all discount requests
    let notesWithDiscounts = quoteData.notes;

    if (Object.keys(itemDiscountRequests).length > 0) {
      notesWithDiscounts += '\n\n=== DISCOUNT REQUESTS ===\n\n';

      cartItems.forEach(item => {
        const itemKey = `${item.code}_${item.selectedWarehouse?.location || 'main'}`;
        const discountRequest = itemDiscountRequests[itemKey];

        if (discountRequest) {
          notesWithDiscounts += `📌 ${item.name} (${item.code})\n`;
          notesWithDiscounts += `   Requested Discount: ${discountRequest.requestedDiscount}%\n`;
          notesWithDiscounts += `   Reason: ${discountRequest.reason}\n`;
          notesWithDiscounts += `   Current Price: $${getItemPrice(item).toFixed(2)}\n`;
          notesWithDiscounts += `   Quantity: ${item.quantity}\n`;
          notesWithDiscounts += `   Potential Savings: $${(getItemPrice(item) * (discountRequest.requestedDiscount / 100) * item.quantity).toFixed(2)}\n\n`;
        }
      });
    }

    const quote = createQuote({
      ...quoteData,
      items: cartItems,
      subtotal,
      notes: notesWithDiscounts
    });

    const discountItemCount = Object.keys(itemDiscountRequests).length;
    const message = discountItemCount > 0
      ? `Quote request #${quote.id} submitted successfully!\n\n${discountItemCount} item(s) marked for discount review.\nYou will receive a detailed quote within 24 hours.`
      : `Quote request #${quote.id} submitted successfully! You will receive a detailed quote within 24 hours.`;

    alert(message);
    setShowQuoteForm(false);
    setItemDiscountRequests({});
    clearCart();
    navigate('/quotes');
  };

  const handleRequestItemDiscount = (item) => {
    setSelectedItemForDiscount(item);
    // Load existing discount request if any
    const itemKey = `${item.code}_${item.selectedWarehouse?.location || 'main'}`;
    if (itemDiscountRequests[itemKey]) {
      setCurrentDiscountRequest(itemDiscountRequests[itemKey]);
    } else {
      setCurrentDiscountRequest({
        requestedDiscount: '',
        reason: ''
      });
    }
    setShowItemDiscountModal(true);
  };

  const handleSaveItemDiscountRequest = (e) => {
    e.preventDefault();

    // Save the discount request to state
    const itemKey = `${selectedItemForDiscount.code}_${selectedItemForDiscount.selectedWarehouse?.location || 'main'}`;
    setItemDiscountRequests({
      ...itemDiscountRequests,
      [itemKey]: {
        requestedDiscount: currentDiscountRequest.requestedDiscount,
        reason: currentDiscountRequest.reason
      }
    });

    alert(`Discount request saved for ${selectedItemForDiscount.name}!\n\nWhen you proceed with "Request a Quote", this item will be marked for discount review.`);
    setShowItemDiscountModal(false);
    setSelectedItemForDiscount(null);
  };

  const handleRemoveItemDiscountRequest = (item) => {
    const itemKey = `${item.code}_${item.selectedWarehouse?.location || 'main'}`;
    const newRequests = { ...itemDiscountRequests };
    delete newRequests[itemKey];
    setItemDiscountRequests(newRequests);
  };

  const getItemDiscountRequest = (item) => {
    const itemKey = `${item.code}_${item.selectedWarehouse?.location || 'main'}`;
    return itemDiscountRequests[itemKey];
  };

  const handleCancelItemDiscount = () => {
    setShowItemDiscountModal(false);
    setSelectedItemForDiscount(null);
  };

  // Quick Order CSV Upload handlers
  const handleCsvUpload = async (file) => {
    if (!file || file.type !== 'text/csv') {
      setCsvError('Please upload a valid CSV file');
      return;
    }

    setCsvProcessing(true);
    setCsvError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      let addedCount = 0;
      let notFoundCount = 0;
      const notFoundItems = [];

      lines.forEach((line, index) => {
        // Skip header row
        if (index === 0 && (line.toLowerCase().includes('part') || line.toLowerCase().includes('quantity'))) {
          return;
        }

        const parts = line.split(',').map(p => p.trim().replace(/['"]/g, ''));
        if (parts.length < 2) return;

        const partNumber = parts[0];
        const quantity = parseInt(parts[1], 10);

        if (!partNumber || isNaN(quantity) || quantity <= 0) return;

        // Find product in catalog
        const product = allProducts.find(p =>
          p.code.toLowerCase() === partNumber.toLowerCase()
        );

        if (product) {
          addToCart(product, quantity, null);
          addedCount++;
        } else {
          notFoundItems.push(partNumber);
          notFoundCount++;
        }
      });

      if (addedCount > 0) {
        alert(`Successfully added ${addedCount} item(s) to cart${notFoundCount > 0 ? `\n\n${notFoundCount} item(s) not found: ${notFoundItems.join(', ')}` : ''}`);
        setShowQuickOrder(false);
      } else {
        setCsvError('No valid items found in CSV file');
      }
    } catch (err) {
      setCsvError('Error reading CSV file. Please ensure it is properly formatted.');
      console.error('CSV error:', err);
    } finally {
      setCsvProcessing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCsvUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCsvUpload(e.target.files[0]);
    }
  };

  if (cartItems.length === 0 && !showQuoteForm) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Your Cart is Empty</h2>
          <p>Add some genuine parts to get started</p>

          {/* Quick Add Product by Code */}
          <div className="quick-add-section-empty">
            <h3>Quick Add by Product Code</h3>
            <div className="quick-add-form-wrapper">
              <div className="quick-add-form">
                <div className="quick-add-autocomplete">
                  <input
                    type="text"
                    placeholder="Enter part number or name (e.g., 85142795)"
                    value={quickAddCode}
                    onChange={(e) => handleQuickAddInputChange(e.target.value)}
                    onKeyPress={handleQuickAddKeyPress}
                    onFocus={() => {
                      if (filteredProducts.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      // Delay to allow click on suggestion
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    className="quick-add-input"
                  />
                  {showSuggestions && filteredProducts.length > 0 && (
                    <div className="quick-add-suggestions">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.code}
                          className="suggestion-item"
                          onClick={() => handleSelectSuggestion(product)}
                        >
                          <div className="suggestion-code">{product.code}</div>
                          <div className="suggestion-name">{product.name}</div>
                          <div className="suggestion-price">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price?.value?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                type="number"
                min="1"
                max="999"
                value={quickAddQty}
                onChange={(e) => setQuickAddQty(e.target.value)}
                onKeyPress={handleQuickAddKeyPress}
                className="quick-add-qty"
                placeholder="Qty"
              />
              <button onClick={handleQuickAdd} className="quick-add-btn-empty">
                Add to Cart
              </button>
            </div>
            </div>
            {quickAddError && (
              <div className="quick-add-message error">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {quickAddError}
              </div>
            )}
            {quickAddSuccess && (
              <div className="quick-add-message success">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {quickAddSuccess}
              </div>
            )}
          </div>

          <div className="empty-cart-actions">
            <button className="browse-btn" onClick={() => navigate('/products')}>
              Browse Products
            </button>
            <span className="action-divider">or</span>
            <button className="quick-order-empty-btn" onClick={() => setShowQuickOrder(!showQuickOrder)}>
              Quick Order (Upload CSV)
            </button>
          </div>

          {showQuickOrder && (
            <div className="quick-order-card-empty">
              <div className="quick-order-header">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                  <path d="M8 15.5H16V17H8V15.5Z" fill="currentColor"/>
                  <path d="M8 12H16V13.5H8V12Z" fill="currentColor"/>
                </svg>
                <div>
                  <h3>Upload CSV File</h3>
                  <p>Add multiple items to cart at once using a CSV file</p>
                </div>
              </div>

              <div
                className={`csv-upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
                </svg>
                <p className="upload-title">Drag and drop your CSV file here</p>
                <p className="upload-subtitle">or</p>
                <label className="browse-btn-csv">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {csvError && (
                <div className="csv-error">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                  </svg>
                  {csvError}
                </div>
              )}

              {csvProcessing && (
                <div className="csv-processing">
                  <div className="spinner"></div>
                  Processing CSV file...
                </div>
              )}

              <div className="csv-format-info">
                <h4>CSV Format Requirements:</h4>
                <ul>
                  <li><strong>Column 1:</strong> Part Number (OEM Code)</li>
                  <li><strong>Column 2:</strong> Quantity</li>
                </ul>
                <p className="format-example">
                  Example: <code>85103616,2</code> or <code>"85103616","2"</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showQuoteForm) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={() => setShowQuoteForm(false)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Cart
          </button>
          <h1>Request a Quote</h1>
        </div>

        <div className="quote-container">
          <div className="quote-form-section">
            <form onSubmit={handleSubmitQuote}>
              <div className="quote-form-header">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Contact Information</h3>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={quoteData.customerName}
                    onChange={(e) => setQuoteData({...quoteData, customerName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={quoteData.email}
                    onChange={(e) => setQuoteData({...quoteData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={quoteData.phone}
                    onChange={(e) => setQuoteData({...quoteData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-field">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    value={quoteData.company}
                    onChange={(e) => setQuoteData({...quoteData, company: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-field full-width">
                <label>Additional Notes</label>
                <textarea
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})}
                  placeholder="Any special requirements, delivery instructions, or questions..."
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-quote-btn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Submit Quote Request
              </button>
            </form>
          </div>

          <div className="quote-summary">
            <h3>Quote Summary</h3>
            <div className="quote-items">
              {cartItems.map((item, index) => (
                <div key={index} className="quote-item">
                  <img src={item.image} alt={item.name} />
                  <div className="quote-item-info">
                    <div className="quote-item-name">{item.name}</div>
                    <div className="quote-item-code">OEM: {item.code}</div>
                    <div className="quote-item-qty">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="quote-total">
              <span>Estimated Total:</span>
              <span className="quote-total-amount">${subtotal.toFixed(2)}</span>
            </div>
            <p className="quote-note">
              Final pricing will be provided in your quote and may vary based on current availability and delivery options.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <div className="cart-item-count">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</div>
      </div>

      {/* Quick Add Product by Code */}
      <div className="quick-add-section">
        <div className="quick-add-header">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Quick Add Product</h3>
        </div>
        <div className="quick-add-form">
          <div className="quick-add-input-group">
            <label>Product Code / Name</label>
            <div className="quick-add-autocomplete">
              <input
                type="text"
                placeholder="Enter part number or name (e.g., 85142795)"
                value={quickAddCode}
                onChange={(e) => handleQuickAddInputChange(e.target.value)}
                onKeyPress={handleQuickAddKeyPress}
                onFocus={() => {
                  if (filteredProducts.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  // Delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="quick-add-input"
              />
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="quick-add-suggestions">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.code}
                      className="suggestion-item"
                      onClick={() => handleSelectSuggestion(product)}
                    >
                      <div className="suggestion-code">{product.code}</div>
                      <div className="suggestion-name">{product.name}</div>
                      <div className="suggestion-price">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price?.value?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="quick-add-input-group qty-input">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              max="999"
              value={quickAddQty}
              onChange={(e) => setQuickAddQty(e.target.value)}
              onKeyPress={handleQuickAddKeyPress}
              className="quick-add-qty"
            />
          </div>
          <button onClick={handleQuickAdd} className="quick-add-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to Cart
          </button>
        </div>
        {quickAddError && (
          <div className="quick-add-message error">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {quickAddError}
          </div>
        )}
        {quickAddSuccess && (
          <div className="quick-add-message success">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {quickAddSuccess}
          </div>
        )}
      </div>

      {/* Quick Order CSV Upload Section */}
      <div className="quick-order-cart-section">
        <button
          className="toggle-quick-order-btn"
          onClick={() => setShowQuickOrder(!showQuickOrder)}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
          {showQuickOrder ? 'Hide Quick Order' : 'Quick Order (CSV Upload)'}
        </button>

        {showQuickOrder && (
          <div className="quick-order-card">
            <div className="quick-order-header">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                <path d="M8 15.5H16V17H8V15.5Z" fill="currentColor"/>
                <path d="M8 12H16V13.5H8V12Z" fill="currentColor"/>
              </svg>
              <div>
                <h3>Upload CSV File</h3>
                <p>Add multiple items to cart at once using a CSV file</p>
              </div>
            </div>

            <div
              className={`csv-upload-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
              </svg>
              <p className="upload-title">Drag and drop your CSV file here</p>
              <p className="upload-subtitle">or</p>
              <label className="browse-btn">
                Browse Files
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {csvError && (
              <div className="csv-error">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                {csvError}
              </div>
            )}

            {csvProcessing && (
              <div className="csv-processing">
                <div className="spinner"></div>
                Processing CSV file...
              </div>
            )}

            <div className="csv-format-info">
              <h4>CSV Format Requirements:</h4>
              <ul>
                <li><strong>Column 1:</strong> Part Number (OEM Code)</li>
                <li><strong>Column 2:</strong> Quantity</li>
              </ul>
              <p className="format-example">
                Example: <code>85103616,2</code> or <code>"85103616","2"</code>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <div className="col-product">Product</div>
            <div className="col-warehouse">Warehouse</div>
            <div className="col-price">Price</div>
            <div className="col-quantity">Quantity</div>
            <div className="col-subtotal">Subtotal</div>
            <div className="col-actions"></div>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item, index) => {
              const discountRequest = getItemDiscountRequest(item);
              return (
                <div key={index} className={`cart-item ${discountRequest ? 'has-discount-request' : ''}`}>
                  <div className="col-product">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-code">OEM: {item.code}</div>
                      {item.categories && (
                        <div className="cart-item-category">
                          {typeof item.categories === 'string'
                            ? item.categories
                            : Array.isArray(item.categories)
                            ? item.categories.map(cat => typeof cat === 'string' ? cat : cat.name).join(', ')
                            : ''}
                        </div>
                      )}
                      {discountRequest && (
                        <div className="discount-request-badge">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                          </svg>
                          Discount Request: {discountRequest.requestedDiscount}%
                          <button
                            className="remove-discount-badge-btn"
                            onClick={() => handleRemoveItemDiscountRequest(item)}
                            title="Remove discount request"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-warehouse">
                    {item.selectedWarehouse ? (
                      <>
                        <div className="warehouse-name">{item.selectedWarehouse.location}</div>
                        <div className="warehouse-delivery">{item.selectedWarehouse.deliveryDays}</div>
                      </>
                    ) : (
                      <span className="no-warehouse">Main Stock</span>
                    )}
                  </div>

                  <div className="col-price">
                    ${getItemPrice(item).toFixed(2)}
                  </div>

                  <div className="col-quantity">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item, e.target.value)}
                        min="1"
                        max="999"
                      />
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-subtotal">
                    ${getItemSubtotal(item).toFixed(2)}
                  </div>

                  <div className="col-actions">
                    <button
                      className={`discount-request-btn ${discountRequest ? 'has-request' : ''}`}
                      onClick={() => handleRequestItemDiscount(item)}
                      title={discountRequest ? "Edit discount request" : "Request discount for this item"}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item)}
                      title="Remove from cart"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-actions">
            <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Estimated Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total:</span>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Proceed to Checkout
          </button>

          <button className="quote-btn" onClick={handleRequestQuote}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Request a Quote
          </button>

          <div className="payment-info">
            <div className="info-icon">🔒</div>
            <p>Secure checkout powered by Payment Services</p>
          </div>
        </div>
      </div>

      {/* Item Discount Request Modal */}
      {showItemDiscountModal && selectedItemForDiscount && (
        <div className="modal-overlay" onClick={handleCancelItemDiscount}>
          <div className="discount-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCancelItemDiscount}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="discount-modal-header">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              <h2>Request Discount</h2>
            </div>

            <div className="discount-modal-content">
              <div className="discount-item-info">
                <img src={selectedItemForDiscount.image} alt={selectedItemForDiscount.name} />
                <div className="discount-item-details">
                  <div className="discount-item-name">{selectedItemForDiscount.name}</div>
                  <div className="discount-item-code">OEM: {selectedItemForDiscount.code}</div>
                  <div className="discount-item-price">
                    <span>Current Price:</span>
                    <span className="price-amount">${getItemPrice(selectedItemForDiscount).toFixed(2)}</span>
                  </div>
                  <div className="discount-item-qty">Quantity: {selectedItemForDiscount.quantity}</div>
                </div>
              </div>

              <form onSubmit={handleSaveItemDiscountRequest}>
                <div className="discount-form-field">
                  <label>Requested Discount (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={currentDiscountRequest.requestedDiscount}
                    onChange={(e) => setCurrentDiscountRequest({...currentDiscountRequest, requestedDiscount: e.target.value})}
                    placeholder="e.g., 10"
                    required
                  />
                  <small>Enter the discount percentage you're requesting (1-50%)</small>
                </div>

                <div className="discount-form-field">
                  <label>Reason for Discount Request *</label>
                  <textarea
                    value={currentDiscountRequest.reason}
                    onChange={(e) => setCurrentDiscountRequest({...currentDiscountRequest, reason: e.target.value})}
                    placeholder="Please provide a detailed reason for your discount request (e.g., bulk order, competitor pricing, long-term customer, etc.)"
                    rows="5"
                    required
                  />
                  <small>A detailed reason helps us process your request faster</small>
                </div>

                {currentDiscountRequest.requestedDiscount && (
                  <div className="discount-preview">
                    <div className="preview-row">
                      <span>Original Price:</span>
                      <span>${getItemPrice(selectedItemForDiscount).toFixed(2)}</span>
                    </div>
                    <div className="preview-row discount-amount">
                      <span>Requested Discount ({currentDiscountRequest.requestedDiscount}%):</span>
                      <span>-${(getItemPrice(selectedItemForDiscount) * (currentDiscountRequest.requestedDiscount / 100)).toFixed(2)}</span>
                    </div>
                    <div className="preview-row total">
                      <span>New Price (if approved):</span>
                      <span>${(getItemPrice(selectedItemForDiscount) * (1 - currentDiscountRequest.requestedDiscount / 100)).toFixed(2)}</span>
                    </div>
                    <div className="preview-row total">
                      <span>Total Savings (Qty: {selectedItemForDiscount.quantity}):</span>
                      <span>${(getItemPrice(selectedItemForDiscount) * (currentDiscountRequest.requestedDiscount / 100) * selectedItemForDiscount.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="discount-info-box">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>This discount request will be saved to your cart. When you proceed with "Request a Quote", your entire cart will be submitted with this item marked for discount review.</p>
                </div>

                <div className="discount-modal-actions">
                  <button type="button" className="cancel-btn" onClick={handleCancelItemDiscount}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-discount-btn">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H12.5858C12.851 2 13.1054 2.10536 13.2929 2.29289L18.7071 7.70711C18.8946 7.89464 19 8.149 19 8.41421V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 13L12 16L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Save Discount Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
