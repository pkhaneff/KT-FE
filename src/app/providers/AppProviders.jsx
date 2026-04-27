import { HelmetProvider } from 'react-helmet-async'

export function AppProviders({ children }) {
  return <HelmetProvider>{children}</HelmetProvider>
}
