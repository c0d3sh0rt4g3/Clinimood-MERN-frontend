//import React from 'react'

import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import { Error404 } from "../pages/Error404";
import { Home } from "../pages/home";
import { Calendar } from "../pages/Calendar";
import Login from "../pages/Login";
import Register from "../pages/Register";

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
        path: "calendar", 
        element: <Calendar />, 
      },
      {
        path: "calendar", 
        element: <Calendar />, 
      },
      {
        path: "calendar", 
        element: <Calendar />, 
      },

    ],
  },
])
