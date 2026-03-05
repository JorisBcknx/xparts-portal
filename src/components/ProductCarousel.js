import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCarousel.css';

function ProductCarousel({ title, products, onProductClick }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const carouselRef = React.useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('ProductCarousel rendered with:', {
      title,
      productCount: products?.length,
      products: products
    });
  }, [title, products]);

  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      setMaxScroll(container.scrollWidth - container.clientWidth);
    }
  }, [products]);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 320; // Width of one card + gap

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(Math.min(maxScroll, scrollPosition + scrollAmount));
    }
  };

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.code}`);
    }
  };

  const getImageUrl = (product) => {
    // Handle different image formats
    if (product.image) {
      // If it's a full URL (starts with http), use as-is
      if (product.image.startsWith('http')) {
        console.log('Using HTTP image:', product.image);
        return product.image;
      }
      // Otherwise use as relative path - don't encode, use as-is
      console.log('Using relative image path:', product.image);
      return product.image;
    }

    // Check for images array (from API)
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0].url;
      // If it doesn't start with http, prepend the base URL
      if (!imageUrl.startsWith('http')) {
        const fullUrl = `https://chemical.volvomack.demo.hybris.com${imageUrl}`;
        console.log('Using API image with base URL:', fullUrl);
        return fullUrl;
      }
      console.log('Using API image:', imageUrl);
      return imageUrl;
    }

    // Fallback to placeholder
    console.log('Using placeholder for product:', product.code);
    return '/assets/products/placeholder.jpg';
  };

  const getPrice = (product) => {
    console.log(`Price for ${product.code}:`, {
      priceFormatted: product.priceFormatted,
      formattedValue: product.price?.formattedValue,
      value: product.price?.value
    });

    if (product.priceFormatted) return product.priceFormatted;
    if (product.price?.formattedValue) return product.price.formattedValue;
    if (product.price?.value) return `$${product.price.value.toFixed(2)}`;
    return 'Contact for Price';
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-carousel">
      <div className="carousel-header">
        <h2>{title}</h2>
        <div className="carousel-controls">
          <button
            className="carousel-btn"
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="carousel-btn"
            onClick={() => scroll('right')}
            disabled={scrollPosition >= maxScroll}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="carousel-container" ref={carouselRef}>
        {products.map((product, index) => (
          <div
            key={index}
            className="carousel-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="carousel-card-image">
              <img
                src={getImageUrl(product)}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', getImageUrl(product));
                  // Don't set placeholder in a loop
                  if (e.target.src !== window.location.origin + '/assets/products/placeholder.jpg') {
                    e.target.src = '/assets/products/placeholder.jpg';
                  }
                }}
              />
              {product.badge && (
                <span className="carousel-badge">{product.badge}</span>
              )}
            </div>
            <div className="carousel-card-content">
              <h3 className="carousel-card-title">{product.name}</h3>
              <div className="carousel-card-code">OEM: {product.code}</div>
              <div className="carousel-card-footer">
                <div className="carousel-card-price">
                  {getPrice(product)}
                </div>
                <button className="carousel-card-btn">
                  View Details
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
