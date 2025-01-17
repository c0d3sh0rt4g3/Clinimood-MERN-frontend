import React, { useEffect, useState } from 'react';
import UserRow from "../components/Admin/UserRow.jsx";

const Admin = () => {
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleUserDelete = () => {
        fetchData()
    };

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
