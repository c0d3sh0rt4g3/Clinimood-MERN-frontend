//import React from 'react'

import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import  Error404 from "../pages/Error404";
import Home  from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PatientNewAppointments from "../pages/patient/PatientNewAppointments.jsx";
import PatientMedicalHistory from "../pages/patient/PatientMedicalHistory.jsx";
import Doctors from "../pages/Doctors.jsx";
import PrivateLayout from "../layouts/PrivateLayout.jsx";
import Admin from "../pages/Admin.jsx";
import ContactForm from "../components/ContactForm.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login", 
        element: <Login />, 
      },
      {
        path: "register", 
        element: <Register />, 
      },
      {
        path: "new-appointment", 
        element: <PatientNewAppointments />, 
      },
      {
        path: "history", 
        element: <PatientMedicalHistory />, 
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "doctors",
        element: <Doctors/>
      },
      {
        path: "contact",
        element: <ContactForm />,
      }
    ],
  },
  {
    path: "/admin",
    element: <PrivateLayout/>,
    errorElement: <Error404/>,
    children: [
      {
        index: true,
        element: <Admin/>
      }
    ]
  }
])
