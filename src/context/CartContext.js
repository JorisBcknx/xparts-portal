import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('mackCartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mackCartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedWarehouse = null) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.code === product.code &&
        item.selectedWarehouse?.location === selectedWarehouse?.location
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          ...product,
          quantity,
          selectedWarehouse,
          addedAt: new Date().toISOString()
        }];
      }
    });
  };

  const removeFromCart = (productCode, warehouseLocation = null) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.code === productCode &&
          item.selectedWarehouse?.location === warehouseLocation)
      )
    );
  };

  const updateQuantity = (productCode, quantity, warehouseLocation = null) => {
    if (quantity <= 0) {
      removeFromCart(productCode, warehouseLocation);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.code === productCode &&
        item.selectedWarehouse?.location === warehouseLocation
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mackCartItems');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.selectedWarehouse?.price ||
                   (typeof item.price === 'number' ? item.price : item.price?.value || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productCode, warehouseLocation = null) => {
    return cartItems.some(
      item => item.code === productCode &&
      item.selectedWarehouse?.location === warehouseLocation
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
