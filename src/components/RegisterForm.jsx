import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import useAuthStore from "../context/useAuthStore.jsx";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const loginUser = useAuthStore((state) => state.loginUser); // Usamos el hook de login
    const navigate = useNavigate(); // Para redirigir

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
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = { ...values, role: "patient" };
            const response = await axios.post('https://clinimood-mern-backend.onrender.com/users', payload);
            console.log('User signed up', response.data);

            // Después de registrar, hacemos login con los mismos datos
            const loginResult = await loginUser({
                email: values.email,
                password: values.password,
            })

            if (loginResult.success) {
                console.log('User logged in succesfully')
                alert('User signed up successfully')
                navigate('/')
            } else {
                alert('Error loggin in after registration')
            }
            resetForm()
        } catch (error) {
            console.log('Error signing up the user', error);
            alert('Error signing up the user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ DNI: '', name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, handleSubmit }) => (
                <form className="auth-form-container" onSubmit={handleSubmit}>
                    <h1>Registro</h1>

                    {/* Campo DNI */}
                    <Field name="DNI">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                label="DNI"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="DNI" component="div" className="error" />

                    {/* Campo Name */}
                    <Field name="name">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                label="Nombre"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="name" component="div" className="error" />

                    {/* Campo Email */}
                    <Field name="email">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="email"
                                label="Correo Electrónico"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="email" component="div" className="error" />

                    {/* Campo Password */}
                    <Field name="password">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Contraseña"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="password" component="div" className="error" />

                    {/* Campo Confirm Password */}
                    <Field name="confirmPassword">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Confirmar Contraseña"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    </Field>
                    <ErrorMessage name="confirmPassword" component="div" className="error" />

                    {/* Botón de envío */}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default RegisterForm;











