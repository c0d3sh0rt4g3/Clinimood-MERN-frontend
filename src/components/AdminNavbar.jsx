import React from 'react'
import useAuthStore from "../context/useAuthStore.jsx"
import {useNavigate} from "react-router-dom"

const AdminNavbar = () => {
    const { clearUser } = useAuthStore()
    const navigate = useNavigate()

    // Logout
    const handleLogout = () => {
        clearUser()
        navigate('/')
    }
    return (
        <header>
            <ul className={"navbar-links"}>
                <h2 id={"user-name"}>Admin</h2>
                <button onClick={handleLogout}>Sign out</button>
            </ul>
        </header>
    )
}

export default AdminNavbar