import React, {useState} from 'react'
import useAuthStore from "../context/useAuthStore.jsx"
import {NavLink, useNavigate} from "react-router-dom"

const AdminNavbar = () => {
    const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'enabled'
    );
    const { clearUser } = useAuthStore()
    const navigate = useNavigate()

    // Logout
    const handleLogout = () => {
        clearUser()
        navigate('/')
    }
    // Toggle dark mode
      const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', newMode ? 'enabled' : 'disabled');
      };

    return (
        <header>
            <ul className={"navbar-links"}>
                <h2 id={"user-name"}>Admin</h2>
            </ul>
            <div className="navbar__actions">
              <button onClick={toggleDarkMode} className="navbar__button navbar__button--mode">
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="navbar__button navbar__button--logout">
                Logout
              </button>
              <NavLink to="/profile" className="navbar__profile">
                <img src="/profile-icon.png" alt="Profile" className="navbar__profile-icon" />
              </NavLink>
            </div>
        </header>
    )
}

export default AdminNavbar