import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { Form } from 'react-router-dom';

const validationSchema = Yup.object({
    DNI: Yup.string().required('Your DNI is required'),
    email: Yup.string().email('Email not valid').required('The email is required'),
    password: Yup.string().required('Password is required'),
});

const LoginForm = () => {

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log(values);
        } catch (err) {
            console.log(err);
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ DNI: '', email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="auth-form-container">
                    <h1>LOGIN</h1>

                    <Field name="DNI">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="DNI"
                                variant="outlined"
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="DNI" component="div" className="error" />

                    <Field name="email">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="email"
                                label="Email"
                                variant="outlined"
                                margin="normal"
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
                            />
                        )}
                    </Field>
                    <ErrorMessage name="password" component="div" className="error" />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Initializing...' : 'Login'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
