import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import './QuickOrder.css';

function QuickOrder() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { allProducts } = useSearch();
  const [parsedItems, setParsedItems] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Handle CSV file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);
    setProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      console.log('File content:', text);
      console.log('Available products:', allProducts.length);

      const lines = text.split('\n').filter(line => line.trim());
      console.log('Lines found:', lines.length);

      // Parse CSV (expecting: Part Number, Quantity)
      const items = [];
      const notFound = [];

      lines.forEach((line, index) => {
        console.log(`Processing line ${index + 1}:`, line);

        // Skip header row
        if (index === 0 && (line.toLowerCase().includes('part') || line.toLowerCase().includes('sku') || line.toLowerCase().includes('code') || line.toLowerCase().includes('quantity'))) {
          console.log('Skipping header row');
          return;
        }

        const parts = line.split(',').map(p => p.trim().replace(/['"]/g, ''));
        console.log('Split parts:', parts);

        if (parts.length < 2) {
          console.log('Line has less than 2 parts, skipping');
          return;
        }

        const partNumber = parts[0];
        const quantity = parseInt(parts[1], 10);

        console.log('Part Number:', partNumber, 'Quantity:', quantity);

        if (!partNumber || isNaN(quantity) || quantity <= 0) {
          console.log('Invalid part number or quantity, skipping');
          return;
        }

        // Find product in catalog
        const product = allProducts.find(p =>
          p.code.toLowerCase() === partNumber.toLowerCase() ||
          p.name.toLowerCase().includes(partNumber.toLowerCase())
        );

        if (product) {
          console.log('Product found:', product.code, product.name);
          items.push({
            ...product,
            quantity,
            csvLine: index + 1
          });
        } else {
          console.log('Product not found for:', partNumber);
          notFound.push({ partNumber, quantity, line: index + 1 });
        }
      });

      console.log('Total items found:', items.length);
      console.log('Total items not found:', notFound.length);

      if (notFound.length > 0) {
        setError(`${notFound.length} part number(s) not found in catalog: ${notFound.map(n => n.partNumber).join(', ')}`);
      }

      if (items.length === 0 && notFound.length === 0) {
        setError('No valid items found in CSV. Please check the file format.');
      }

      setParsedItems(items);
    } catch (err) {
      setError('Error reading CSV file. Please ensure it is properly formatted.');
      console.error('CSV parsing error:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Handle drag and drop
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Update quantity for a parsed item
  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      setParsedItems(parsedItems.filter((_, i) => i !== index));
    } else {
      setParsedItems(parsedItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove item from list
  const removeItem = (index) => {
    setParsedItems(parsedItems.filter((_, i) => i !== index));
  };

  // Add all items to cart
  const handleAddAllToCart = () => {
    if (parsedItems.length === 0) return;

    parsedItems.forEach(item => {
      addToCart(item, item.quantity);
    });

    // Show success and navigate to cart
    alert(`Successfully added ${parsedItems.length} item(s) to cart!`);
    navigate('/cart');
  };

  // Calculate total
  const calculateTotal = () => {
    return parsedItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : item.price?.value || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = [
      'Part Number,Quantity',
      'MP8-0001,2',
      'MP8-0002,5',
      'MP8-0003,1'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick-order-sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="quick-order-page">
      <div className="page-header">
        <div>
          <h1>Quick Order</h1>
          <p className="page-subtitle">Upload a CSV file to quickly add multiple parts to your cart</p>
        </div>
        <button className="secondary-button" onClick={() => navigate('/products')}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Products
        </button>
      </div>

      <div className="quick-order-container">
        {/* Instructions and Upload - Side by Side */}
        <div className="upload-section">
          <div className="instructions-card">
            <h3>How to Use Quick Order</h3>
            <ol>
              <li>Prepare a CSV file with: <strong>Part Number, Quantity</strong></li>
              <li>Upload your CSV file by dragging & dropping or clicking browse</li>
              <li>Review parsed items and adjust quantities if needed</li>
              <li>Click "Add All to Cart" to add all items at once</li>
            </ol>
            <button className="download-sample-btn" onClick={downloadSampleCSV}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download Sample CSV
            </button>
          </div>

          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Drop CSV file here</h3>
            <p>or</p>
            <label className="file-input-label">
              <input
                type="file"
                accept=".csv, text/csv"
                onChange={handleFileInput}
                disabled={processing}
              />
              Browse Files
            </label>
            <span className="file-format">CSV files only</span>
          </div>
        </div>

        {/* Processing indicator */}
        {processing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>Processing CSV file...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Parsed Items */}
        {parsedItems.length > 0 && (
          <div className="parsed-items-section">
            <div className="section-header">
              <h2>Parsed Items ({parsedItems.length})</h2>
              <div className="section-actions">
                <button className="clear-btn" onClick={() => setParsedItems([])}>
                  Clear All
                </button>
                <button className="add-to-cart-btn" onClick={handleAddAllToCart}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2L7 7H3L8 12L6 17L12 13L18 17L16 12L21 7H17L15 2H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add All to Cart (${calculateTotal().toFixed(2)})
                </button>
              </div>
            </div>

            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Part Number</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedItems.map((item, index) => {
                    const price = typeof item.price === 'number' ? item.price : item.price?.value || 0;
                    return (
                      <tr key={index}>
                        <td>
                          <img src={item.image} alt={item.name} className="item-thumbnail" />
                        </td>
                        <td>
                          <span className="part-code">{item.code}</span>
                        </td>
                        <td>
                          <div className="product-name">{item.name}</div>
                          <div className="product-category">{item.categories.split(',')[0]}</div>
                        </td>
                        <td className="price">${price.toFixed(2)}</td>
                        <td>
                          <div className="quantity-controls">
                            <button
                              className="qty-btn"
                              onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, parseInt(e.target.value, 10) || 1)}
                              min="1"
                            />
                            <button
                              className="qty-btn"
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="subtotal">${(price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => removeItem(index)}
                            title="Remove item"
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="summary-section">
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{parsedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickOrder;
