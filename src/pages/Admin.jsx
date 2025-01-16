import React, {useEffect, useState} from 'react';
import log from "eslint-plugin-react/lib/util/log.js";
import UserRow from "../components/Admin/UserRow.jsx";

const Admin = () => {
    const [usersData, setUsersData] = useState([])

    useEffect( () => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try{
            const url = "https://clinimood-mern-backend.onrender.com/users"

            const response = await fetch(url)

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json()

            setUsersData(data.data)
            console.log(data.data)
        } catch (error) {
            console.error(`Error fetching data ${error}`)
        }
    }

    return (
        <table>
            <tr>
                <th>Username</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Role</th>
            </tr>
            <h1>Admin</h1>
            { usersData.length > 0 ? (
                usersData.map((user, index) => {
                    return <UserRow key={index} userName={user.name} email={user.email} dni={user.DNI} role={user.role}/>
                })
            ): (
                <p>No user data available</p>
            )
            }
        </table>
    );
};

export default Admin;