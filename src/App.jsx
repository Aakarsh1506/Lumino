import { Routes, Route } from 'react-router-dom'

import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import MovieDetail from './components/MovieDetail'
import EventDetail from "./components/EventDetail"
import CategoryPage from "./components/CategoryPage"

import BookTickets from "./components/BookTickets"
import EventTicketsPage from "./components/EventTickets"
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  return (
    <Routes>

      {/* Core Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Details Pages */}
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/category/:slug" element={<CategoryPage />} />

      {/* Booking Pages */}
      <Route path="/book-tickets" element={<BookTickets />} />
      <Route path="/book-event-tickets" element={<EventTicketsPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

    </Routes>
  )
}

export default App