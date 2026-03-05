// Warehouse and supplier stock levels
// This simulates multi-location inventory availability

export const getWarehouseStock = (productCode, basePrice = 0) => {
  // Generate realistic stock levels based on product code
  const hash = productCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Price logic: Faster delivery = Higher price, Slower delivery = Lower price
  // Main warehouse (1-2 days): Base price (fastest, premium)
  // East Coast (2-3 days): -2% discount
  // West Coast (3-4 days): -4% discount
  // Meritor (3-5 days): -6% discount (slowest, cheapest)

  return [
    {
      location: 'Mack Main Warehouse',
      type: 'primary',
      city: 'Greensboro, NC',
      stock: Math.floor((hash * 7) % 50) + 10,
      deliveryDays: '1-2 days',
      price: basePrice, // Full price - fastest delivery
      priceMultiplier: 1.0
    },
    {
      location: 'Mack East Coast',
      type: 'regional',
      city: 'Allentown, PA',
      stock: Math.floor((hash * 3) % 30) + 5,
      deliveryDays: '2-3 days',
      price: basePrice * 0.98, // 2% discount
      priceMultiplier: 0.98
    },
    {
      location: 'Mack West Coast',
      type: 'regional',
      city: 'Las Vegas, NV',
      stock: Math.floor((hash * 5) % 25) + 8,
      deliveryDays: '3-4 days',
      price: basePrice * 0.96, // 4% discount
      priceMultiplier: 0.96
    },
    {
      location: 'Meritor',
      type: 'supplier',
      city: 'Troy, MI',
      stock: Math.floor((hash * 11) % 40) + 15,
      deliveryDays: '3-5 days',
      price: basePrice * 0.94, // 6% discount
      priceMultiplier: 0.94
    }
  ];
};

// Get total stock across all locations
export const getTotalStock = (productCode) => {
  const warehouses = getWarehouseStock(productCode);
  return warehouses.reduce((total, wh) => total + wh.stock, 0);
};

// Check if product is available in any location
export const isAvailableAnywhere = (productCode) => {
  return getTotalStock(productCode) > 0;
};
