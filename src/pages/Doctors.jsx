import React, { useEffect, useState } from "react"
import axios from "axios"
import DoctorCard from "../components/DoctorCard.jsx"

const Doctors = () => {
    const [doctors, setDoctors] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [specializationFilter, setSpecializationFilter] = useState("")
    const [filteredDoctors, setFilteredDoctors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDoctors()
    }, [])

    useEffect(() => {
        // Apply both name and specialization filters
        const timeoutId = setTimeout(() => {
            const filtered = doctors.filter((doctor) => {
                const matchesName = doctor.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                const matchesSpecialization =
                    specializationFilter === "" ||
                    doctor.specialization.toLowerCase() ===
                        specializationFilter.toLowerCase()
                return matchesName && matchesSpecialization
            })
            setFilteredDoctors(filtered)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery, specializationFilter, doctors])

    const fetchDoctors = async () => {
        setLoading(true) // Start loading
        const url = "https://clinimood-mern-backend.onrender.com/users/role/doctor"

        try {
            // Using axios to fetch data
            const response = await axios.get(url)

            // Assuming the response follows the structure { data: { data: [...] } }
            setDoctors(response.data.data)
            setFilteredDoctors(response.data.data)
        } catch (error) {
            console.error(error)
            alert("Failed to fetch doctors. Please try again later.")
        } finally {
            setLoading(false) // End loading
        }
    }

    // Update search query
    const handleSearch = (event) => {
        setSearchQuery(event.target.value)
    }

    // Update specialization filter
    const handleSpecializationChange = (event) => {
        setSpecializationFilter(event.target.value)
    }

    // Get unique specializations for the dropdown
    const specializations = [
        ...new Set(doctors.map((doctor) => doctor.specialization)),
    ]

    if (loading) {
        return <p>Loading doctors...</p>
    }

    return (
        <div>
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
            {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                    <DoctorCard
                        key={doctor._id}
                        name={doctor.name}
                        specialization={doctor.specialization}
                        img={doctor.img}
                    />
                ))
            ) : (
                <p>No doctors found.</p>
            )}
        </div>
    )
}

export default Doctors
