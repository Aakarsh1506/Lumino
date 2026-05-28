import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import MovieDetail from './components/MovieDetail'   
import EventDetail from "./components/EventDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/movie/:id" element={<MovieDetail />} /> 
      <Route path="/event/:id" element={<EventDetail />} /> 
    </Routes>
  )
}

export default App