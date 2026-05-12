import React from 'react'
import Header from './components/Header'
import Login from './components/Login'
import './App.css'

const App = () => {
  return (
    <div className="page">
      <Header />
      <div className="container">
        <div className="left">
          <Login />
        </div>
        <div className="center">
          <div className="cta">
            <h3>Dont have an account?</h3>
            <button className="signup">Sign Up</button>
            <div className="divider" />
            <div className="socials">
              <div className="social">f</div>
              <div className="social">G</div>
              <div className="social"></div>
            </div>
          </div>
        </div>
        <div className="right">
          <img src="/src/assets/login.png" alt="phone" className="phone" />
        </div>
      </div>
    </div>
  )
}

export default App