import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('mackOrders');
    const dataVersion = localStorage.getItem('mackOrdersVersion');

    // Version 2 includes shipping addresses - clear old data if version mismatch
    if (savedOrders && dataVersion === '2') {
      return JSON.parse(savedOrders);
    }

    // Clear old data and set new version
    localStorage.setItem('mackOrdersVersion', '2');

    // Sample orders with different statuses
    return [
      {
        id: 'ORD-846821',
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          company: 'Rustic Hardware',
          phone: '(555) 123-4567'
        },
        items: [
          {
            code: '85108272',
            name: 'Brake Pad Set - Front Axle',
            image: '/assets/products/brake-pads.jpg',
            quantity: 4,
            price: 145.50,
            originalPrice: 165.00,
            discountPercent: 12,
            categories: 'Brakes'
          },
          {
            code: '22329187',
            name: 'Air Filter Element - Premium',
            image: '/assets/products/air-filter.jpg',
            quantity: 6,
            price: 52.80,
            originalPrice: 60.00,
            discountPercent: 12,
            categories: 'Filters'
          },
          {
            code: '85135476',
            name: 'Oil Filter Cartridge',
            image: '/assets/products/oil-filter.jpg',
            quantity: 12,
            price: 18.48,
            originalPrice: 21.00,
            discountPercent: 12,
            categories: 'Filters'
          }
        ],
        shippingAddresses: [
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
            items: ['85108272', '22329187', '85135476']
          }
        ],
        subtotal: 1121.76,
        discount: 152.40,
        discountPercent: 12,
        tax: 89.74,
        shipping: 25.00,
        total: 1236.50,
        status: 'Shipped',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        quoteId: 'QT-1709876543210',
        notes: 'Rush order - customer needs by Friday',
        trackingNumber: 'MACK1Z9999999999999'
      },
      {
        id: 'ORD-845194',
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          company: 'Rustic Hardware',
          phone: '(555) 123-4567'
        },
        items: [
          {
            code: '22293847',
            name: 'Fuel Injector Assembly',
            image: '/assets/products/fuel-injector.jpg',
            quantity: 2,
            price: 425.00,
            originalPrice: 425.00,
            discountPercent: 0,
            categories: 'Fuel System'
          },
          {
            code: '85142938',
            name: 'Turbocharger Complete',
            image: '/assets/products/turbo.jpg',
            quantity: 1,
            price: 1850.00,
            originalPrice: 1850.00,
            discountPercent: 0,
            categories: 'Engine Components'
          }
        ],
        shippingAddresses: [
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
            items: ['22293847', '85142938']
          }
        ],
        subtotal: 2700.00,
        discount: 0,
        discountPercent: 0,
        tax: 216.00,
        shipping: 45.00,
        total: 2961.00,
        status: 'Delivered',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        quoteId: null,
        notes: '',
        trackingNumber: 'MACK1Z8888888888888',
        deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ORD-844567',
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          company: 'Rustic Hardware',
          phone: '(555) 123-4567'
        },
        items: [
          {
            code: '85167829',
            name: 'Suspension Leaf Spring Kit',
            image: '/assets/products/leaf-spring.jpg',
            quantity: 3,
            price: 340.00,
            originalPrice: 400.00,
            discountPercent: 15,
            categories: 'Suspension',
            shipmentStatus: 'delivered', // Partially delivered
            deliveredQuantity: 2,
            trackingNumber: 'MACK1Z7777777777777'
          },
          {
            code: '22318765',
            name: 'Shock Absorber - Heavy Duty',
            image: '/assets/products/shock.jpg',
            quantity: 6,
            price: 156.00,
            originalPrice: 195.00,
            discountPercent: 20,
            categories: 'Suspension',
            shipmentStatus: 'delivered', // Fully delivered
            deliveredQuantity: 6,
            trackingNumber: 'MACK1Z7777777777777'
          },
          {
            code: '85192847',
            name: 'Air Spring Assembly',
            image: '/assets/products/air-spring.jpg',
            quantity: 4,
            price: 280.00,
            originalPrice: 350.00,
            discountPercent: 20,
            categories: 'Suspension',
            shipmentStatus: 'shipped', // Still in transit
            deliveredQuantity: 0,
            trackingNumber: 'MACK1Z6666666666666'
          }
        ],
        shippingAddresses: [
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
            items: ['85167829', '22318765']
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
            items: ['85192847']
          }
        ],
        subtotal: 2976.00,
        discount: 744.00,
        discountPercent: 20,
        tax: 238.08,
        shipping: 55.00,
        total: 3269.08,
        status: 'Partially Delivered',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        quoteId: 'QT-1709234567890',
        notes: 'Split shipment - items shipped from different warehouses',
        trackingNumbers: ['MACK1Z7777777777777', 'MACK1Z6666666666666'],
        partialDeliveryInfo: {
          delivered: [
            'Shock Absorber - Heavy Duty (6/6)',
            'Suspension Leaf Spring Kit (2/3)'
          ],
          pending: [
            'Suspension Leaf Spring Kit (1/3 remaining)',
            'Air Spring Assembly (4/4 pending)'
          ]
        }
      },
      {
        id: 'ORD-843921',
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          company: 'Rustic Hardware',
          phone: '(555) 123-4567'
        },
        items: [
          {
            code: '22356789',
            name: 'Wiper Blade Set - Premium',
            image: '/assets/products/wiper.jpg',
            quantity: 8,
            price: 28.50,
            originalPrice: 28.50,
            discountPercent: 0,
            categories: 'Accessories'
          }
        ],
        shippingAddresses: [
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
            items: ['22356789']
          }
        ],
        subtotal: 228.00,
        discount: 0,
        discountPercent: 0,
        tax: 18.24,
        shipping: 15.00,
        total: 261.24,
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
        updatedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: null,
        quoteId: null,
        notes: '',
        trackingNumber: null,
        cancellationReason: 'Customer requested cancellation - ordered wrong part number'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mackOrders', JSON.stringify(orders));
    localStorage.setItem('mackOrdersVersion', '2');
  }, [orders]);

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: generateOrderId(),
      customer: {
        name: orderData.customer?.name || 'Unknown Customer',
        email: orderData.customer?.email || '',
        company: orderData.customer?.company || '',
        phone: orderData.customer?.phone || ''
      },
      items: orderData.items.map(item => ({
        code: item.code,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.finalPrice || item.selectedWarehouse?.price || item.price?.value || item.price || 0,
        originalPrice: item.originalPrice,
        discountPercent: item.discountPercent || 0,
        selectedWarehouse: item.selectedWarehouse,
        categories: item.categories,
        shippingAddressId: item.shippingAddressId // Store which address this item ships to
      })),
      shippingAddresses: orderData.shippingAddresses || [], // Store all shipping addresses
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      discountPercent: orderData.discountPercent || 0,
      tax: orderData.tax || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total || 0,
      status: 'Processing',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      quoteId: orderData.quoteId || null,
      notes: orderData.notes || '',
      trackingNumber: null
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const createOrderFromQuote = (quote) => {
    if (!quote) return null;

    // Calculate totals
    const subtotal = quote.items.reduce((sum, item) => {
      return sum + (item.finalPrice * item.quantity);
    }, 0);

    const discount = subtotal * (quote.discountPercent / 100);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.08; // 8% tax
    const shipping = 25.00; // Flat rate shipping
    const total = afterDiscount + tax + shipping;

    const orderData = {
      customer: {
        name: quote.customer.name,
        email: quote.customer.email,
        phone: quote.customer.phone,
        company: quote.customer.company
      },
      items: quote.items,
      subtotal: subtotal,
      discount: discount,
      discountPercent: quote.discountPercent,
      tax: tax,
      shipping: shipping,
      total: total,
      quoteId: quote.id,
      notes: quote.notes || ''
    };

    return createOrder(orderData);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, paymentStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const addTrackingNumber = (orderId, trackingNumber) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, trackingNumber, status: 'Shipped', updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByCustomer = (customerEmail) => {
    return orders.filter(order =>
      order.customer.email.toLowerCase() === customerEmail.toLowerCase()
    );
  };

  const cancelOrder = (orderId, reason) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: 'Cancelled',
              cancellationReason: reason,
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.filter(order => order.id !== orderId)
    );
  };

  const fileDiscrepancy = (orderId, discrepancyData) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              discrepancy: discrepancyData,
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  const updateDiscrepancyStatus = (orderId, status, additionalData = {}) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && order.discrepancy
          ? {
              ...order,
              discrepancy: {
                ...order.discrepancy,
                status,
                ...additionalData,
                updatedAt: new Date().toISOString()
              },
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  const approveDiscrepancy = (orderId, agentNotes = '') => {
    updateDiscrepancyStatus(orderId, 'approved', {
      agentNotes,
      approvedAt: new Date().toISOString()
    });
  };

  const rejectDiscrepancy = (orderId, rejectionReason, agentNotes = '') => {
    updateDiscrepancyStatus(orderId, 'rejected', {
      rejectionReason,
      agentNotes,
      rejectedAt: new Date().toISOString()
    });
  };

  const processRefund = (orderId) => {
    updateDiscrepancyStatus(orderId, 'refund-processing', {
      refundInitiatedAt: new Date().toISOString()
    });
  };

  const completeRefund = (orderId, refundTransactionId = '') => {
    updateDiscrepancyStatus(orderId, 'refunded', {
      refundTransactionId,
      refundCompletedAt: new Date().toISOString()
    });
    // Also update payment status
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, paymentStatus: 'Refunded' }
          : order
      )
    );
  };

  const getPendingDiscrepancies = () => {
    return orders.filter(order =>
      order.discrepancy && order.discrepancy.status === 'pending'
    );
  };

  const value = {
    orders,
    createOrder,
    createOrderFromQuote,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingNumber,
    getOrderById,
    getOrdersByCustomer,
    cancelOrder,
    deleteOrder,
    fileDiscrepancy,
    updateDiscrepancyStatus,
    approveDiscrepancy,
    rejectDiscrepancy,
    processRefund,
    completeRefund,
    getPendingDiscrepancies
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
