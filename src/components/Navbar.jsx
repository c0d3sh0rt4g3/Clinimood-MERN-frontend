// import React from 'react'
import { NavLink } from 'react-router-dom'
import "../style/components/Navbar.scss";
//import {Logo} from "../../public/Logo.png";
const Navbar = () => {
  return (
    <nav className="navbar">
      <header className="navbar__header">
        <div className="navbar__logo">
          <img src="/Logo.png" alt="Clinimood Logo" className="navbar__logo-image" />
          <span className="navbar__logo-text">Clinimood</span>
        </div>
        <ul className="navbar__links">
          <NavLink to="/" className="navbar__link">Home</NavLink>
          <NavLink to="/login" className="navbar__link">Login</NavLink>
          <NavLink to="/register" className="navbar__link">Register</NavLink>
          <NavLink to="/contact" className="navbar__link">Contact</NavLink>
          <NavLink to="/history" className="navbar__link">History</NavLink>
          <NavLink to="/new-appointment" className="navbar__link">New appointment</NavLink>
          <NavLink to="/doctors" className="navbar__link">Doctors</NavLink>
        </ul>
        <div className="navbar__actions">
          <button className="navbar__button navbar__button--primary">Book an appointment</button>
        </div>
      </header>
    </nav>
  )
}

export default Navbar
