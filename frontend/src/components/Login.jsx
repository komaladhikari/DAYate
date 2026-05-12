import React from 'react'
import './Login.css'
import logo from "../assets/logo.png";
import loginImg from "../assets/login.png";


const Login = () => {
  return (
    <>
    <div className="top-bar">
        <img src={logo} alt="Dayate logo" className="top-logo" />
      </div>
   
    <div className="login-card">
      <h1 className="title">Login</h1>
      <div className="form">
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Password" type="password" />
        <div className="forgot">Forgot Password</div>
        <button className="login-btn">Login</button>
      </div>
    </div>
     </>
  )
}

export default Login
