import { create } from 'zustand';
import Swal from 'sweetalert2';
import {
  fetchDoctors as fetchDoctorsApi,
  fetchAppointments as fetchAppointmentsApi,
  createAppointment as createAppointmentApi,
  updateMedicalHistory as updateMedicalHistoryApi,
} from '../assets/apiService';

/**
 * Zustand store for managing appointment creation.
 * Handles fetching doctors, appointments, form data management, and appointment creation.
 */
const useCreateAppointmentStore = create((set, get) => ({
  // State variables
  currentMonth: new Date(),
  formData: {
    date: "",
    doctorDni: "",
    time: "",
    description: "",
  },
  doctors: [],
  loadingDoctors: true,
  selectedDate: "",
  appointments: [],
  patientDNI: "",

  // Actions to update state
  /**
   * Sets the current month for appointment scheduling.
   * @param {Date} date - The new month to set.
   */
  setCurrentMonth: (date) => set({ currentMonth: date }),

  /**
   * Updates the form data for appointment creation.
   * @param {Object} data - The form data object.
   */
  setFormData: (data) => set({ formData: data }),

  /**
   * Updates the list of available doctors.
   * @param {Array} doctors - List of doctors.
   */
  setDoctors: (doctors) => set({ doctors }),

  /**
   * Sets the loading state for fetching doctors.
   * @param {boolean} loading - Whether the doctors are being loaded.
   */
  setLoadingDoctors: (loading) => set({ loadingDoctors: loading }),

  /**
   * Sets the selected date for the appointment.
   * @param {string} date - The selected date.
   */
  setSelectedDate: (date) => set({ selectedDate: date }),

  /**
   * Updates the list of existing appointments.
   * @param {Array} appointments - List of appointments.
   */
  setAppointments: (appointments) => set({ appointments }),

  /**
   * Updates the patient's DNI (identification number).
   * @param {string} dni - The patient's DNI.
   */
  setPatientDNI: (dni) => set({ patientDNI: dni }),

  // Fetch doctors and appointments
  /**
   * Fetches doctors and appointments data from the API.
   * Updates the store with the retrieved data.
   * Handles errors and loading state.
   * @async
   */
  loadData: async () => {
    set({ loadingDoctors: true });
    try {
      const doctorsData = await fetchDoctorsApi();
      const appointmentsData = await fetchAppointmentsApi();

      if (doctorsData.success) {
        set({ doctors: doctorsData.data });
      } else {
        console.error("Error fetching doctors:", doctorsData.message);
      }

      if (appointmentsData.success) {
        set({ appointments: appointmentsData.data });
      } else {
        console.error("Error fetching appointments:", appointmentsData.message);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      set({ loadingDoctors: false });
    }
  },

  // Handle form submission
  /**
   * Handles the appointment form submission.
   * Validates form fields, confirms submission, and sends the appointment request.
   * @param {Event} e - Form submit event.
   * @async
   */
  handleSubmit: async (e) => {
    e.preventDefault();
    const { formData, patientDNI } = get(); // Get patientDNI from state

    // Validate form fields
    if (!formData.date || !formData.doctorDni || !formData.time || !formData.description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please complete all fields.",
      });
      return;
    }

    const appointmentDate = `${formData.date}T${formData.time}`;
    const appointmentBody = {
      patientDNI, // Use patientDNI from state
      doctorDNI: formData.doctorDni,
      date: appointmentDate,
      description: formData.description,
    };

    try {
      // Confirm appointment creation
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to confirm this appointment?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        const appointmentResponse = await createAppointmentApi(appointmentBody);

        if (appointmentResponse.message === "Medical appointment made successfully") {
          await updateMedicalHistoryApi(patientDNI);
          Swal.fire({
            icon: "success",
            title: "Appointment created!",
            text: "Your appointment has been successfully scheduled.",
          });
          setTimeout(() => {
            window.location.href = "/history";
          }, 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: appointmentResponse.message,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the appointment.",
      });
      console.error("Error creating appointment:", error);
    }
  },
}));

export default useCreateAppointmentStore;
