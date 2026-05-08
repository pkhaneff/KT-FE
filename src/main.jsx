import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../node_modules/antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import { AppProviders } from './app/providers/AppProviders'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
