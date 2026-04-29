import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '../../core/theme/ThemeContext'
import { CartProvider } from '../../core/cart/CartContext'
import { AuthProvider } from '../../features/auth'

export function AppProviders({ children }) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
