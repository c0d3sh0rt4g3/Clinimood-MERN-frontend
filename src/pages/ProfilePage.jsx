import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthStore from "../context/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";
import { TextField, Button } from "@mui/material";

/**
 * ProfilePage component allows users to view and update their profile information.
 * It includes form validation using Formik and Yup.
 * @returns {JSX.Element} The user profile page component.
 */
const ProfilePage = () => {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
    }, [user]);

    /**
     * Initial values for the profile form.
     * @type {Object}
     */
    const initialValues = {
        name: user?.name || "",
        email: user?.email || "",
        DNI: user?.DNI || "",
        phone: user?.phone || "",
        address: user?.address || "",
        specialization: user?.role === "doctor" ? user?.specialization || "" : ""
    };

    /**
     * Validation schema for the profile form.
     * @type {Yup.ObjectSchema}
     */
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        phone: Yup.string(),
        address: Yup.string(),
        specialization: Yup.string(),
    });

    /**
     * Handles form submission to update user profile.
     * @param {Object} values - Form values.
     * @param {Object} actions - Formik actions.
     * @param {Function} actions.setSubmitting - Function to control submission state.
     * @returns {Promise<void>}
     */
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

                <Button className="form-button" variant="contained" fullWidth>
                    Change Password
                </Button>
            </div>
        </div>
    );
};

export default ProfilePage;
