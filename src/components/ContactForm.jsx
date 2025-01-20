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
                <form className="contact-form-container">
                    <h1>Contact Us</h1>

                    <Field name="fullName">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Full Name"
                                variant="outlined"
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="fullName" component="div" className="error" />

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

                    <Field name="telephone">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Telephone Number"
                                variant="outlined"
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="telephone" component="div" className="error" />

                    <Field name="message">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Message"
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={4}
                            />
                        )}
                    </Field>
                    <ErrorMessage name="message" component="div" className="error" />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Send Message'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default ContactForm;
