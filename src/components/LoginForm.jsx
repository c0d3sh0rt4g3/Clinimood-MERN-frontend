import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {NavLink, useNavigate} from 'react-router-dom'
import useAuthStore from "../context/useAuthStore.jsx"
import {useEffect} from "react";
import {Button, TextField} from "@mui/material";
import Swal from "sweetalert2";

/**
 * Validation schema for the login form.
 * Ensures email and password fields are correctly formatted and required.
 */
const validationSchema = Yup.object({
    email: Yup.string().email('Email not valid').required('Email is required'),
    password: Yup.string().required('Password is required'),
})

/**
 * Login form component using Formik for handling form state and validation.
 * Redirects authenticated users and handles login errors.
 *
 * @component
 * @returns {JSX.Element} The rendered login form component.
 */
const LoginForm = () => {
    const loginUser = useAuthStore((state) => state.loginUser)
    const { user } = useAuthStore();
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to home if logged in
        if (user) {
            navigate('/')
        }
    }, [navigate])

    /**
     * Handles form submission by calling the login function and redirecting users based on their role.
     * Displays an error alert if login fails.
     *
     * @param {Object} values - The login form values.
     * @param {Object} actions - Formik form actions.
     * @param {Function} actions.setSubmitting - Function to set the submitting state.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (values, { setSubmitting }) => {
        const result = await loginUser(values);

        if (result.success) {
            // Fetch the updated user state after login
            const updatedUser = useAuthStore.getState().user;

            console.log(updatedUser);

            if (updatedUser.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } else {
            console.error("Login error:", result.error);
            Swal.fire({
                title: 'Error!',
                text: 'Login failed',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }

        setSubmitting(false);
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h1>LOGIN</h1>
                <Formik
                    initialValues={{email: '', password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting, handleSubmit}) => (
                        <form onSubmit={handleSubmit}>
                            <Field name="email">
                                {({field}) => (
                                    <TextField
                                        {...field}
                                        type="email"
                                        label="Email"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        className="input-field"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="email" component="div" className="error-message"/>

                            <Field name="password">
                                {({field}) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Password"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        className="input-field"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="password" component="div" className="error-message"/>

                            <Button
                                type="submit"
                                variant="contained"
                                className="form-button"
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting ? '...' : 'LOGIN'}
                            </Button>
                        </form>
                    )}
                </Formik>
                <p className="form-links">
                    Don’t have an account? <a href="/register">Sign up</a>
                </p>

                <p className="form-links">
                    Did you forget your password? <NavLink to="/password-recovery">Click here</NavLink>
                </p>
            </div>
        </div>
    )
}

export default LoginForm;