import {useState} from "react"

const UserRow = ({ userName, email, dni, role, onDelete, onSave }) => {
    const [currentRole, setCurrentRole] = useState(role)

    // Function to change the role on the useState each time it's changed
    const handleRoleChange = (e) => {
        const selectedRole = e.target.value
        setCurrentRole(selectedRole)
    }

    // Function to call the API to delete a user
    const handleDelete = async () => {
        try {
            const url = `https://clinimood-mern-backend.onrender.com/users/${dni}`

            const response = await fetch(url, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            console.log(`User with DNI ${dni} deleted successfully.`)
            onDelete()
        } catch (error) {
            console.error(`Error deleting user: ${error}`)
        }
    }

    // Function to call the API to update the role of a user
    const handleSave = async () => {
        try {
            const url = `https://clinimood-mern-backend.onrender.com/users/${dni}`

            const body = {
                role: currentRole
            }

            // We specify the method and parse the body we're passing to it
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            console.log(`The role of the user with DNI ${dni} has been changed succesfully.`)
            onSave()
        } catch (error) {
            console.error(`Error deleting user: ${error}`)
        }
    }

    return (
        <tr className={"body__element"}>
            <td className={"element__column"}>{userName}</td>
            <td className={"element__column"}>{dni}</td>
            <td className={"element__column"}>{email}</td>
            {/*If the user displayed has a role different from admin, it displays the save and delete user*/
                role !== "admin" ? (
                    <>
                        <td className={"element__column"}>
                            <select id={"column__role-selector"} value={currentRole} onChange={handleRoleChange}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </td>
                        <td className={"element__column"}>
                            <button id={"column__delete-btn"} className={"column__btn"} onClick={handleDelete}>Eliminar</button>
                            <button id={"column__save-btn"} className={"column__btn"} onClick={handleSave}>Guardar</button>
                        </td>
                    </>
                ) : (
                    <td className={"element__column"}>Admin</td>
                )
            }
        </tr>
    )
}

export default UserRow
