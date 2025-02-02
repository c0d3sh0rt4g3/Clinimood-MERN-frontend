import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorCard from "../components/DoctorCard.jsx";
import "../style/main.scss";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filtered = doctors.filter((doctor) => {
                const matchesName = doctor.name
                    ? doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) 
                    : false;  
            
                const matchesSpecialization =
                    specializationFilter === "" ||
                    (doctor.specialization && doctor.specialization.toLowerCase() === specializationFilter.toLowerCase());
            
                return matchesName && matchesSpecialization;
            });
            
            setFilteredDoctors(filtered);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, specializationFilter, doctors]);

    const fetchDoctors = async () => {
        setLoading(true);
        const url =
            "https://clinimood-mern-backend.onrender.com/users/role/doctor";

        try {
            const response = await axios.get(url);
            setDoctors(response.data.data);
            setFilteredDoctors(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="loading-message">Loading doctors...</p>;
    }

    return (
        <div className="doctors-container">
            <h1 className="doctors-title">Find Your Doctor</h1>

            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <select
                    className="filter-select"
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                >
                    <option value="">All Specializations</option>
                    {[...new Set(doctors.map((d) => d.specialization))].map(
                        (specialization, index) => (
                            <option key={index} value={specialization}>
                                {specialization}
                            </option>
                        )
                    )}
                </select>
            </div>

            <div className="doctors-grid">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <DoctorCard
                            key={doctor._id}
                            name={doctor.name}
                            specialization={doctor.specialization}
                            profilePicture={doctor.profilePicture}
                        />
                    ))
                ) : (
                    <p className="no-doctors">No doctors found.</p>
                )}
            </div>

            <button className="appointment-button" onClick={() => navigate("/new-appointment")}>
                Make an Appointment
            </button>
        </div>
    );
};

export default Doctors;
