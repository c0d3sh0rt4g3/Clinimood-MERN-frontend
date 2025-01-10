//import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
    <header className="navbar-header">
        <img src="" alt="" />
        <ul className="navbar__links">
        <NavLink to="/"> Home</NavLink>
        <NavLink to="/"> Login</NavLink>
        <NavLink to="/"> Register</NavLink>
        <NavLink to="/"> Calendar</NavLink>
        </ul>
    </header>
</nav>
  )
}

export default Navbar