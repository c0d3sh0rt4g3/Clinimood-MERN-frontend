import React, { useState, useEffect } from "react";
import { format, parseISO, isSameDay, isWithinInterval } from "date-fns";
import { fetchAppointmentsDNI, fetchDoctorDetails, updateAppointment } from "../assets/apiService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import "../style/main.scss";
import DownloadAppointmentsPDF from "./DownloadAppointmentsPDF";

/**
 * Component that displays and manages the list of doctor appointments.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.doctorDNI - The DNI of the doctor to fetch appointments for.
 *
 * @returns {JSX.Element} The Appointments List component.
 */
const AppointmentsList = ({ doctorDNI }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [patientDetails, setPatientDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /**
   * Fetches appointments from the API and patient details based on doctor DNI.
   *
   * @function fetchAppointments
   * @description Fetches the doctor's appointments and patient details asynchronously.
   * If fetching is successful, stores the data in state.
   */
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

          const patientDNIs = response.data.map((appt) => appt.patientDNI);
          const uniquePatientDNIs = [...new Set(patientDNIs)];

          const details = {};
          for (const dni of uniquePatientDNIs) {
            try {
              const patientResponse = await fetchDoctorDetails(dni);
              if (patientResponse) {
                details[dni] = patientResponse.data;
              }
            } catch (err) {
              console.error(`Error fetching details for patient ${dni}:`, err);
            }
          }

          setPatientDetails(details);
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

  /**
   * Filters appointments by their status (e.g., pending, confirmed, completed).
   *
   * @function filterByStatus
   * @description Filters the list of appointments based on the selected status filter.
   */
  useEffect(() => {
    const filterByStatus = () => {
      let filtered = appointments;
      if (statusFilter !== "all") {
        filtered = appointments.filter(appt => appt.status === statusFilter);
      }
      setFilteredAppointments(filtered);
    };

    filterByStatus();
  }, [appointments, statusFilter]);

  /**
   * Filters appointments by a selected date.
   *
   * @function filterByDate
   * @param {Date} date - The selected date to filter appointments by.
   * @description Filters the appointments list to show only those that occur on the selected date.
   */
  const filterByDate = (date) => {
    if (!date) return;
    const filtered = appointments.filter((appt) => isSameDay(parseISO(appt.date), date));
    setFilteredAppointments(filtered);
  };

  /**
   * Filters appointments by a date range.
   *
   * @function filterByDateRange
   * @param {Date} start - The start date of the range.
   * @param {Date} end - The end date of the range.
   * @description Filters the appointments list to show only those that fall within the selected date range.
   */
  const filterByDateRange = (start, end) => {
    if (!start || !end) return;
    const filtered = appointments.filter((appt) =>
        isWithinInterval(parseISO(appt.date), { start, end })
    );
    setFilteredAppointments(filtered);
  };

  /**
   * Handles the update of an appointment's description and status.
   *
   * @function handleUpdate
   * @param {string} apptId - The unique identifier of the appointment to update.
   * @param {string} updatedDescription - The updated description for the appointment.
   * @description Updates the appointment with a new description and sets its status to "completed".
   */
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

        {/* Filter by Date */}
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

        {/* Filter by Date Range */}
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

        {/* Filter by Status */}
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
                        <p><strong>Date:</strong> {format(parseISO(appt.date), "yyyy-MM-dd")}</p>
                        <p><strong>Hour:</strong> {format(parseISO(appt.date), "HH:mm")}</p>

                        {/* Display patient details */}
                        {patientDetails[appt.patientDNI] ? (
                            <div>
                              <p><strong>DNI:</strong> {patientDetails[appt.patientDNI].DNI}</p>
                              <p><strong>Name:</strong> {patientDetails[appt.patientDNI].name}</p>
                              {patientDetails[appt.patientDNI].phone && (
                                  <p><strong>Phone:</strong> {patientDetails[appt.patientDNI].phone}</p>
                              )}
                              {patientDetails[appt.patientDNI].address && (
                                  <p><strong>Address:</strong> {patientDetails[appt.patientDNI].address}</p>
                              )}
                            </div>
                        ) : (
                            <p>Loading patient details...</p>
                        )}

                        {/* Description input */}
                        <label>
                          <strong>Description:</strong>
                          <input
                              className="appointments__item-description-input"
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

                        {/* Status display */}
                        <p>
                          <strong>Status:</strong>
                          <span className={`appointments__item-status appointments__item-status--${appt.status}`}>
                    {appt.status}
                  </span>
                        </p>

                        {/* Confirm & Complete button */}
                        <button
                            className="appointments__item-button appointments__item-button--confirm"
                            onClick={() => handleUpdate(appt._id, appt.description)}
                        >
                          Confirm & Complete
                        </button>
                      </li>
                  ))
              ) : (
                  <p>No appointments found.</p>
              )}
            </ul>
        )}

        {/* PDF download component */}
        <DownloadAppointmentsPDF
            appointments={filteredAppointments}
            patientDetails={patientDetails}
        />
      </div>
  );
};

export default AppointmentsList;
