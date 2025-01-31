import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';

const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    telephone: Yup.string()
        .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
        .required('Telephone number is required'),
    message: Yup.string()
        .min(10, 'Message must be at least 10 characters long')
        .required('Message is required'),
});

const ContactForm = () => {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            console.log('Form Submitted:', values);
            resetForm();
        } catch (err) {
            console.log('Submission Error:', err);
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ fullName: '', email: '', telephone: '', message: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <form className="form-container">
                    <div className="form-box">
                        <h1>Contact Us</h1>

                        <Field name="fullName">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    label="Full Name"
                                    variant="outlined"
                                    margin="normal"
                                    className="input-field"
                                    fullWidth
                                />
                            )}
                        </Field>
                        <ErrorMessage name="fullName" component="div" className="error-message" />

                        <Field name="email">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    type="email"
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    className="input-field"
                                    fullWidth
                                />
                            )}
                        </Field>
                        <ErrorMessage name="email" component="div" className="error-message" />

                        <Field name="telephone">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    label="Telephone Number"
                                    variant="outlined"
                                    margin="normal"
                                    className="input-field"
                                    fullWidth
                                />
                            )}
                        </Field>
                        <ErrorMessage name="telephone" component="div" className="error-message" />

                        <Field name="message">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    label="Message"
                                    variant="outlined"
                                    margin="normal"
                                    multiline
                                    rows={6}
                                    className="input-field"
                                    fullWidth
                                />
                            )}
                        </Field>
                        <ErrorMessage name="message" component="div" className="error-message" />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            className="form-button"
                            fullWidth
                        >
                            {isSubmitting ? 'Submitting...' : 'Send Message'}
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default ContactForm;
