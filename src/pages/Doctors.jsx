import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import DoctorCard from "../components/DoctorCard.jsx";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filtered = doctors.filter((doctor) => {
                const matchesName = doctor.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                const matchesSpecialization =
                    specializationFilter === "" ||
                    doctor.specialization.toLowerCase() ===
                        specializationFilter.toLowerCase();
                return matchesName && matchesSpecialization;
            });
            setFilteredDoctors(filtered);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, specializationFilter, doctors]);

    const fetchDoctors = async () => {
        setLoading(true); // Start loading
        const url =
            "https://clinimood-mern-backend.onrender.com/users/role/doctor";

        try {
            // Using axios to fetch data
            const response = await axios.get(url);

            // Assuming the response follows the structure { data: { data: [...] } }
            setDoctors(response.data.data);
            setFilteredDoctors(response.data.data);
            console.log(response.data.data.profilePicture);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch doctors. Please try again later.");
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSpecializationChange = (event) => {
        setSpecializationFilter(event.target.value);
    };

    const specializations = [
        ...new Set(doctors.map((doctor) => doctor.specialization)),
    ];

    if (loading) {
        return <p>Loading doctors...</p>;
    }

    return (
        <>
            <div>
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {/* Specialization Dropdown */}
                <label htmlFor="specialization">Specialization: </label>
                <select
                    id="specialization"
                    value={specializationFilter}
                    onChange={handleSpecializationChange}
                >
                    <option value="">All Specializations</option>
                    {specializations.map((specialization, index) => (
                        <option key={index} value={specialization}>
                            {specialization}
                        </option>
                    ))}
                </select>
            </div>
            {/*If there's doctors we loop through them to display them*/}
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
                <p>No doctors found.</p>
            )}

            {/* Navigate to Calendar Page Button */}
            <button onClick={() => navigate("/calendar")}>
                Make an appointment
            </button>
        </>
    );
};

export default Doctors;
