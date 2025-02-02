import React, { useEffect, useState } from "react"
import UserRow from "../components/Admin/UserRow.jsx"
import axios from "axios"
import "../style/main.scss"
import useAuthStore from "../context/useAuthStore.jsx";
import {useNavigate} from "react-router-dom";

/**
 * Admin component to manage user data.
 * Redirects non-admin users to the home page.
 * Fetches user data from the API and allows role management.
 * @component
 */
const Admin = () => {
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuthStore();
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to the home page if the user is not an admin
        if (!user || user.role !== "admin") {
            navigate("/")
        }
        fetchData()
    }, [])

    /**
     * Fetches all users from the database.
     * Uses axios to call the API and updates the state.
     * Logs errors if the request fails.
     */
    const fetchData = async () => {
        setLoading(true)
        try {
            const url = "https://clinimood-mern-backend.onrender.com/users"
            const response = await axios.get(url)
            setUsersData(response.data.data)
            console.log(response.data.data)
        } catch (error) {
            console.error(`Error fetching data: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Refreshes user data after a user is deleted.
     */
    const handleUserDelete = () => {
        fetchData()
    }

    /**
     * Refreshes user data after a user role is updated.
     */
    const handleUserSave = () => {
        fetchData()
    }

    if (loading) {
        return <p>Loading user data...</p> // Loading message
    }

    return (
        <table id={"users-table"}>
            <thead id={"table__head"}>
            <tr>
                <th className={"head__element"}>Username</th>
                <th className={"head__element"}>DNI</th>
                <th className={"head__element"}>Email</th>
                <th className={"head__element"}>Role</th>
                <th className={"head__element"}>Manage</th>
            </tr>
            </thead>
            <tbody id={"table__body"}>
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
                <tr className={"body__element"}>
                    <td className={"element__column"} colSpan="4">No user data available</td>
                </tr>
            )}
            </tbody>
        </table>
    )
}

export default Admin
