import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './services/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SearchPage from './pages/SearchPage'
import BookingPage from './pages/BookingPage'
import AppointmentsPage from './pages/AppointmentsPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/auth"         element={<AuthPage />} />
          <Route path="/search"       element={<SearchPage />} />
          <Route path="/book/:id"     element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}