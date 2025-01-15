import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';

const validationSchema = Yup.object({
    DNI: Yup.string().required('Your DNI is required'),
    email: Yup.string().email('Email not valid').required('The email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const RegisterForm = () => {

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
            initialValues={{ DNI: '', email: '', phone: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <form className="auth-form-container">
                    <h1>REGISTER</h1>

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

                    <Field name="phone">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Phone Number"
                                variant="outlined"
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="phone" component="div" className="error" />

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

                    <Field name="confirmPassword">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Confirm Password"
                                variant="outlined"
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="confirmPassword" component="div" className="error" />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Sign up'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default RegisterForm;
