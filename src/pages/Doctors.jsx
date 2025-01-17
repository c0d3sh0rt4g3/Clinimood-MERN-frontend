import React, { useEffect, useState } from 'react'
import DoctorCard from "../components/DoctorCard.jsx"

const Doctors = () => {
    const [doctors, setDoctors] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [specializationFilter, setSpecializationFilter] = useState('')
    const [filteredDoctors, setFilteredDoctors] = useState([])

    useEffect(() => {
        fetchDoctors()
    }, [])

    useEffect(() => {
        // Apply both name and specialization filters
        const filtered = doctors.filter(doctor => {
            const matchesName = doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesSpecialization = specializationFilter === '' ||
                                          doctor.specialization.toLowerCase() === specializationFilter.toLowerCase()
            return matchesName && matchesSpecialization
        })
        setFilteredDoctors(filtered)
    }, [searchQuery, specializationFilter, doctors])

    const fetchDoctors = async () => {
        const url = "https://clinimood-mern-backend.onrender.com/users/role/doctor"

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        setDoctors(data.data)
        setFilteredDoctors(data.data)
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
    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))]

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
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
                filteredDoctors.map(doctor => (
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
