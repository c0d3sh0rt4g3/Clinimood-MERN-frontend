import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../context/useAuthStore';
import '../style/main.scss';

const Navbar = () => {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');
  const [menuOpen, setMenuOpen] = useState(false); // Nuevo estado para el menú

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode ? 'enabled' : 'disabled');
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, [darkMode]);

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

          {/* Botón para abrir el menú en móviles */}
          <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <ul className={`navbar__links ${menuOpen ? 'active' : ''}`}>
            <NavLink to="/" className="navbar__link" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/contact" className="navbar__link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
            {user && (
                <>
                  {user.role === 'patient' && (
                      <>
                        <NavLink to="/history" className="navbar__link" onClick={() => setMenuOpen(false)}>History</NavLink>
                        <NavLink to="/new-appointment" className="navbar__link" onClick={() => setMenuOpen(false)}>New appointment</NavLink>
                      </>
                  )}
                  {user.role === 'doctor' && (
                      <>
                        <NavLink to="/doctor-appointments" className="navbar__link" onClick={() => setMenuOpen(false)}>Appointments</NavLink>
                        <NavLink to="/doctor-patients" className="navbar__link" onClick={() => setMenuOpen(false)}>Patients</NavLink>
                      </>
                  )}
                </>
            )}
            <NavLink to="/doctors" className="navbar__link" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
          </ul>

          <div className="navbar__actions">
            <button onClick={toggleDarkMode} className="navbar__button navbar__button--mode">
              {darkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
                <>
                  <span className="navbar__user-name">{user.name}</span>
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
