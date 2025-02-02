import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorCard from "../components/DoctorCard.jsx";
import "../style/main.scss";

/**
 * Component to display a list of doctors and provide filters for search and specialization.
 *
 * @component
 * @returns {JSX.Element} The Doctors component.
 */
const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    /**
     * Fetches the list of doctors from the backend.
     *
     * @async
     * @function fetchDoctors
     * @description Makes an API call to fetch doctors data and sets the doctors state.
     */
    useEffect(() => {
        fetchDoctors();
    }, []);

    /**
     * Filters doctors based on search query and specialization filter.
     *
     * @function
     * @description Filters doctors list whenever searchQuery, specializationFilter, or doctors state changes.
     */
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

    /**
     * Fetches doctor data from the API and sets it in the state.
     *
     * @async
     * @function
     * @description Fetches doctor information and updates the doctors state.
     */
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
                {/* Search by doctor name */}
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                {/* Filter by specialization */}
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

            {/* Display filtered doctors */}
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

            {/* Button to navigate to appointment page */}
            <button className="appointment-button" onClick={() => navigate("/new-appointment")}>
                Make an Appointment
            </button>
        </div>
    );
};

export default Doctors;

