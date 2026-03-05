import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductByCode, getSuggestedProducts, transformOCCProduct } from '../services/api';
import { suggestedProductsFallback } from '../data/suggestedProducts';
import { getWarehouseStock } from '../data/warehouseStock';
import { useCart } from '../context/CartContext';
import ProductCarousel from '../components/ProductCarousel';
import './ProductDetail.css';

function ProductDetail() {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [remanufacturedProducts, setRemanufacturedProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [warehouseStock, setWarehouseStock] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCode]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load main product
      const data = await getProductByCode(productCode);
      setProduct(data);

      // Load warehouse stock data with base price
      const basePrice = data.price?.value || 0;
      const stockData = getWarehouseStock(productCode, basePrice);
      setWarehouseStock(stockData);

      // Load related products in parallel
      Promise.all([
        loadRemanufacturedProducts(data),
        loadSuggestedProducts()
      ]).catch(err => console.error('Failed to load related products:', err));

    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Product not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const loadRemanufacturedProducts = async (currentProduct) => {
    try {
      // Check if product has remanufactured references
      if (currentProduct.productReferences && currentProduct.productReferences.length > 0) {
        const remanRefs = currentProduct.productReferences.filter(ref =>
          ref.target?.name?.toLowerCase().includes('reman') ||
          ref.referenceType === 'ACCESSORIES'
        );

        if (remanRefs.length > 0) {
          // Fetch full details for each remanufactured product
          const remanProducts = await Promise.all(
            remanRefs.map(async (ref) => {
              try {
                const product = await getProductByCode(ref.target.code);
                return {
                  ...transformOCCProduct(product),
                  badge: 'REMANUFACTURED'
                };
              } catch {
                // If fetch fails, use basic info from reference
                const imageUrl = currentProduct.images?.[0]?.url;
                const fullImageUrl = imageUrl && imageUrl.startsWith('/')
                  ? `https://chemical.volvomack.demo.hybris.com${imageUrl}`
                  : (imageUrl || '/assets/products/placeholder.jpg');

                return {
                  code: ref.target.code,
                  name: ref.target.name,
                  price: { value: currentProduct.price?.value * 0.7 }, // 30% discount
                  priceFormatted: `$${(currentProduct.price?.value * 0.7).toFixed(2)}`,
                  image: fullImageUrl,
                  badge: 'REMANUFACTURED'
                };
              }
            })
          );
          setRemanufacturedProducts(remanProducts);
        } else {
          // Create synthetic remanufactured version
          const imageUrl = currentProduct.images?.[0]?.url;
          const fullImageUrl = imageUrl && imageUrl.startsWith('/')
            ? `https://chemical.volvomack.demo.hybris.com${imageUrl}`
            : (imageUrl || '/assets/products/placeholder.jpg');

          setRemanufacturedProducts([{
            code: `${currentProduct.code}-REMAN`,
            name: `${currentProduct.name} (Remanufactured)`,
            price: { value: currentProduct.price?.value * 0.7 },
            priceFormatted: `$${(currentProduct.price?.value * 0.7).toFixed(2)}`,
            image: fullImageUrl,
            badge: 'REMANUFACTURED',
            description: 'Professionally remanufactured to OEM specifications. Tested and certified.'
          }]);
        }
      }
    } catch (err) {
      console.error('Failed to load remanufactured products:', err);
    }
  };

  const loadSuggestedProducts = async () => {
    try {
      console.log('Loading suggested products from API...');
      const suggested = await getSuggestedProducts(6);
      console.log('API returned suggested products:', suggested);

      if (suggested && suggested.length > 0) {
        const transformed = suggested.map(p => transformOCCProduct(p));
        console.log('Transformed API products:', transformed);
        setSuggestedProducts(transformed);
      } else {
        // Use fallback data if API doesn't return products
        console.log('API returned no products, using fallback:', suggestedProductsFallback);
        setSuggestedProducts(suggestedProductsFallback);
      }
    } catch (err) {
      console.error('Failed to load suggested products, using fallback:', err);
      console.log('Using fallback data:', suggestedProductsFallback);
      // Use fallback data on error
      setSuggestedProducts(suggestedProductsFallback);
    }
  };

  const handleCarouselProductClick = (clickedProduct) => {
    // Navigate to the new product
    navigate(`/product/${clickedProduct.code}`);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = () => {
    addToCartContext(product, quantity, selectedWarehouse);
    alert(`Added ${quantity} x ${product.name} to cart${selectedWarehouse ? ` from ${selectedWarehouse.location}` : ''}`);
  };

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="spinner-large"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdp-error">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <button className="primary-button" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Open Catalogue', path: '/products' },
    { name: 'Mack Spare parts', path: '/products?category=mack-spare-parts' },
    { name: product.name, path: null }
  ];

  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => `https://chemical.volvomack.demo.hybris.com${img.url}`)
    : ['/assets/products/placeholder.jpg'];

  const isInStock = product.stock?.stockLevelStatus === 'inStock';
  const stockLevel = product.stock?.stockLevel || 0;

  // Bundle components for ULTRASHIFT products
  const isUltrashiftProduct = product.name?.toUpperCase().includes('ULTRASHIFT');
  const bundleComponents = isUltrashiftProduct ? [
    { code: '85138270', name: 'Air Dryer Kit', quantity: 1, image: '/assets/products/mack-products/85138270-Air-Dryer-Kit.png' },
    { code: '85153001', name: 'Electronic Control Unit ESP ECU', quantity: 1, image: '/assets/products/mack-products/85153001-Electronic-Control-Unit-ESP-ECU.png' },
    { code: '3041-40014SP', name: 'Service Parts Kit', quantity: 2, image: '/assets/products/mack-products/3041-40014SP.jpg' },
    { code: 'LBFL2007F', name: 'Mack Filter Assembly', quantity: 1, image: '/assets/products/mack-products/LBFL2007F.jpg' },
  ] : null;

  return (
    <div className="product-detail-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="breadcrumb-item">
            {crumb.path ? (
              <Link to={crumb.path}>{crumb.name}</Link>
            ) : (
              <span className="current">{crumb.name}</span>
            )}
            {index < breadcrumbs.length - 1 && <span className="separator">›</span>}
          </span>
        ))}
      </nav>

      {/* Main Product Section */}
      <div className="pdp-container">
        {/* Product Highlights Banner - Moved to Top */}
        <div className="pdp-highlights-top">
          <div className="highlight-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Genuine Mack Part</span>
          </div>
          <div className="highlight-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Quality Guaranteed</span>
          </div>
          <div className="highlight-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
            </svg>
            <span>Fast Shipping</span>
          </div>
          <div className="highlight-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V9H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Warehouse Stock Available</span>
          </div>
        </div>

        <div className="pdp-grid">
          {/* Left: Images & Bundle */}
          <div className="pdp-images">
            <div className="main-image">
              <img src={productImages[selectedImage]} alt={product.name} />
              {!isInStock && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="image-thumbnails">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Bundle Components - Only for ULTRASHIFT */}
            {bundleComponents && (
              <div className="bundle-components-box">
                <div className="bundle-header">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3>Consists of</h3>
                </div>
                <p className="bundle-description">This assembly includes the following components:</p>
                <div className="bundle-items-list">
                  {bundleComponents.map((component, index) => (
                    <div key={index} className="bundle-item">
                      <img src={component.image} alt={component.name} className="bundle-item-image" />
                      <div className="bundle-item-info">
                        <div className="bundle-item-name">{component.name}</div>
                        <div className="bundle-item-code">Part #: {component.code}</div>
                        <div className="bundle-item-qty">Qty: {component.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="pdp-info">
            <div className="pdp-header">
              <h1 className="pdp-title">{product.name}</h1>
              <div className="pdp-code">
                <span className="code-label">OEM Part Number:</span>
                <span className="code-value">{product.code}</span>
              </div>
            </div>

            {/* Price, Stock & Actions - Unified Box */}
            <div className="pdp-pricing-unified">
              {/* Top Row: Price and Stock Status */}
              <div className="pricing-top-row">
                <div className="price-section">
                  <div className="price-main">{product.price?.formattedValue || `$${product.price?.value}`}</div>
                  <div className="price-details">
                    <span className="price-tax">Excl. Tax</span>
                    <span className="price-currency">USD</span>
                  </div>
                </div>

                <div className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {isInStock ? (
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              {/* Middle: Warehouse Section and Actions Side by Side */}
              <div className="pricing-middle-row">
                {/* Left: Warehouse Stock */}
                <div className="warehouse-section-compact">
                  {isInStock && stockLevel > 0 && (
                    <div className="stock-level-compact">{stockLevel} units in main inventory</div>
                  )}

                  {warehouseStock.length > 0 && (
                    <div className="warehouse-stock-compact">
                      <div className="warehouse-header">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21H21M4 18H20V9L12 3L4 9V18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Warehouse Availability</span>
                      </div>
                      <div className="warehouse-list">
                        {warehouseStock.map((wh, index) => (
                          <div
                            key={index}
                            className={`warehouse-item ${wh.type} ${selectedWarehouse?.location === wh.location ? 'selected' : ''}`}
                            onClick={() => setSelectedWarehouse(wh)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="warehouse-info">
                              <div className="warehouse-name">{wh.location}</div>
                              <div className="warehouse-city">{wh.city}</div>
                            </div>
                            <div className="warehouse-details">
                              <div className="warehouse-price">
                                ${wh.price.toFixed(2)}
                              </div>
                              <div className="warehouse-stock">
                                <span className="stock-count">{wh.stock}</span>
                                <span className="stock-units">units</span>
                              </div>
                              <div className="warehouse-delivery">{wh.deliveryDays}</div>
                            </div>
                            {selectedWarehouse?.location === wh.location && (
                              <div className="warehouse-selected-badge">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions & Categories */}
                <div className="actions-section-compact">
                  {/* Quantity & Add to Cart */}
                  <div className="pdp-actions-compact">
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={!isInStock}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          disabled={!isInStock}
                        />
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={!isInStock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={addToCart}
                      disabled={!isInStock}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2L7 7M17 2L19 7M7 7L6 21H18L17 7M7 7H17M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>

                  {/* Product Categories */}
                  {product.categories && product.categories.length > 0 && (
                    <div className="pdp-categories-compact">
                      <span className="categories-label">Categories:</span>
                      <div className="categories-list">
                        {product.categories.map((cat, index) => (
                          <Link
                            key={index}
                            to={`/products?category=${cat.code}`}
                            className="category-tag"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remanufactured Options - Prominent Full Width */}
            {remanufacturedProducts.length > 0 && (
              <div className="reman-section-prominent-right">
                <ProductCarousel
                  title="Remanufactured Options"
                  products={remanufacturedProducts}
                  onProductClick={handleCarouselProductClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Description Section - Full Width */}
        {product.description && (
          <div className="pdp-description-full-width">
            <h2>Description</h2>
            <div className="description-content">
              <p>{product.description}</p>
            </div>
          </div>
        )}

        {/* Product Specifications */}
        {product.classifications && product.classifications.length > 0 && (
          <div className="pdp-specifications">
            <h2>Technical Specifications</h2>
            <table className="specs-table">
              <tbody>
                {product.classifications[0]?.features?.map((feature, index) => (
                  <tr key={index}>
                    <td className="spec-name">{feature.name}</td>
                    <td className="spec-value">
                      {feature.featureValues?.map(v => v.value).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Suggested Products Carousel */}
        {suggestedProducts.length > 0 && (
          <div className="suggested-carousel-wrapper">
            <ProductCarousel
              title="You Might Also Need"
              products={suggestedProducts}
              onProductClick={handleCarouselProductClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
