import { useState } from "react";
import { addMonths, subMonths, format, startOfMonth, endOfMonth, isBefore, isToday } from "date-fns";
import "./AppointmentsHistorialPage.css";

const appointments = [
  {
    id: 1,
    patient: "user-id-1",
    doctor: "dr-smith",
    date: "2024-12-05T09:00:00",
    description: "Consultation for chest pain",
    status: "Pending",
  },
  {
    id: 2,
    patient: "user-id-1",
    doctor: "dr-jones",
    date: "2025-01-20T10:30:00",
    description: "Pediatric check-up",
    status: "Confirmed",
  },
  {
    id: 3,
    patient: "user-id-1",
    doctor: "dr-brown",
    date: "2025-02-05T14:00:00",
    description: "Skin check-up",
    status: "Pending",
  },
];

const formatAppointmentDate = (date) => format(new Date(date), "yyyy-MM-dd");

const AppointmentForm = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const today = new Date();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const appointment = appointments.find((appt) => formatAppointmentDate(appt.date) === date);
    setSelectedAppointment(appointment || null);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleConfirmAppointment = (id) => {
    alert("Appointment confirmed!");
    const index = appointments.findIndex((appt) => appt.id === id);
    if (index !== -1) {
      appointments[index].status = "Confirmed";
      setSelectedAppointment({ ...appointments[index] });
    }
  };

  const handleMarkAsPending = (id) => {
    alert("Appointment marked as pending.");
    const index = appointments.findIndex((appt) => appt.id === id);
    if (index !== -1) {
      appointments[index].status = "Pending";
      setSelectedAppointment({ ...appointments[index] });
    }
  };

  const handleCancelAppointment = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (confirmCancel) {
      alert("Appointment canceled!");
      const index = appointments.findIndex((appt) => appt.id === id);
      if (index !== -1) {
        appointments.splice(index, 1);
        setSelectedAppointment(null);
      }
    }
  };

  const handleNewAppointment = () => {
    window.location.href = "/new-appointment";
  };

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
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      daysInMonth.push(
        <div
          key={`day-${formattedDate}`}
          className={`appointment-form__calendar-day ${
            hasAppointment ? "appointment-form__calendar-day--has-appointment" : ""
          } ${
            selectedDate === formattedDate ? "appointment-form__calendar-day--selected" : ""
          }`}
          onClick={() => handleDateClick(formattedDate)}
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

      <div className="appointment-form__calendar-container">
        <div className="appointment-form__calendar-header">
          <button type="button" className="appointment-form__month-button" onClick={prevMonth}>
            &lt;
          </button>
          <h3>{format(currentMonth, "MMMM yyyy")}</h3>
          <button type="button" className="appointment-form__month-button" onClick={nextMonth}>
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
          <div className="appointment-form__calendar-day-header">San</div>

          {renderCalendar()}
        </div>
      </div>

      {selectedAppointment && (
        <div className="appointment-form__appointment-details">
          <h3>Appointment Details</h3>
          <p>
            <strong>Doctor:</strong> {selectedAppointment.doctor}
          </p>
          <p>
            <strong>Date:</strong> {format(new Date(selectedAppointment.date), "MMMM dd, yyyy")} at{" "}
            {format(new Date(selectedAppointment.date), "hh:mm a")}
          </p>
          <p>
            <strong>Description:</strong> {selectedAppointment.description}
          </p>
          <p>
            <strong>Status:</strong> {selectedAppointment.status}
          </p>
          {isBefore(new Date(selectedAppointment.date), today) || isToday(new Date(selectedAppointment.date)) ? (
            <p className="appointment-form__message">
              This appointment is part of the history and cannot be modified.
            </p>
          ) : (
            <>
              {selectedAppointment.status === "Pending" && (
                <button
                  className="appointment-form__button appointment-form__button--confirm"
                  onClick={() => handleConfirmAppointment(selectedAppointment.id)}
                >
                  Confirm
                </button>
              )}
              {selectedAppointment.status === "Confirmed" && (
                <button
                  className="appointment-form__button appointment-form__button--pending"
                  onClick={() => handleMarkAsPending(selectedAppointment.id)}
                >
                  Mark as Pending
                </button>
              )}
              <button
                className="appointment-form__button appointment-form__button--cancel"
                onClick={() => handleCancelAppointment(selectedAppointment.id)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      {!selectedAppointment && selectedDate && (
        <div className="appointment-form__appointment-details">
          <h3>No Appointments</h3>
          <p>No appointments found for {format(new Date(selectedDate), "MMMM dd, yyyy")}.</p>
          {!isBefore(new Date(selectedDate), today) && (
            <button
              className="appointment-form__button appointment-form__button--new"
              onClick={handleNewAppointment}
            >
              Get New Appointment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
