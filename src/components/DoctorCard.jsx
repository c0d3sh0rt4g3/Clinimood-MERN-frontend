import React from "react";
import "../style/main.scss";

const defaultProfilePicture = "../public/default-doctor.png";
const DoctorCard = ({ name, specialization, profilePicture }) => {
  return (
    <div className="doctor-card">
      <img
        src={profilePicture || defaultProfilePicture}
        alt={`Doctor ${name}`}
        className="doctor-card__image"
      />
      <div className="doctor-card__info">
        <h3 className="doctor-card__name">{name}</h3>
        <p className="doctor-card__specialization">{specialization}</p>
      </div>
    </div>
  );
};

export default DoctorCard;
