import {useState} from "react";

const UserRow = ({ userName, email, dni, role, onDelete }) => {
    const [currentRole, setCurrentRole] = useState(role);

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setCurrentRole(selectedRole);
    };

    const handleDelete = async () => {
        try {
            const url = `https://clinimood-mern-backend.onrender.com/users/${dni}`;

            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`User with DNI ${dni} deleted successfully.`);
            onDelete(dni); // Llamar a la función para actualizar la lista
        } catch (error) {
            console.error(`Error deleting user: ${error}`);
        }
    };

    return (
        <tr>
            <td>{userName}</td>
            <td>{dni}</td>
            <td>{email}</td>
            <td>
                <select value={currentRole} onChange={handleRoleChange}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>
            </td>
            <td>
                <button onClick={handleDelete}>Eliminar</button>
            </td>
            <td>
                <button onClick={() => console.log(`Updated user: ${userName}`)}>Guardar</button>
            </td>
        </tr>
    );
};

export default UserRow;
