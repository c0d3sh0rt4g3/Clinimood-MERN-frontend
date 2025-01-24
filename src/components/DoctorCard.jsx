import React from 'react';

const DoctorCard = ({name, specialization, profilePicture}) => {
    console.log(profilePicture);
    return (
        <div>
            <img src={profilePicture} alt={`Doctor ${name} pfp`}/>
            <h3>{name}</h3>
            <p>{specialization}</p>
        </div>
    );
};

export default DoctorCard;