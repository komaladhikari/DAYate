import React from 'react'
import logo from "../assets/logo.png"
import './Header.css'

const Header = () => {
  return (
    <div className="header">
      <img src={logo} alt="DAYate logo" className="logo" />
    </div>
  )
}

export default Header
