import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WelcomeTour.css';

function WelcomeTour({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState(null);
  const balloonRef = useRef(null);

  const tourSteps = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Your command center! View key metrics, recent orders, top products, and quick actions all in one place. Get a real-time overview of your business performance.',
      path: '/',
      selector: '[data-tour="dashboard"]',
      position: 'right'
    },
    {
      id: 'products',
      title: 'Products Catalog',
      description: 'Browse our complete catalog of genuine Mack truck parts. Use powerful filters to find exactly what you need, check real-time availability, and add items to your cart.',
      path: '/products',
      selector: '[data-tour="products"]',
      position: 'right'
    },
    {
      id: 'orders',
      title: 'Orders Management',
      description: 'Track all your orders in one place. View order history, check delivery status, download invoices, and file discrepancies if needed.',
      path: '/orders',
      selector: '[data-tour="orders"]',
      position: 'right'
    },
    {
      id: 'quotes',
      title: 'Quotes',
      description: 'Create and manage price quotes for your customers. Request special pricing, track quote status, and convert approved quotes into orders with one click.',
      path: '/quotes',
      selector: '[data-tour="quotes"]',
      position: 'right'
    },
    {
      id: 'quick-order',
      title: 'Quick Order',
      description: 'Speed up your workflow! Upload CSV files with part numbers and quantities to create bulk orders instantly. Perfect for recurring orders or large parts lists.',
      path: '/quick-order',
      selector: '[data-tour="quick-order"]',
      position: 'right'
    },
    {
      id: 'cart',
      title: 'Shopping Cart',
      description: 'Review your selected items, apply discounts, and proceed to checkout. Your cart is saved automatically, so you can continue shopping anytime.',
      path: '/cart',
      selector: '[data-tour="cart"]',
      position: 'bottom'
    },
    {
      id: 'account',
      title: 'My Account',
      description: 'Manage your profile, view company information, access organization settings (if you\'re an administrator), and customize your preferences.',
      path: null,
      selector: '[data-tour="account"]',
      position: 'bottom'
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
      const nextStep = tourSteps[currentStep + 1];
      if (nextStep.path && location.pathname !== nextStep.path) {
        navigate(nextStep.path);
        // Wait for navigation to complete before updating
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 100);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = tourSteps[currentStep - 1];
      if (prevStep.path && location.pathname !== prevStep.path) {
        navigate(prevStep.path);
        setTimeout(() => {
          setCurrentStep(currentStep - 1);
        }, 100);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleSkip = () => {
    onClose();
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
    <div className="welcome-tour-overlay">
      {/* Opaque overlay with spotlight cutout */}
      <svg className="tour-spotlight-svg">
        <defs>
          <mask id="spotlight-mask">
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
          mask="url(#spotlight-mask)"
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
        ref={balloonRef}
        className={`tour-balloon ${step.position}`}
        style={getBalloonPosition()}
      >
        <div className="tour-balloon-header">
          <div className="tour-step-indicator">
            <span className="step-current">{currentStep + 1}</span>
            <span className="step-separator">/</span>
            <span className="step-total">{tourSteps.length}</span>
          </div>
          <button className="tour-close-btn" onClick={handleSkip}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="tour-balloon-content">
          <div className="tour-icon">
            {step.id === 'dashboard' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
            {step.id === 'products' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27002 6.96L12 12.01L20.73 6.96M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step.id === 'orders' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step.id === 'quotes' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step.id === 'quick-order' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step.id === 'cart' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step.id === 'account' && (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>

        <div className="tour-balloon-footer">
          <button
            className="tour-btn tour-btn-skip"
            onClick={handleSkip}
          >
            Skip Tour
          </button>
          <div className="tour-navigation">
            {currentStep > 0 && (
              <button
                className="tour-btn tour-btn-secondary"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            <button
              className="tour-btn tour-btn-primary"
              onClick={handleNext}
            >
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

export default WelcomeTour;
