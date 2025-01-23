import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../context/useAuthStore.jsx";

const validationSchema = Yup.object({
    email: Yup.string().email('Email not valid').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
    const loginUser = useAuthStore((state) => state.loginUser);
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        const result = await loginUser(values);

        if (result.success) {
            console.log("Succesful");
            navigate('/');
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
    );
};

export default LoginForm;







