import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminApp from './AdminApp.jsx'
import App from './App.jsx' // Renamed from UserApp to App based on the instruction's code edit
import { GlobalSessionProvider } from './context/GlobalSessionContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalSessionProvider>
      <BrowserRouter>
        <Routes>
          {/* User Application Routes */}
          <Route path="/" element={<App />} />
          <Route path="/scan" element={<App />} />

          {/* Admin Application Route */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </GlobalSessionProvider>
  </React.StrictMode>,
)
