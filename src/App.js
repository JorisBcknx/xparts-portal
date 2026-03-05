import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { QuoteProvider } from './context/QuoteContext';
import { OrderProvider } from './context/OrderContext';
import { ASMProvider } from './context/ASMContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ASMBar from './components/ASMBar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Quotes from './pages/Quotes';
import QuickOrder from './pages/QuickOrder';
import PoSPortal from './pages/PoSPortal';
import Login from './pages/Login';
import MyCompany from './pages/MyCompany';
import CompanyUsers from './pages/CompanyUsers';
import CompanyBudgets from './pages/CompanyBudgets';
import CompanyCostCenters from './pages/CompanyCostCenters';
import CompanyPurchaseLimits from './pages/CompanyPurchaseLimits';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPosView, setIsPosView] = useState(false);

  const toggleView = () => {
    setIsPosView(!isPosView);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Point of Sale view - simplified layout
  if (isPosView) {
    return (
      <ASMProvider>
        <SearchProvider>
          <CartProvider>
            <QuoteProvider>
              <OrderProvider>
                <Router>
                  <div className="app pos-mode">
                    <Header onMenuClick={() => {}} onViewToggle={toggleView} isPosView={true} />
                    <ASMBar />
                    <PoSPortal />
                  </div>
                </Router>
              </OrderProvider>
            </QuoteProvider>
          </CartProvider>
        </SearchProvider>
      </ASMProvider>
    );
  }

  // Standard desktop portal view
  return (
    <ASMProvider>
      <SearchProvider>
        <CartProvider>
          <QuoteProvider>
            <OrderProvider>
              <Router>
                <div className="app">
                  <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onViewToggle={toggleView} isPosView={false} />
                  <ASMBar />
                  <div className="app-container">
                    <Sidebar isOpen={sidebarOpen} />
                    <main className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:productCode" element={<ProductDetail />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/quotes" element={<Quotes />} />
                        <Route path="/quick-order" element={<QuickOrder />} />
                        <Route path="/my-company" element={<MyCompany />} />
                        <Route path="/my-company/users" element={<CompanyUsers />} />
                        <Route path="/my-company/budgets" element={<CompanyBudgets />} />
                        <Route path="/my-company/cost-centers" element={<CompanyCostCenters />} />
                        <Route path="/my-company/purchase-limits" element={<CompanyPurchaseLimits />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </Router>
            </OrderProvider>
          </QuoteProvider>
        </CartProvider>
      </SearchProvider>
    </ASMProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
