import React, { createContext, useContext, useState, useEffect } from 'react';

const ASMContext = createContext();

export const useASM = () => {
  const context = useContext(ASMContext);
  if (!context) {
    throw new Error('useASM must be used within ASMProvider');
  }
  return context;
};

export const ASMProvider = ({ children }) => {
  const [asmActive, setAsmActive] = useState(() => {
    const saved = localStorage.getItem('asmActive');
    return saved ? JSON.parse(saved) : false;
  });

  const [asmAgent, setAsmAgent] = useState(() => {
    const saved = localStorage.getItem('asmAgent');
    return saved ? JSON.parse(saved) : null;
  });

  const [emulatedCustomer, setEmulatedCustomer] = useState(() => {
    const saved = localStorage.getItem('asmEmulatedCustomer');
    return saved ? JSON.parse(saved) : null;
  });

  const [showCustomerSelection, setShowCustomerSelection] = useState(false);

  useEffect(() => {
    localStorage.setItem('asmActive', JSON.stringify(asmActive));
  }, [asmActive]);

  useEffect(() => {
    localStorage.setItem('asmAgent', JSON.stringify(asmAgent));
  }, [asmAgent]);

  useEffect(() => {
    localStorage.setItem('asmEmulatedCustomer', JSON.stringify(emulatedCustomer));
  }, [emulatedCustomer]);

  const startASMSession = (agentEmail, agentPassword) => {
    // Accept any email/password for demo
    if (agentEmail && agentPassword) {
      setAsmAgent({
        email: agentEmail,
        name: 'Service Agent',
        loginTime: new Date().toISOString()
      });

      // Show customer selection instead of auto-emulating
      setShowCustomerSelection(true);
      return true;
    }
    return false;
  };

  const selectCustomer = (customer) => {
    setEmulatedCustomer(customer);
    setAsmActive(true);
    setShowCustomerSelection(false);
  };

  const endASMSession = () => {
    setAsmActive(false);
    setAsmAgent(null);
    setEmulatedCustomer(null);
    setShowCustomerSelection(false);
  };

  const value = {
    asmActive,
    asmAgent,
    emulatedCustomer,
    showCustomerSelection,
    startASMSession,
    selectCustomer,
    endASMSession
  };

  return (
    <ASMContext.Provider value={value}>
      {children}
    </ASMContext.Provider>
  );
};
