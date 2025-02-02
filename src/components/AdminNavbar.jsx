import React, {useState} from 'react'
import useAuthStore from "../context/useAuthStore.jsx"
import {NavLink, useNavigate} from "react-router-dom"
import "./../style/main.scss";

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
        <header className="navbar">
            <div className="navbar__header">
              <div className="navbar__logo">
                <img src="/Logo.png" alt="Clinimood Logo" className="navbar__logo-image" />
                <span className="navbar__logo-text">Clinimood Admin</span>
              </div>
               
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
            </div>
        </header>
    );
    
}

export default AdminNavbar