import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

const PasswordRecovery = () => {
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Llamada a la API para recuperar la contraseña
      const response = await axios.post('https://clinimood-mern-backend.onrender.com/users/recover/forgot-password', {
        email: values.email
      });

      // Si la solicitud es exitosa, mostramos un mensaje de éxito
      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirigir al usuario (por ejemplo, a la página de login)
        navigate('/login'); // Redirige a la página de login o la que desees
      });
    } catch (error) {
        console.log(values.email);
      // Si hay un error, mostramos un mensaje de error
      Swal.fire({
        title: 'Error!',
        text: error.response ? error.response.data.message : 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setSubmitting(false); // Siempre deshabilitar el estado de submitting al finalizar
    }
  };

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit} // Aquí manejamos la lógica de submit
    >
      {({ isSubmitting, handleSubmit }) => (
        <form
          className="auth-form-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e); // Pasar el evento correctamente a handleSubmit
          }}
        >
          <h1>Password Recovery</h1>
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
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? '...' : 'Send Recovery Link'}
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default PasswordRecovery;
