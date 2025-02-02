import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthStore from "../context/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Use the hook at the top level

    useEffect(() => {
        if (!user) return;
    }, [user]);

    const initialValues = {
        name: user?.name || "",
        email: user?.email || "",
        DNI: user?.DNI || "",
        phone: user?.phone || "",
        address: user?.address || "",
        specialization: user?.role === "doctor" ? user?.specialization || "" : ""
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        phone: Yup.string(),
        address: Yup.string(),
        specialization: Yup.string(),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            const userIdOrDni = user.DNI || user._id;
            const response = await axios.put(
                `https://clinimood-mern-backend.onrender.com/users/${userIdOrDni}`,
                values,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                setUser(response.data.data);
                localStorage.setItem("user", JSON.stringify(response.data.data));
                Swal.fire("Success!", "Profile updated successfully", "success");
            } else {
                Swal.fire("Error", "The profile can't be updated", "error");
            }
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "The profile can't be updated", "error");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    if (!user) {
        return <p>Log in to edit your profile</p>;
    }

    return (
        <div className="form-container">
            <div className="form-box">
                <h1>User Profile</h1>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="input-field">
                                <Field name="name">
                                    {({ field }) => <TextField {...field} label="Name" variant="outlined" fullWidth required />}
                                </Field>
                                <ErrorMessage name="name" component="div" className="error-message" />
                            </div>

                            <div className="input-field">
                                <TextField label="Email" value={user.email} variant="outlined" fullWidth disabled />
                            </div>

                            <div className="input-field">
                                <TextField label="DNI" value={user.DNI} variant="outlined" fullWidth disabled />
                            </div>

                            <div className="input-field">
                                <Field name="phone">
                                    {({ field }) => <TextField {...field} label="Phone" variant="outlined" fullWidth />}
                                </Field>
                            </div>

                            <div className="input-field">
                                <Field name="address">
                                    {({ field }) => <TextField {...field} label="Address" variant="outlined" fullWidth />}
                                </Field>
                            </div>

                            {user.role === "doctor" && (
                                <div className="input-field">
                                    <Field name="specialization">
                                        {({ field }) => <TextField {...field} label="Specialization" variant="outlined" fullWidth />}
                                    </Field>
                                </div>
                            )}

                            <Button type="submit" className="form-button" variant="contained" disabled={isSubmitting || loading} fullWidth>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    className="form-button"
                    variant="contained"
                    onClick={() => navigate("/password-recovery")} // Correct usage of navigate
                    fullWidth
                >
                    Change Password
                </Button>
            </div>
        </div>
    );
};

export default ProfilePage;