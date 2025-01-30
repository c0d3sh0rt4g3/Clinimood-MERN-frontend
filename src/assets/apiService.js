import axios from 'axios';

const API_BASE_URL = "https://clinimood-mern-backend.onrender.com";

export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/role/doctor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const fetchAppointments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/appointments/`, appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const updateMedicalHistory = async (patientDNI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/history/`, { patientDNI });
    return response.data;
  } catch (error) {
    console.error("Error updating history:", error);
    throw error;
  }
};

export const fetchAppointmentsDNI = async (dni) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments/${dni}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments by DNI:", error);
    throw error;
  }
};

export const fetchDoctorDetails = async (doctorDNI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${doctorDNI}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    throw error;
  }
};

export const confirmAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error canceling appointment:", error);
    throw error;
  }
};