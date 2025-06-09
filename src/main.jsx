import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import ThemeProvider from './providers/ThemeProvider.jsx'
import ResponsiveProvider from './providers/ResponsiveProvider.jsx'
import { router } from './Router.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ResponsiveProvider>
          <RouterProvider router={ router }/>
        </ResponsiveProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
