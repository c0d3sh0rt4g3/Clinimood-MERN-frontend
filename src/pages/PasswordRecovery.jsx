import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';


const getValidationSchema = (isVerificationStep) =>
  Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    ...(isVerificationStep && {
      verificationCode: Yup.string().required('Verification code is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm your password'),
    }),
  });

const PasswordRecovery = () => {
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setValues }) => {
    try {
      if (isVerificationStep) {
        const response = await axios.post(
          'https://clinimood-mern-backend.onrender.com/users/recover/reset-password',
          {
            email: values.email,
            token: values.verificationCode,
            newPassword: values.password,
          }
        );
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => navigate('/login'));
      } else {
        const response = await axios.post(
          'https://clinimood-mern-backend.onrender.com/users/recover/forgot-password',
          { email: values.email }
        );

        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          setIsVerificationStep(true);
          setValues({ email: values.email, verificationCode: '', password: '', confirmPassword: '' });
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response ? error.response.data.message : 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="form-container recovery-page">
        <div className="form-box">
          <Formik
              initialValues={{ email: '', verificationCode: '', password: '', confirmPassword: '' }}
              validationSchema={getValidationSchema(isVerificationStep)}
              onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <h1>{isVerificationStep ? 'Reset Your Password' : 'Password Recovery'}</h1>

                  {!isVerificationStep && (
                      <>
                        <Field name="email">
                          {({ field }) => (
                              <TextField {...field} type="email" label="Email" variant="outlined" margin="normal" fullWidth className="input-field" />
                          )}
                        </Field>
                        <ErrorMessage name="email" component="div" className="error-message" />
                      </>
                  )}

                  {isVerificationStep && (
                      <>
                        <Field name="verificationCode">
                          {({ field }) => (
                              <TextField {...field} type="text" label="Verification Code" variant="outlined" margin="normal" fullWidth className="input-field" />
                          )}
                        </Field>
                        <ErrorMessage name="verificationCode" component="div" className="error-message" />

                        <Field name="password">
                          {({ field }) => (
                              <TextField {...field} type="password" label="New Password" variant="outlined" margin="normal" fullWidth className="input-field" />
                          )}
                        </Field>
                        <ErrorMessage name="password" component="div" className="error-message" />

                        <Field name="confirmPassword">
                          {({ field }) => (
                              <TextField {...field} type="password" label="Confirm Password" variant="outlined" margin="normal" fullWidth className="input-field" />
                          )}
                        </Field>
                        <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                      </>
                  )}

                  <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth className="form-button">
                    {isSubmitting ? '...' : isVerificationStep ? 'Reset Password' : 'Send Recovery Link'}
                  </Button>
                </form>
            )}
          </Formik>
        </div>
      </div>
  );
};

export default PasswordRecovery;
