import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { TextField, Button } from '@mui/material'
import {NavLink, useNavigate} from 'react-router-dom'
import useAuthStore from "../context/useAuthStore.jsx"
import {useEffect} from "react";
import "../style/components/Forms.scss"

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
        <div className="form-container login-page"> {/* Contenedor principal con estilos generales */}
            <div className="form-box"> {/* Caja con sombras, padding y animación */}
                <h1>LOGIN</h1>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="input-field"> {/* Aplicando estilos a los inputs */}
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
                                <ErrorMessage name="email" component="div" className="error-message" />
                            </div>

                            <div className="input-field">
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
                                <ErrorMessage name="password" component="div" className="error-message" />
                            </div>

                            <p className="form-links">
                                You don´t have an account? <NavLink to="/register">Create one!</NavLink>
                            </p>
                            <p className="form-links">
                                Did you forget your password? <NavLink to="/password-recovery">Click here</NavLink>
                            </p>

                            <Button
                                type="submit"
                                className="form-button"
                                variant="contained"
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting ? '...' : 'Login'}
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default LoginForm