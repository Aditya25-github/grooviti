// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import StoreContextProvider from './context/StoreContext.jsx' // Add this import
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreContextProvider> {/* Wrap App with StoreContextProvider */}
        <App />
        <ToastContainer />
      </StoreContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
