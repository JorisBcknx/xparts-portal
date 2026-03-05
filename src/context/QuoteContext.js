import React, { createContext, useContext, useState, useEffect } from 'react';

const QuoteContext = createContext();

export const useQuotes = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuotes must be used within a QuoteProvider');
  }
  return context;
};

export const QuoteProvider = ({ children }) => {
  const [quotes, setQuotes] = useState(() => {
    const savedQuotes = localStorage.getItem('mackQuotes');
    if (savedQuotes) {
      return JSON.parse(savedQuotes);
    }

    // Sample quotes with different statuses
    return [
      {
        id: 'QT-1709876543210',
        status: 'accepted',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          phone: '(555) 123-4567',
          company: 'Rustic Hardware'
        },
        items: [
          {
            code: '85108272',
            name: 'Brake Pad Set - Front Axle',
            image: '/assets/products/brake-pads.jpg',
            quantity: 4,
            originalPrice: 165.00,
            discountPercent: 12,
            finalPrice: 145.20,
            selectedWarehouse: {
              location: 'Baltimore Distribution Center',
              stock: 45,
              price: 165.00,
              deliveryDays: '2-3 business days'
            },
            categories: 'Brakes'
          },
          {
            code: '22329187',
            name: 'Air Filter Element - Premium',
            image: '/assets/products/air-filter.jpg',
            quantity: 6,
            originalPrice: 60.00,
            discountPercent: 12,
            finalPrice: 52.80,
            selectedWarehouse: {
              location: 'Baltimore Distribution Center',
              stock: 120,
              price: 60.00,
              deliveryDays: '2-3 business days'
            },
            categories: 'Filters'
          },
          {
            code: '85135476',
            name: 'Oil Filter Cartridge',
            image: '/assets/products/oil-filter.jpg',
            quantity: 12,
            originalPrice: 21.00,
            discountPercent: 12,
            finalPrice: 18.48,
            selectedWarehouse: {
              location: 'Baltimore Distribution Center',
              stock: 200,
              price: 21.00,
              deliveryDays: '2-3 business days'
            },
            categories: 'Filters'
          }
        ],
        notes: 'Need these parts for scheduled maintenance on customer fleet',
        subtotal: 1274.40,
        discount: 152.40,
        discountPercent: 12,
        tax: 101.95,
        shipping: 25.00,
        total: 1401.35,
        validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        asmNotes: 'Valued customer - approved 12% discount for bulk order',
        lastModifiedBy: 'asm'
      },
      {
        id: 'QT-1709234567890',
        status: 'sent',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          phone: '(555) 123-4567',
          company: 'Rustic Hardware'
        },
        items: [
          {
            code: '85167829',
            name: 'Suspension Leaf Spring Kit',
            image: '/assets/products/leaf-spring.jpg',
            quantity: 3,
            originalPrice: 400.00,
            discountPercent: 15,
            finalPrice: 340.00,
            selectedWarehouse: {
              location: 'Chicago Parts Hub',
              stock: 8,
              price: 400.00,
              deliveryDays: '3-5 business days'
            },
            categories: 'Suspension'
          },
          {
            code: '22318765',
            name: 'Shock Absorber - Heavy Duty',
            image: '/assets/products/shock.jpg',
            quantity: 6,
            originalPrice: 195.00,
            discountPercent: 15,
            finalPrice: 165.75,
            selectedWarehouse: {
              location: 'Chicago Parts Hub',
              stock: 25,
              price: 195.00,
              deliveryDays: '3-5 business days'
            },
            categories: 'Suspension'
          },
          {
            code: '85192847',
            name: 'Air Spring Assembly',
            image: '/assets/products/air-spring.jpg',
            quantity: 4,
            originalPrice: 350.00,
            discountPercent: 15,
            finalPrice: 297.50,
            selectedWarehouse: {
              location: 'Dallas Warehouse',
              stock: 12,
              price: 350.00,
              deliveryDays: '4-6 business days'
            },
            categories: 'Suspension'
          }
        ],
        notes: 'Complete suspension overhaul for 3 trucks - need all parts to arrive together if possible',
        subtotal: 3204.50,
        discount: 564.50,
        discountPercent: 15,
        tax: 256.36,
        shipping: 55.00,
        total: 3515.86,
        validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        asmNotes: 'Special pricing approved for complete suspension package. Note: Air springs ship from different warehouse.',
        lastModifiedBy: 'asm'
      },
      {
        id: 'QT-1709123456789',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        customer: {
          name: 'Mark Rivers',
          email: 'mark.rivers@rustic-hw.com',
          phone: '(555) 123-4567',
          company: 'Rustic Hardware'
        },
        items: [
          {
            code: '85103979',
            name: 'ULTRASHIFT PLUS GEN3 TRANSMISSION',
            image: '/assets/products/transmission.jpg',
            quantity: 2,
            originalPrice: 8500.00,
            discountPercent: 0,
            finalPrice: 8500.00,
            selectedWarehouse: {
              location: 'Greensboro Factory Direct',
              stock: 3,
              price: 8500.00,
              deliveryDays: '5-7 business days'
            },
            categories: 'Transmissions'
          },
          {
            code: '22292338',
            name: 'MP8 Engine Assembly Complete',
            image: '/assets/products/engine.jpg',
            quantity: 1,
            originalPrice: 12400.00,
            discountPercent: 0,
            finalPrice: 12400.00,
            selectedWarehouse: {
              location: 'Greensboro Factory Direct',
              stock: 2,
              price: 12400.00,
              deliveryDays: '7-10 business days'
            },
            categories: 'Engines'
          },
          {
            code: '85198234',
            name: 'Complete Wiring Harness Kit',
            image: '/assets/products/wiring.jpg',
            quantity: 2,
            originalPrice: 1250.00,
            discountPercent: 0,
            finalPrice: 1250.00,
            selectedWarehouse: {
              location: 'Greensboro Factory Direct',
              stock: 15,
              price: 1250.00,
              deliveryDays: '5-7 business days'
            },
            categories: 'Electrical'
          }
        ],
        notes: 'Major rebuild project for 2 trucks - need pricing for complete powertrain replacement. This is for a key customer with 50-truck fleet.',
        subtotal: 31900.00,
        discount: 0,
        discountPercent: 0,
        tax: 2552.00,
        shipping: 250.00,
        total: 34702.00,
        validUntil: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
        asmNotes: '',
        lastModifiedBy: 'customer'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mackQuotes', JSON.stringify(quotes));
  }, [quotes]);

  const createQuote = (quoteData) => {
    const newQuote = {
      id: `QT-${Date.now()}`,
      status: 'pending', // pending, sent, accepted, rejected, expired
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        name: quoteData.customerName,
        email: quoteData.email,
        phone: quoteData.phone,
        company: quoteData.company
      },
      items: quoteData.items.map(item => ({
        ...item,
        originalPrice: item.selectedWarehouse?.price || (typeof item.price === 'number' ? item.price : item.price?.value),
        discountPercent: 0,
        finalPrice: item.selectedWarehouse?.price || (typeof item.price === 'number' ? item.price : item.price?.value)
      })),
      notes: quoteData.notes || '',
      subtotal: quoteData.subtotal,
      discount: 0,
      discountPercent: 0,
      tax: quoteData.subtotal * 0.08,
      shipping: 25.00,
      total: quoteData.subtotal + (quoteData.subtotal * 0.08) + 25.00,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      asmNotes: '',
      lastModifiedBy: 'customer'
    };

    setQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  };

  const updateQuote = (quoteId, updates) => {
    setQuotes(prev => prev.map(quote => {
      if (quote.id === quoteId) {
        const updatedQuote = {
          ...quote,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // Recalculate totals if discount changed or items updated
        if (updates.discountPercent !== undefined || updates.items) {
          const items = updates.items || quote.items;
          const overallDiscountPercent = updates.discountPercent !== undefined ? updates.discountPercent : quote.discountPercent;

          // Calculate subtotal using original prices
          const originalSubtotal = items.reduce((sum, item) => {
            const originalPrice = item.originalPrice || item.price?.value || item.price || 0;
            return sum + (originalPrice * item.quantity);
          }, 0);

          // Calculate item-level discounts
          const itemLevelDiscountTotal = items.reduce((sum, item) => {
            const originalPrice = item.originalPrice || item.price?.value || item.price || 0;
            const itemDiscount = (item.discountPercent || 0) / 100;
            const discountAmount = originalPrice * item.quantity * itemDiscount;
            return sum + discountAmount;
          }, 0);

          // Calculate subtotal after item-level discounts
          const subtotalAfterItemDiscounts = items.reduce((sum, item) => {
            const originalPrice = item.originalPrice || item.price?.value || item.price || 0;
            const itemDiscount = (item.discountPercent || 0) / 100;
            const finalPrice = originalPrice * (1 - itemDiscount);
            return sum + (finalPrice * item.quantity);
          }, 0);

          // Apply overall discount on top of item-level discounts (if any)
          const overallDiscount = subtotalAfterItemDiscounts * (overallDiscountPercent / 100);
          const totalDiscount = itemLevelDiscountTotal + overallDiscount;

          const finalSubtotal = subtotalAfterItemDiscounts - overallDiscount;
          const tax = finalSubtotal * 0.08;
          const total = finalSubtotal + tax + 25.00; // 25.00 is shipping

          updatedQuote.subtotal = originalSubtotal;
          updatedQuote.discount = totalDiscount;
          updatedQuote.discountPercent = overallDiscountPercent;
          updatedQuote.tax = tax;
          updatedQuote.total = total;
          updatedQuote.shipping = 25.00;

          // Keep item-level discount information
          updatedQuote.items = items.map(item => {
            const originalPrice = item.originalPrice || item.price?.value || item.price || 0;
            const itemDiscount = (item.discountPercent || 0) / 100;
            const itemFinalPrice = originalPrice * (1 - itemDiscount);

            return {
              ...item,
              originalPrice: originalPrice,
              finalPrice: itemFinalPrice,
              discountPercent: item.discountPercent || 0
            };
          });
        }

        return updatedQuote;
      }
      return quote;
    }));
  };

  const deleteQuote = (quoteId) => {
    setQuotes(prev => prev.filter(quote => quote.id !== quoteId));
  };

  const getQuoteById = (quoteId) => {
    return quotes.find(quote => quote.id === quoteId);
  };

  const getQuotesByCustomer = (email) => {
    return quotes.filter(quote => quote.customer.email === email);
  };

  const acceptQuote = (quoteId) => {
    updateQuote(quoteId, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      lastModifiedBy: 'customer'
    });
  };

  const rejectQuote = (quoteId, reason) => {
    updateQuote(quoteId, {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
      lastModifiedBy: 'customer'
    });
  };

  const sendQuoteToCustomer = (quoteId, asmNotes) => {
    updateQuote(quoteId, {
      status: 'sent',
      sentAt: new Date().toISOString(),
      asmNotes,
      lastModifiedBy: 'asm'
    });
  };

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        createQuote,
        updateQuote,
        deleteQuote,
        getQuoteById,
        getQuotesByCustomer,
        acceptQuote,
        rejectQuote,
        sendQuoteToCustomer
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
