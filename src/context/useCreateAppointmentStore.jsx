import { create } from 'zustand';
import Swal from 'sweetalert2';
import {
  fetchDoctors as fetchDoctorsApi,
  fetchAppointments as fetchAppointmentsApi,
  createAppointment as createAppointmentApi,
  updateMedicalHistory as updateMedicalHistoryApi,
} from '../assets/apiService';

const useCreateAppointmentStore = create((set, get) => ({
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

  setCurrentMonth: (date) => set({ currentMonth: date }),
  setFormData: (data) => set({ formData: data }),
  setDoctors: (doctors) => set({ doctors }),
  setLoadingDoctors: (loading) => set({ loadingDoctors: loading }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setAppointments: (appointments) => set({ appointments }),
  setPatientDNI: (dni) => set({ patientDNI: dni }),

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

  handleSubmit: async (e, navigate) => {
    e.preventDefault();
    const { formData, patientDNI } = get();

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
      patientDNI,
      doctorDNI: formData.doctorDni,
      date: appointmentDate,
      description: formData.description,
    };

    try {
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
            navigate("/history");
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
