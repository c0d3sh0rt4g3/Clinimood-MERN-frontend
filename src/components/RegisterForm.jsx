import { Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { TextField, Button } from '@mui/material'
import axios from 'axios'
import useAuthStore from "../context/useAuthStore.jsx"
import {NavLink, useNavigate} from "react-router-dom"
import {useEffect} from "react"
import Swal from "sweetalert2";

const RegisterForm = () => {
    const loginUser = useAuthStore((state) => state.loginUser)
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const validationSchema = Yup.object({
        DNI: Yup.string()
            .min(8, 'DNI must have at least 8 digits')
            .required('DNI is required'),
        name: Yup.string()
            .min(3, 'Name must have at least 3 digits')
            .required('Name is required'),
        email: Yup.string()
            .email('Email is not valid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must have at least 6 characters long')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('You must confirm your password'),
    })
    useEffect(() => {
        // Redirect to home if logged in
        if (user) {
            navigate('/')
        }
    }, [navigate])

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = { ...values, role: "patient" }
            const response = await axios.post('https://clinimood-mern-backend.onrender.com/users', payload)
            console.log('User signed up', response.data)

            const loginResult = await loginUser({
                email: values.email,
                password: values.password,
            })

            if (loginResult.success) {
                Swal.fire({
                  title: 'Success!',
                  text: 'User signed up successfully',
                  icon: 'success',
                  confirmButtonText: 'OK',
                })
                navigate('/')
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Error loggin in after registration',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
            resetForm()
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Error signing up the user',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={{ DNI: '', name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, handleSubmit }) => (
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-box">
                        <h1>SIGN UP</h1>

                        <Field name="DNI">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    type="text"
                                    label="DNI"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    className="input-field"
                                />
                            )}
                        </Field>
                        <ErrorMessage name="DNI" component="div" className="error-message" />

                        <Field name="name">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    type="text"
                                    label="Name"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    className="input-field"
                                />
                            )}
                        </Field>
                        <ErrorMessage name="name" component="div" className="error-message" />

                        <Field name="email">
                            {({ field }) => (
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

                        <Field name="confirmPassword">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    type="password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    className="input-field"
                                />
                            )}
                        </Field>
                        <ErrorMessage name="confirmPassword" component="div" className="error-message" />

                        <p className="form-links"> Have already an account? <NavLink to="/login">Login!</NavLink></p>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            fullWidth
                            className="form-button"
                        >
                            {isSubmitting ? 'Signing up' : 'Sign Up'}
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    )
}

export default RegisterForm











