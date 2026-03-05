import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securityCheck, setSecurityCheck] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate security check (CIAM features)
    setSecurityCheck(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        setSecurityCheck(false);
      } else {
        // Success - App.js will handle redirect
        setLoading(false);
      }
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setSecurityCheck(true);

    // Simulate OAuth flow
    setTimeout(() => {
      socialLogin(provider);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-page">
      {/* Left side - Branding */}
      <div className="login-brand-section">
        <div className="brand-content">
          <img src="/assets/dealership-logo.png" alt="Dealership Portal" className="brand-logo" />
          <h1 className="brand-title">Dealership Portal</h1>
          <p className="brand-subtitle">Your gateway to genuine parts and accessories</p>

          {/* Feature highlights */}
          <div className="brand-features">
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Genuine OEM Parts</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Fast Order Processing</span>
            </div>
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="currentColor"/>
              </svg>
              <span>Real-time Inventory</span>
            </div>
          </div>

          {/* Product images showcase */}
          <div className="product-showcase">
            <img src="/assets/products/products/85142795-ULTRASHIFT-DM-CLUTCH.jpg" alt="Parts" />
            <img src="/assets/products/products/3041-40014SP.jpg" alt="Parts" />
            <img src="/assets/products/Engine Air Filter (Round) [2191-P181057].jpg" alt="Parts" />
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="login-form-section">
        <div className="login-form-container">
          {/* Security badges */}
          <div className="security-badges">
            <div className="security-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17 22 21 18 21 13V5L12 2L3 5V13C3 18 7 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SSL Secured</span>
            </div>
            <div className="security-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Session Protected</span>
            </div>
            <div className="security-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 20C7 17.2386 9.23858 15 12 15C14.7614 15 17 17.2386 17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>CIAM Verified</span>
            </div>
          </div>

          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your dealer account</p>

          {/* Security check indicator */}
          {securityCheck && (
            <div className="security-check-banner">
              <div className="security-spinner"></div>
              <span>Verifying credentials & checking security policies...</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.5056 13.6583 12.4944 13.6583 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 11V9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9V11C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L21 21M10.584 10.587C10.2087 10.9623 9.99778 11.4716 9.99756 12.0018C9.99734 12.532 10.2078 13.0415 10.5828 13.4171C10.9578 13.7928 11.4671 14.0037 11.9973 14.0039C12.5275 14.0042 13.037 13.7937 13.4126 13.4187M10.584 10.587L13.4126 13.4187M10.584 10.587L7.36198 7.36401C5.68464 8.4664 4.25891 9.94084 3.18896 11.6801C2.93701 12.1075 2.93701 12.6325 3.18896 13.0599C5.09124 16.0952 8.32673 18 12 18C13.5571 18 15.0571 17.6522 16.418 17.018M10.584 10.587L13.4126 13.4187M13.4126 13.4187L16.639 16.644M20.811 16.644C19.1337 15.5416 17.7079 14.0672 16.638 12.3279C16.386 11.9005 16.386 11.3755 16.638 10.9481C14.7357 7.91278 11.5002 6.00778 7.82295 6.00003L16.639 16.644" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* Social login options */}
          <div className="social-login-buttons">
            <button
              type="button"
              className="social-login-btn google"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              className="social-login-btn microsoft"
              onClick={() => handleSocialLogin('microsoft')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
              Microsoft
            </button>

            <button
              type="button"
              className="social-login-btn sso"
              onClick={() => handleSocialLogin('sso')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Corporate SSO
            </button>
          </div>

          {/* Demo credentials helper */}
          <div className="demo-credentials">
            <p><strong>Demo Accounts:</strong></p>
            <p>mark.rivers@rustic-hw.com</p>
            <p>linda.wolf@rustic-hw.com</p>
            <small>(any password)</small>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>Protected by Enterprise Security</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <span>•</span>
              <a href="#terms">Terms of Service</a>
              <span>•</span>
              <a href="#support">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
