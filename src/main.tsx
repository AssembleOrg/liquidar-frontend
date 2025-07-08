import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SnackbarProvider } from 'notistack'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { initMercadoPago } from '@mercadopago/sdk-react';

const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || '';
const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

// Inicializar MercadoPago para Checkout Bricks
initMercadoPago(mpPublicKey, {
  locale: 'es-AR',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3500}>
        <App />
      </SnackbarProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
