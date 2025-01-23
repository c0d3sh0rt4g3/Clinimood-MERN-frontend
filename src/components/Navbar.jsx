//import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
    <header className="navbar-header">
        <img src="" alt="" />
        <ul className="navbar__links">
        <NavLink to="/"> Home</NavLink>
        <NavLink to="/login"> Login</NavLink>
        <NavLink to="/register"> Register</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/new-appointment"> New appointment</NavLink>
        <NavLink to="/doctors">Doctors</NavLink>
        </ul>
    </header>
</nav>
  )
}

export default Navbar