import React from 'react';
import Navbar from "../components/Navbar.jsx";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import AdminNavbar from "../components/AdminNavbar.jsx";

const PrivateLayout = () => {
    return (
        <>
            <AdminNavbar/>
            <Outlet/>
            <Footer/>
        </>
    );
};

export default PrivateLayout;