import React, { useState, useEffect } from 'react';
import './OrderPageTour.css';

function OrderPageTour({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState(null);

  const tourSteps = [
    {
      id: 'order-stats',
      title: 'Order Statistics',
      description: 'Get a quick overview of your order metrics. See total orders, processing orders, delivered orders, and shipped orders at a glance.',
      selector: '.orders-stats',
      position: 'bottom'
    },
    {
      id: 'order-filters',
      title: 'Filter Orders',
      description: 'Filter your orders by status (Processing, Shipped, Delivered, or Cancelled) to quickly find what you\'re looking for.',
      selector: '.orders-filters',
      position: 'bottom'
    },
    {
      id: 'order-list',
      title: 'Order List',
      description: 'View all your orders in one comprehensive table. See order IDs, customer info, items ordered, total amounts, status, payment status, and order dates.',
      selector: '.data-table thead',
      position: 'bottom'
    },
    {
      id: 'order-actions',
      title: 'Order Actions',
      description: 'Click the eye icon to view detailed order information. Track shipments with tracking numbers, and access additional options for each order.',
      selector: '.data-table tbody tr:first-child .action-buttons',
      position: 'left'
    },
    {
      id: 'order-status',
      title: 'Order Status & Discrepancies',
      description: 'Monitor order status with color-coded badges. If an order has issues (incomplete delivery, damaged items), you can file a discrepancy claim directly from the order details.',
      selector: '.data-table tbody tr:first-child td:nth-child(5)',
      position: 'left'
    }
  ];

  const updateHighlightPosition = () => {
    const step = tourSteps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  };

  useEffect(() => {
    updateHighlightPosition();
    window.addEventListener('resize', updateHighlightPosition);
    return () => window.removeEventListener('resize', updateHighlightPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tourSteps[currentStep];
  if (!step || !highlightPosition) return null;

  const getBalloonPosition = () => {
    if (!highlightPosition) return {};

    const padding = 20;
    const balloonWidth = 380;
    const balloonHeight = 250;

    let top, left;

    switch (step.position) {
      case 'right':
        top = highlightPosition.top + (highlightPosition.height / 2) - (balloonHeight / 2);
        left = highlightPosition.left + highlightPosition.width + padding;
        break;
      case 'bottom':
        top = highlightPosition.top + highlightPosition.height + padding;
        left = highlightPosition.left + (highlightPosition.width / 2) - (balloonWidth / 2);
        break;
      case 'left':
        top = highlightPosition.top + (highlightPosition.height / 2) - (balloonHeight / 2);
        left = highlightPosition.left - balloonWidth - padding;
        break;
      case 'top':
        top = highlightPosition.top - balloonHeight - padding;
        left = highlightPosition.left + (highlightPosition.width / 2) - (balloonWidth / 2);
        break;
      default:
        top = highlightPosition.top + highlightPosition.height + padding;
        left = highlightPosition.left;
    }

    // Keep balloon within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + balloonWidth > viewportWidth - 20) {
      left = viewportWidth - balloonWidth - 20;
    }
    if (left < 20) {
      left = 20;
    }
    if (top + balloonHeight > viewportHeight - 20) {
      top = viewportHeight - balloonHeight - 20;
    }
    if (top < 80) {
      top = 80;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <div className="order-page-tour-overlay">
      {/* Opaque overlay with spotlight cutout */}
      <svg className="tour-spotlight-svg">
        <defs>
          <mask id="order-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={highlightPosition.left - 8}
              y={highlightPosition.top - 8}
              width={highlightPosition.width + 16}
              height={highlightPosition.height + 16}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#order-spotlight-mask)"
        />
      </svg>

      {/* Highlight border around element */}
      <div
        className="tour-highlight-border"
        style={{
          top: `${highlightPosition.top - 8}px`,
          left: `${highlightPosition.left - 8}px`,
          width: `${highlightPosition.width + 16}px`,
          height: `${highlightPosition.height + 16}px`
        }}
      />

      {/* Balloon with content */}
      <div
        className={`tour-balloon ${step.position}`}
        style={getBalloonPosition()}
      >
        <div className="tour-balloon-header">
          <div className="tour-step-indicator">
            <span className="step-current">{currentStep + 1}</span>
            <span className="step-separator">/</span>
            <span className="step-total">{tourSteps.length}</span>
          </div>
          <button className="tour-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="tour-balloon-content">
          <div className="tour-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>

        <div className="tour-balloon-footer">
          <button className="tour-btn tour-btn-skip" onClick={onClose}>
            End Tour
          </button>
          <div className="tour-navigation">
            {currentStep > 0 && (
              <button className="tour-btn tour-btn-secondary" onClick={handlePrevious}>
                Previous
              </button>
            )}
            <button className="tour-btn tour-btn-primary" onClick={handleNext}>
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>

        {/* Balloon arrow */}
        <div className={`tour-balloon-arrow ${step.position}`} />
      </div>
    </div>
  );
}

export default OrderPageTour;
