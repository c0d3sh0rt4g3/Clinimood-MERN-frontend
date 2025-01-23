import { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  isBefore,
  isToday,
} from "date-fns";
import "./AppointmentsHistorialPage.css";

const formatAppointmentDate = (date) => format(new Date(date), "yyyy-MM-dd");

const AppointmentForm = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://clinimood-mern-backend.onrender.com/appointments/40123726K");
        const result = await response.json();

        if (result.success) {
          setAppointments(result.data);
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
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const appointment = appointments.find(
      (appt) => formatAppointmentDate(appt.date) === date
    );
    setSelectedAppointment(appointment || null);
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
    
    <div className="appointment-form">
      <h2 className="appointment-form__title">Select a Date</h2>

      {loading && <p>Loading appointments...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="appointment-form__content">
          <div className="appointment-form__calendar-container">
            <div className="appointment-form__calendar-header">
              <button
                type="button"
                className="appointment-form__month-button"
                onClick={prevMonth}
              >
                &lt;
              </button>
              <h3>{format(currentMonth, "MMMM yyyy")}</h3>
              <button
                type="button"
                className="appointment-form__month-button"
                onClick={nextMonth}
              >
                &gt;
              </button>
            </div>

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
          </div>

          {!selectedAppointment && selectedDate && (
        <div className="appointment-form__appointment-details">
          <h3>No Appointments</h3>
          <p>No appointments found for {format(new Date(selectedDate), "MMMM dd, yyyy")}.</p>
          <button
            className="appointment-form__button appointment-form__button--new"
            onClick={() => (window.location.href = "/new-appointment")}
          >
            Get New Appointment
          </button>
        </div>
      )}
          {selectedAppointment && (
        <div className="appointment-form__appointment-details">
          <h3>Appointment Details</h3>
          <p>
            <strong>Doctor:</strong> {selectedAppointment.doctorDNI}
          </p>
          <p>
            <strong>Date:</strong> {format(new Date(selectedAppointment.date), "MMMM dd, yyyy")} at {" "}
            {format(new Date(selectedAppointment.date), "hh:mm a")}
          </p>
          <p>
            <strong>Description:</strong> {selectedAppointment.description}
          </p>
          <p>
            <strong>Status:</strong> {selectedAppointment.status}
          </p>
          
        </div>

      )}

      
        </div>
      )}

<div className="appointment-form__appointments-list">
          <h3>All Appointments</h3>
          <ul>
            {appointments.map((appt) => (
              <li
                key={appt._id}
                className={`appointment-form__appointment-item ${
                  selectedAppointment?._id === appt._id ? "appointment-form__appointment-item--selected" : ""
                }`}
                onClick={() => setSelectedAppointment(appt)}
              >
                {format(new Date(appt.date), "MMMM dd, yyyy hh:mm a")} - {appt.description}
              </li>
            ))}
          </ul>
        
      
      </div>
       

    </div>
  );
};

export default AppointmentForm;
