import React, { useState } from 'react';

const UserRow = ({ userName, email, dni, role }) => {
    const [currentRole, setCurrentRole] = useState(role);

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setCurrentRole(selectedRole);
    };

    return (
        <tr>
            <td>{userName}</td>
            <td>{email}</td>
            <td>{dni}</td>
            <td>
                <select value={currentRole} onChange={handleRoleChange}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>
            </td>
            <td>
                <button onClick={() => console.log(`Deleted user: ${userName}`)}> Eliminar </button>
            </td>
            <td>
                <button onClick={() => console.log(`Updated user: ${userName}`)}> Guardar </button>
            </td>
        </tr>
    );
};

export default UserRow;
