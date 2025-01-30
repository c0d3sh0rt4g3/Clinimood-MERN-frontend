import React, { useState, useEffect } from "react";
import { format, parseISO, isSameDay, isWithinInterval } from "date-fns";
import { fetchAppointmentsDNI, fetchDoctorDetails, updateAppointment } from "../assets/apiService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import "../style/main.scss";
import DownloadAppointmentsPDF from "./DownloadAppointmentsPDF"; // Ajusta la ruta según tu estructura


const AppointmentsList = ({ doctorDNI }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [patientDetails, setPatientDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Nuevo estado para el filtro de estado

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorDNI) return;
      setLoading(true);
      setError("");

      try {
        const response = await fetchAppointmentsDNI(doctorDNI);
        if (response.success) {
          setAppointments(response.data);
          setFilteredAppointments(response.data);
        } else {
          setError("Failed to fetch appointments.");
        }
      } catch (err) {
        setError("An error occurred while fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorDNI]);

  useEffect(() => {
    // Filtrar las citas por estado
    const filterByStatus = () => {
      let filtered = appointments;
      if (statusFilter !== "all") {
        filtered = appointments.filter(appt => appt.status === statusFilter);
      }
      setFilteredAppointments(filtered);
    };

    filterByStatus();
  }, [appointments, statusFilter]);

  const fetchPatientInfo = async (patientDNI) => {
    if (patientDetails[patientDNI]) return;

    try {
      const response = await fetchDoctorDetails(patientDNI);
      if (response) {
        setPatientDetails((prev) => ({ ...prev, [patientDNI]: response.data }));
      }
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const filterByDate = (date) => {
    if (!date) return;
    const filtered = appointments.filter((appt) => isSameDay(parseISO(appt.date), date));
    setFilteredAppointments(filtered);
  };

  const filterByDateRange = (start, end) => {
    if (!start || !end) return;
    const filtered = appointments.filter((appt) =>
      isWithinInterval(parseISO(appt.date), { start, end })
    );
    setFilteredAppointments(filtered);
  };

  const handleUpdate = async (apptId, updatedDescription) => {
    const updatedData = {
      ...appointments.find((appt) => appt._id === apptId),
      description: updatedDescription,
      status: "completed",
    };

    const result = await updateAppointment(apptId, updatedData);
    if (result) {
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === apptId ? { ...appt, ...updatedData } : appt))
      );
      // Mostrar el mensaje de éxito con SweetAlert2
      Swal.fire({
        title: 'Appointment Updated!',
        text: 'The appointment description has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="appointments">
      <h1 className="appointments__header">Doctor Appointments</h1>

      <div className="appointments__filters">
        <h2>Filter by Date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            filterByDate(date);
          }}
          dateFormat="yyyy-MM-dd"
          className="appointments__filters-input"
          placeholderText="Select a date"
        />
      </div>

      <div className="appointments__filters">
        <h2>Filter by Date Range</h2>
        <DatePicker
          selectsRange={true}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={(update) => {
            setDateRange(update);
            if (update[0] && update[1]) {
              filterByDateRange(update[0], update[1]);
            }
          }}
          dateFormat="yyyy-MM-dd"
          className="appointments__filters-input"
          placeholderText="Select a date range"
        />
      </div>

      {/* Filtro de estado */}
      <div className="appointments__filters">
        <h2>Filter by Status</h2>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="appointments__filters-input"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul className="appointments__list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <li key={appt._id} className="appointments__item">
                <h3 className="appointments__item-title">Appointment Details</h3>
                <p><strong>Date:</strong> {format(parseISO(appt.date), "yyyy-MM-dd HH:mm")}</p>

                <label>
                  <strong>Description:</strong>
                  <input
                    type="text"
                    value={appt.description}
                    onChange={(e) => {
                      setAppointments((prev) =>
                        prev.map((item) =>
                          item._id === appt._id ? { ...item, description: e.target.value } : item
                        )
                      );
                    }}
                  />
                </label>

                <p><strong>Status:</strong> {appt.status}</p>

                <button onClick={() => handleUpdate(appt._id, appt.description)}>
                  Confirm & Complete
                </button>

                {patientDetails[appt.patientDNI] ? (
                  <div>
                    <p><strong>Name:</strong> {patientDetails[appt.patientDNI].name}</p>
                    {patientDetails[appt.patientDNI].phone && (
                      <p><strong>Phone:</strong> {patientDetails[appt.patientDNI].phone}</p>
                    )}
                  </div>
                ) : (
                  <button onClick={() => fetchPatientInfo(appt.patientDNI)}>
                    Load Patient Details
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </ul>
        
      )}
  <DownloadAppointmentsPDF className="appointments__download-button" appointments={filteredAppointments} />
  </div>
  );
};

export default AppointmentsList;
