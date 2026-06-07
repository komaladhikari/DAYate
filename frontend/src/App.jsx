import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Activites from './pages/Activites'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import About from './pages/About'
import Cafes from './pages/Cafes'
import Gifts from './pages/Gifts'
import BookRides from './pages/BookRides'
import SharePlan from './pages/SharePlan'
import Chat from './pages/Chat'
import Dashboard from './pages/Dashboard'
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
          <Route path="/activities" element={<Activites />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/book-rides" element={<BookRides />} />
          <Route path="/share" element={<SharePlan />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          {/* <Route path = '/placeOrder' element = {<placeOrder/>}/> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-plans" element={<MyPlans />} />
          <Route path="/cafes/:id" element={<CafeReservation />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

export default App