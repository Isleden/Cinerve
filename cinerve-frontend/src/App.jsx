import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import AdminBookings from './pages/AdminBookings'
import Profile from './pages/Profile'
import SeatSelection from './pages/SeatSelection'
import Payment from './pages/Payment'
import PurchaseHistory from './pages/PurchaseHistory'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/history" element={<PurchaseHistory />} />
      </Routes>
    </BrowserRouter>
  )
}