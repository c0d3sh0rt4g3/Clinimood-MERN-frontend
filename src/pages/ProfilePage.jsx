import { useState, useEffect } from "react";
import useAuthStore from "../context/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";

const ProfilePage = () => {
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        DNI: "",
        phone: "",
        address: "",
        specialization: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                DNI: user.DNI || "",
                phone: user.phone || "",
                address: user.address || "",
                specialization: user.role === "doctor" ? user.specialization || "" : ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userIdOrDni = user.DNI || user._id;

            const response = await axios.put(
                `https://clinimood-mern-backend.onrender.com/users/${userIdOrDni}`,
                { ...formData },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Respuesta del servidor:", response.data);

            if (response.data.success) {
                setUser(response.data.data);
                localStorage.setItem("user", JSON.stringify(response.data.data));
                Swal.fire("Success!", "Profile updated succesfully", "success");
            } else {
                console.error("Response error:", response.data);
                Swal.fire("Error", "The profile can´t be updated", "error");
            }
        } catch (error) {
            console.error("petition error:", error.response?.data || error.message);
            Swal.fire("Error", error.response?.data?.message || "The profile can´t be updated", "error");
        } finally {
            setLoading(false);
        }
    };



    if (!user) {
        return <p>Log in to edit your profile</p>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                </label>

                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} disabled/>
                </label>

                <label>
                    DNI:
                    <input type="text" name="DNI" value={formData.DNI} disabled/>
                </label>

                <label>
                    phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}/>
                </label>

                <label>
                    address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange}/>
                </label>

                {user.role === "doctor" && (
                    <label>
                        Specialization:
                        <input type="text" name="specialization" value={formData.specialization}
                               onChange={handleChange}/>
                    </label>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
            <button>Change Password</button>
        </div>
    );
};

export default ProfilePage;
