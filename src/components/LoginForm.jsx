import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { TextField, Button } from '@mui/material'
import {NavLink, useNavigate} from 'react-router-dom'
import useAuthStore from "../context/useAuthStore.jsx"
import {useEffect} from "react";

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
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, handleSubmit }) => (
                <form className="auth-form-container" onSubmit={handleSubmit}>
                    <h1>LOGIN</h1>

                    <Field name="email">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="email"
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="email" component="div" className="error" />

                    <Field name="password">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Password"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="password" component="div" className="error" />
                    <p>You dont have an account? <NavLink to="/register">Create one!</NavLink></p>
                    <p>Did you forget your password? <NavLink to="/password-recovery">Click here</NavLink></p>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? '...' : 'Login'}
                    </Button>
                </form>
            )}
        </Formik>
    )
}

export default LoginForm