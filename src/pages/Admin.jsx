import React, { useEffect, useState } from 'react';
import UserRow from "../components/Admin/UserRow.jsx";

const Admin = () => {
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    // Function to call the api to get all users on our DB
    const fetchData = async () => {
        try {
            const url = "https://clinimood-mern-backend.onrender.com/users";

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setUsersData(data.data);
            console.log(data.data);
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
        }
    };

    // When a user is deleted, the API is called again to display updated data
    const handleUserDelete = () => {
        fetchData()
    }

    // When a user role is changed, the API is called again to display updated data
    const handleUserSave = () => {
        fetchData()
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
    );
};

export default Admin;
