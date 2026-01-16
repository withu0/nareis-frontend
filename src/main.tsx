import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './contexts/AppContext'
import { SearchProvider } from './contexts/SearchContext'
import { ThemeProvider } from './components/theme-provider'
import ErrorBoundary from './components/ErrorBoundary'
import { initAnalytics } from './lib/analytics'

// Initialize analytics
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="nareis-theme">
          <AppProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </AppProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
