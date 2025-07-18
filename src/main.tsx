import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000, // Durasi default 5 detik
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
    <App />
  </StrictMode>,
)
