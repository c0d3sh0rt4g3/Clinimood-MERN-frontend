import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import Swal from "sweetalert2";
import "../../style/main.scss";
import useAuthStore from '../../context/useAuthStore';
import {
  fetchAppointments as fetchAppointmentsApi,
  fetchDoctorDetails as fetchDoctorDetailsApi,
  confirmAppointment as confirmAppointmentApi,
  cancelAppointment as cancelAppointmentApi,
} from '../../assets/apiService';

import {useNavigate} from "react-router-dom";



const formatAppointmentDate = (date) => format(new Date(date), "yyyy-MM-dd");

const AppointmentForm = () => {
  const { user } = useAuthStore(); 
  const dni = user ? user.DNI : '';
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState([]); 
  const [doctorDetails, setDoctorDetails] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorError, setDoctorError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const today = new Date();
  const navigate = useNavigate()

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const result = await fetchAppointmentsApi();
      if (result.success) {
        const patientAppointments = result.data.filter(appt => appt.patientDNI === dni);
        const sortedAppointments = patientAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(sortedAppointments);
      } else {
        setError("Failed to fetch appointments.");
      }
    } catch (err) {
      setError("An error occurred while fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect to home if not logged in
    if (!user) {
        navigate('/')
    }
    if (!dni) return;
    fetchAppointments();
  }, [dni]);

  useEffect(() => {
    if (appointments.length > 0) {
      const todayFormatted = formatAppointmentDate(today);
      setSelectedDate(todayFormatted);
      handleDateClick(todayFormatted);
    }
  }, [appointments]);
  
  useEffect(() => {
    if (selectedAppointments.length === 0) return;
  
    const fetchDoctorsDetails = async () => {

      setLoading(true);
      setDoctorDetails({});
      setDoctorError(null);
  
      try {
        const details = {};
        for (const appointment of selectedAppointments) {
          if (!appointment.doctorDNI) {
            console.error("Invalid doctorDNI:", appointment.doctorDNI);
            continue;
          }
  
          const result = await fetchDoctorDetailsApi(appointment.doctorDNI);
          if (result.success) {
            details[appointment.doctorDNI] = result.data;
          } else {
            setDoctorError(result.error || "Failed to fetch doctor details.");
          }
        }
        setDoctorDetails(details);
      } catch (err) {
        setDoctorError("An error occurred while fetching doctor details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctorsDetails();
  }, [selectedAppointments]);

  const confirmAppointment = async (appointmentId) => {
    setOperationLoading(true);
    setError(null);

    try {
      const appointmentToConfirm = selectedAppointments.find(
        (appt) => appt._id === appointmentId
      );
      const result = await confirmAppointmentApi(appointmentId, {
        ...appointmentToConfirm,
        status: "confirmed",
      });

      if (result.message && result.appointment) {
        const updatedAppointments = appointments.map((appt) =>
          appt._id === appointmentId ? result.appointment : appt
        );
        setAppointments(updatedAppointments);
        setSelectedAppointments((prev) =>
          prev.map((appt) => (appt._id === appointmentId ? result.appointment : appt))
        );
        Swal.fire({
          icon: 'success',
          title: 'Appointment Confirmed',
          text: 'Your appointment has been successfully confirmed.',
        });
      } else {
        throw new Error("Failed to confirm the appointment: Invalid server response.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while confirming the appointment.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || "An error occurred while confirming the appointment.",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setOperationLoading(true);
    setError(null);

    try {
      const result = await cancelAppointmentApi(appointmentId);
      if (result.success) {
        const updatedAppointments = appointments.filter(
          (appt) => appt._id !== appointmentId
        );
        setAppointments(updatedAppointments);
        setSelectedAppointments((prev) => prev.filter((appt) => appt._id !== appointmentId));
        Swal.fire({
          icon: 'success',
          title: 'Appointment Cancelled',
          text: 'Your appointment has been successfully cancelled.',
        });
      } else {
        setError("Failed to cancel the appointment.");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Failed to cancel the appointment.",
        });
      }
    } catch (err) {
      setError("An error occurred while canceling the appointment.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "An error occurred while canceling the appointment.",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const appointmentsForDate = appointments.filter(
      (appt) => formatAppointmentDate(appt.date) === date
    );
    setSelectedAppointments(appointmentsForDate);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderCalendar = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const daysInMonth = [];
    const emptyDays = [];

    let startDay = firstDayOfMonth.getDay();
    if (startDay === 0) startDay = 7;

    for (let i = 1; i < startDay; i++) {
      emptyDays.push(
        <div
          key={`empty-${i}`}
          className="appointment-form__calendar-day appointment-form__calendar-day--empty"
        ></div>
      );
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const formattedDate = format(date, "yyyy-MM-dd");
      const hasAppointment = appointments.some(
        (appt) => formatAppointmentDate(appt.date) === formattedDate
      );

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      daysInMonth.push(
        <div
          key={`day-${formattedDate}`}
          className={`appointment-form__calendar-day ${
            hasAppointment ? "appointment-form__calendar-day--has-appointment" : ""
          } ${
            selectedDate === formattedDate ? "appointment-form__calendar-day--selected" : ""
          } ${isWeekend ? "appointment-form__calendar-day--weekend" : ""}`}
          onClick={!isWeekend ? () => handleDateClick(formattedDate) : undefined}
          style={{ pointerEvents: isWeekend ? "none" : "auto" }}
        >
          {i}
        </div>
      );
    }

    return [...emptyDays, ...daysInMonth];
  };

  return (
    <section className="appointment-form">
      <header className="appointment-form__header">
      </header>

      {loading && <p>Loading appointments...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <article className="appointment-form__content">
          <section className="appointment-form__calendar-container">
            <header className="appointment-form__calendar-header">
              <button
                type="button"
                className="appointment-form__month-button"
                onClick={prevMonth}
              >
                &lt;
              </button>
              <h3 className="appointment-form__title">{format(currentMonth, "MMMM yyyy")}</h3>
              <button
                type="button"
                className="appointment-form__month-button"
                onClick={nextMonth}
              >
                &gt;
              </button>
            </header>

            <div className="appointment-form__calendar-grid">
              <div className="appointment-form__calendar-day-header">Mon</div>
              <div className="appointment-form__calendar-day-header">Tue</div>
              <div className="appointment-form__calendar-day-header">Wed</div>
              <div className="appointment-form__calendar-day-header">Thu</div>
              <div className="appointment-form__calendar-day-header">Fri</div>
              <div className="appointment-form__calendar-day-header">Sat</div>
              <div className="appointment-form__calendar-day-header">Sun</div>

              {renderCalendar()}
            </div>
          </section>

          {selectedAppointments.length === 0 && selectedDate && (
            <section className="appointment-form__appointment-details">
              <h3>No Appointments</h3>
              <p>No appointments found for {format(new Date(selectedDate), "MMMM dd, yyyy")}.</p>
              <Link
                to="/new-appointment"
                className="appointment-form__button appointment-form__button--default"
              >
                Get New Appointment
              </Link>
            </section>
          )}

          {selectedAppointments.length > 0 && (
            <section className="appointment-form__appointment-details">
              <h3>Appointments for {format(new Date(selectedDate), "MMMM dd, yyyy")}</h3>
              {selectedAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-form__appointment-item">
                  {doctorDetails[appointment.doctorDNI] ? (
                    <p>
                      <strong>Doctor:</strong>
                      {doctorDetails[appointment.doctorDNI].name}
                      {doctorDetails[appointment.doctorDNI].specialization ? `${doctorDetails[appointment.doctorDNI].specialization}` : ''}
                    </p>
                  ) : (
                    doctorError && <p className="error">{doctorError}</p>
                  )}
                  <p>
                    <strong>Date:</strong> {format(new Date(appointment.date), "MMMM dd, yyyy")} at{" "}
                    {format(new Date(appointment.date), "hh:mm a")}
                  </p>
                  <p>
                    <strong>Description:</strong> {appointment.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>

                  {appointment.status === "pending" && (
                    <footer className="appointment-form__actions">
                      <button
                        className="appointment-form__button appointment-form__button--confirm"
                        onClick={() => confirmAppointment(appointment._id)}
                        disabled={operationLoading}
                      >
                        {operationLoading ? "Confirming..." : "Confirm Appointment"}
                      </button>
                      <button
                        className="appointment-form__button appointment-form__button--cancel"
                        onClick={() => cancelAppointment(appointment._id)}
                        disabled={operationLoading}
                      >
                        {operationLoading ? "Canceling..." : "Cancel Appointment"}
                      </button>
                    </footer>
                  )}
                </div>
              ))}
            </section>
          )}
        </article>
      )}

      <section className="appointment-form__appointments-list">
        <h3>All Appointments</h3>
        <ul>
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className={`appointment-form__appointment-item ${
                selectedAppointments.some((a) => a._id === appt._id) ? "appointment-form__appointment-item--selected" : ""
              }`}
              onClick={() => setSelectedAppointments([appt])}
            >
              {format(new Date(appt.date), "MMMM dd, yyyy hh:mm a")} - {appt.description}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default AppointmentForm;