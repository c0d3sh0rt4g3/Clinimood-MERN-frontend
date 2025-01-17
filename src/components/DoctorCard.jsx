import React from 'react';

const DoctorCard = ({name, specialization, img}) => {
    return (
        <div>
            <img src={img} alt={`Doctor ${name} pfp`}/>
            <h3>{name}</h3>
            <p>{specialization}</p>
        </div>
    );
};

export default DoctorCard;