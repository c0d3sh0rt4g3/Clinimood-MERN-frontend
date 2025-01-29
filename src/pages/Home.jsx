import "./Home.css";
import {useNavigate} from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  return (
      <div className="home-container">
        <div className="content-wrapper">
          {/* Header Text */}
          <h1 className="header-text">
            The fastest and easiest way of
            booking a medical appointment
          </h1>
          <p className="subheader">
            Our team of expert doctors is committed to providing you with world-class healthcare, ensuring your well-being
            is always in the best hands. Experience personalized and compassionate care like never before.
          </p>

          {/* View Doctors Button */}
          <button className="viewDoctors-button" onClick={() => navigate("/doctors")}>
            View Doctors
          </button>
        </div>

        {/* Image Section */}
        <div className="image-container">
          <img
              src="src/resources/doctores-home.png"
              alt="Medical Appointment"
              className="right-image"
          />
        </div>

        {/* Footer Decoration */}
        <div className="footer">
          {/* Logo Placeholder */}
          <span className="footer-logo"></span>
        </div>
      </div>
  );
};


export default Home;
