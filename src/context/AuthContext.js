import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dealershipAuthUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dealershipAuthUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('dealershipAuthUser');
    }
  }, [user]);

  // Valid users for the system
  const validUsers = {
    'mark.rivers@rustic-hw.com': {
      email: 'mark.rivers@rustic-hw.com',
      name: 'Mark Rivers',
      company: 'Rustic Hardware',
      role: 'Dealer',
      accountNumber: 'RH-10234',
      avatar: 'MR'
    },
    'linda.wolf@rustic-hw.com': {
      email: 'linda.wolf@rustic-hw.com',
      name: 'Linda Wolf',
      company: 'Rustic Hardware',
      role: 'Dealer',
      accountNumber: 'RH-10234',
      avatar: 'LW'
    }
  };

  const login = (email, password) => {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userData = validUsers[normalizedEmail];

    if (!userData) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // In production, you'd validate password against backend
    // For demo, any non-empty password works
    if (!password || password.trim().length === 0) {
      return {
        success: false,
        error: 'Password is required'
      };
    }

    // Set user data
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().toISOString()
    };

    setUser(userWithTimestamp);
    setIsAuthenticated(true);

    return {
      success: true,
      user: userWithTimestamp
    };
  };

  const socialLogin = (provider) => {
    // Mock social login - in production, this would use OAuth
    const defaultUser = validUsers['mark.rivers@rustic-hw.com'];

    const userWithTimestamp = {
      ...defaultUser,
      loginTime: new Date().toISOString(),
      loginMethod: provider
    };

    setUser(userWithTimestamp);
    setIsAuthenticated(true);

    return {
      success: true,
      user: userWithTimestamp
    };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dealershipAuthUser');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    socialLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
