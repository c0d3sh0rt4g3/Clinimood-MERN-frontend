import React from "react";
import useAuthStore from "../context/useAuthStore";
import AppointmentsList from "../components/AppointmentsList";

const DoctorAppointmentsPage = () => {
  const { user } = useAuthStore();
  const doctorDNI = user ? user.DNI : "";

  return <AppointmentsList doctorDNI={doctorDNI} />;
};

export default DoctorAppointmentsPage;
