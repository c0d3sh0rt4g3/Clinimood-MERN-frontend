import React, { useEffect, useState } from "react"
import UserRow from "../components/Admin/UserRow.jsx"
import axios from "axios"

const Admin = () => {
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    // Function to call the API to get all users in our DB
    const fetchData = async () => {
        setLoading(true)
        try {
            const url = "https://clinimood-mern-backend.onrender.com/users"

            // Using axios to fetch data
            const response = await axios.get(url)
            setUsersData(response.data.data)
            console.log(response.data.data)
        } catch (error) {
            console.error(`Error fetching data: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    // When a user is deleted, the API is called again to display updated data
    const handleUserDelete = () => {
        fetchData()
    }

    // When a user role is changed, the API is called again to display updated data
    const handleUserSave = () => {
        fetchData()
    }

    if (loading) {
        return <p>Loading user data...</p> // Loading message
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {usersData.length > 0 ? (
                    usersData.map((user, index) => (
                        <UserRow
                            key={index}
                            userName={user.name}
                            email={user.email}
                            dni={user.DNI}
                            role={user.role}
                            onDelete={handleUserDelete}
                            onSave={handleUserSave}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No user data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Admin