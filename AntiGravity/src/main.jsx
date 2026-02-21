import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminApp from './AdminApp.jsx'
import UserApp from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User App Routes */}
        <Route path="/" element={<UserApp />} />
        <Route path="/scan" element={<UserApp />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminApp />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
