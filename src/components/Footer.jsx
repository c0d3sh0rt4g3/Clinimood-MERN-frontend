// import React from 'react';
import "../style/main.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__logo">
          <img src="/Logo.png" alt="Clinimood Logo" className="footer__logo-image" />
        </div>
      </div>
      <div className="footer__bottom">
        <div className="footer__text">
          
          <p>© 2025 Clinimood. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
