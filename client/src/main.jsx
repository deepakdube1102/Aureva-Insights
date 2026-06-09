import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

// Custom dark theme appearance for Clerk components
const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#00d4ff',
    colorBackground: '#0d1130',
    colorText: '#f0f2ff',
    colorTextSecondary: '#8b92b3',
    colorInputBackground: 'rgba(255, 255, 255, 0.06)',
    colorInputText: '#f0f2ff',
    borderRadius: '12px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  elements: {
    card: {
      backgroundColor: 'rgba(15, 20, 55, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    formButtonPrimary: {
      background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%)',
      border: 'none',
      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.25)',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
