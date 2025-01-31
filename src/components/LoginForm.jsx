import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import useAuthStore from "../context/useAuthStore.jsx"
import {useEffect} from "react";
import {Button, TextField} from "@mui/material";
const validationSchema = Yup.object({
    email: Yup.string().email('Email not valid').required('Email is required'),
    password: Yup.string().required('Password is required'),
})

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
            alert(result.error || "Unknown error");
        }

        setSubmitting(false);
    };


    return (
        <div className="form-container">
            <div className="form-box">
                <h1>LOGIN</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Field name="email">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        type="email"
                                        label="Email / DNI"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        className="input-field"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="email" component="div" className="error-message" />

                            <Field name="password">
                                {({ field }) => (
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
                            <ErrorMessage name="password" component="div" className="error-message" />

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
            </div>
        </div>
    )
}

export default LoginForm;