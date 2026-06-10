import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Activites from './pages/Activites'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'
import About from './pages/About'
import Cafes from './pages/Cafes'
import Gifts from './pages/Gifts'
import BookRides from './pages/BookRides'
import SharePlan from './pages/SharePlan'
import Chat from './pages/Chat'
import Dashboard from './pages/Dashboard'
import DateCalendar from './pages/DateCalendar'
//import placeOrder from './pages/placeOrder'
import Contact from './pages/Contact'
import MyPlans from "./pages/MyPlans";
import Profile from "./pages/Profile";


import CafeReservation from './pages/CafeReservation'


const App = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-b from-rose-50 via-white to-amber-50 text-slate-900">
      <Navbar />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<ProtectedRoute><Activites /></ProtectedRoute>} />
          <Route path="/cafes" element={<ProtectedRoute><Cafes /></ProtectedRoute>} />
          <Route path="/gifts" element={<ProtectedRoute><Gifts /></ProtectedRoute>} />
          <Route path="/book-rides" element={<ProtectedRoute><BookRides /></ProtectedRoute>} />
          <Route path="/share" element={<ProtectedRoute><SharePlan /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/date-calendar" element={<ProtectedRoute><DateCalendar /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          {/* <Route path = '/placeOrder' element = {<placeOrder/>}/> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />
          <Route path="/cafes/:id" element={<ProtectedRoute><CafeReservation /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/planned-dates" element={<ProtectedRoute><SharePlan /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
