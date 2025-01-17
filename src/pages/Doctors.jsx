import React, {useEffect, useState} from 'react';
import DoctorCard from "../components/DoctorCard.jsx";

const Doctors = () => {
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        fetchDoctors()
    }, []);

    const fetchDoctors = async () => {
        const url = "https://clinimood-mern-backend.onrender.com/users/role/doctor"

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json();

        console.log(data.data)
        setDoctors(data.data);
    }
    return (
        <div>
            {doctors.length > 0 ? (
                doctors.map(doctor => {
                    return <DoctorCard key={doctor._id} name={doctor.name} specialization={doctor.specialization} img={doctor.img}/>
                })
            ): (
                <p>No doctors found.</p>
            )}
        </div>
    );
};

export default Doctors;