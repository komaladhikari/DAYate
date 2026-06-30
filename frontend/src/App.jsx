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
import AdminDashboard from './pages/AdminDashboard'
import BusinessDashboard from './pages/BusinessDashboard'
import DateCalendar from './pages/DateCalendar'
import ExploreIdeas from './pages/ExploreIdeas'
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
          <Route path="/activities" element={<ProtectedRoute allowedRoles={["user"]}><Activites /></ProtectedRoute>} />
          <Route path="/cafes" element={<ProtectedRoute allowedRoles={["user"]}><Cafes /></ProtectedRoute>} />
          <Route path="/gifts" element={<ProtectedRoute allowedRoles={["user"]}><Gifts /></ProtectedRoute>} />
          <Route path="/book-rides" element={<ProtectedRoute allowedRoles={["user"]}><BookRides /></ProtectedRoute>} />
          <Route path="/share" element={<ProtectedRoute allowedRoles={["user"]}><SharePlan /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={["user"]}><Chat /></ProtectedRoute>} />
          <Route path="/date-calendar" element={<ProtectedRoute allowedRoles={["user"]}><DateCalendar /></ProtectedRoute>} />
          <Route path="/explore-ideas" element={<ProtectedRoute allowedRoles={["user"]}><ExploreIdeas /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login accountType="admin" />} />
          <Route path="/business/login" element={<Login accountType="business" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business/register" element={<Register accountType="business" />} />
          <Route path="/about" element={<About />} />
          {/* <Route path = '/placeOrder' element = {<placeOrder/>}/> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-plans" element={<ProtectedRoute allowedRoles={["user"]}><MyPlans /></ProtectedRoute>} />
          <Route path="/cafes/:id" element={<ProtectedRoute allowedRoles={["user"]}><CafeReservation /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={["user"]}><Profile /></ProtectedRoute>} />
          <Route path="/planned-dates" element={<ProtectedRoute allowedRoles={["user"]}><SharePlan /></ProtectedRoute>} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/dashboard"
            element={
              <ProtectedRoute allowedRoles={["business"]}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
