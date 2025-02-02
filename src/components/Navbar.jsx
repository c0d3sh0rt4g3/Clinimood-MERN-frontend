import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../context/useAuthStore';
import '../style/main.scss';

/**
 * Navbar component that provides navigation and user authentication options.
 * Includes dark mode toggle and conditional rendering based on user roles.
 */
const Navbar = () => {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
      localStorage.getItem('darkMode') === 'enabled'
  );

  /**
   * Toggles dark mode and updates local storage.
   */
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode ? 'enabled' : 'disabled');
  };

  /**
   * Loads dark mode state from local storage when component mounts.
   */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, [darkMode]);

  /**
   * Handles user logout, clears authentication state, and redirects to home page.
   */
  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
      <nav className="navbar">
        <header className="navbar__header">
          <div className="navbar__logo">
            <img src="/Logo.png" alt="Clinimood Logo" className="navbar__logo-image" />
            <span className="navbar__logo-text">Clinimood</span>
          </div>

          <ul className="navbar__links">
            <NavLink to="/" className="navbar__link">Home</NavLink>
            <NavLink to="/contact" className="navbar__link">Contact</NavLink>
            {user && (
                <>
                  {/* Show patient-specific links */}
                  {user.role === 'patient' && (
                      <>
                        <NavLink to="/history" className="navbar__link">History</NavLink>
                        <NavLink to="/new-appointment" className="navbar__link">New appointment</NavLink>
                      </>
                  )}
                  {/* Show doctor-specific links */}
                  {user.role === 'doctor' && (
                      <>
                        <NavLink to="/doctor-appointments" className="navbar__link">Appointments</NavLink>
                        <NavLink to="/doctor-patients" className="navbar__link">Patients</NavLink>
                      </>
                  )}
                </>
            )}
            <NavLink to="/doctors" className="navbar__link">Doctors</NavLink>
          </ul>

          <div className="navbar__actions">
            <button onClick={toggleDarkMode} className="navbar__button navbar__button--mode">
              {darkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
                <>
                  <span className="navbar__user-name">{user.name}</span> {/* Display user name */}
                  <button onClick={handleLogout} className="navbar__button navbar__button--logout">
                    Logout
                  </button>
                  <NavLink to="/profile" className="navbar__profile">
                    <img src="/profile-icon.png" alt="Profile" className="navbar__profile-icon" />
                  </NavLink>
                </>
            ) : (
                <div className="navbar__auth-buttons">
                  <NavLink to="/login" className="navbar__button navbar__button--orange">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="navbar__button navbar__button--orange">
                    Register
                  </NavLink>
                </div>
            )}
          </div>
        </header>
      </nav>
  );
};

export default Navbar;
