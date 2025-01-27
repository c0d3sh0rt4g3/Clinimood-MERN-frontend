import { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import "../../style/main.scss"
import useAuthStore from "../../context/useAuthStore.jsx";
import {useNavigate} from "react-router-dom";
import "../../style/main.scss";

const HOLIDAYS = [];

const generateTimes = () => {
  const times = [];
  let current = 8 * 60;
  const end = 13 * 60 + 30;
  while (current <= end) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    times.push(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
    current += 30;
  }
  return times;
};


const timeslots = generateTimes();

const AppointmentForm = () => {
  const { user } = useAuthStore.getState(); 
  const patientDNI = user ? user.DNI : '';

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    date: "",
    doctorDni: "",
    time: "",
    description: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to home if not logged in
      if (!user) {
          navigate('/')
      }
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "https://clinimood-mern-backend.onrender.com/users/role/doctor"
        );
        const data = await response.json();
        if (data.success) {
          setDoctors(data.data);
        } else {
          console.error("Error fetching doctors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "https://clinimood-mern-backend.onrender.com/appointments"
        );
        const data = await response.json();
        if (data.success) {
          setAppointments(data.data);
        } else {
          console.error("Error fetching appointments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, []);

  const isPastDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };

  const isHoliday = (date) => HOLIDAYS.includes(date);

  const isWeekend = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isTimeSlotTaken = (date, time, doctorDni) => {
    return appointments.some(
      (appointment) =>
        appointment.doctorDNI === doctorDni &&
        appointment.date === `${date}T${time}:00.000Z`
    );
  };

  const handleDateClick = (date) => {
    if (!isHoliday(date) && !isWeekend(date)) {
      setSelectedDate(date);
      setFormData({ ...formData, date });
    }
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorDni = e.target.value;
    setFormData({ ...formData, doctorDni: selectedDoctorDni, time: "" });
  };

  const handleTimeChange = (e) => {
    setFormData({ ...formData, time: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const updateHistory = async () => {
    try {
      const response = await fetch(
        "https://clinimood-mern-backend.onrender.com/history/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientDNI })
        }
      );

      const data = await response.json();

      if (!data.success) {
        console.error("Error updating history:", data.message);
      } else {
        console.log("Patient history updated successfully.");
      }
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.date ||
      !formData.doctorDni ||
      !formData.time ||
      !formData.description
    ) {
      alert("Please complete all fields.");
      return;
    }

    const appointmentDate = `${formData.date}T${formData.time}`;
    const appointmentBody = {
      patientDNI, // Usamos el DNI del paciente
      doctorDNI: formData.doctorDni,
      date: appointmentDate,
      description: formData.description,
    };

    try {
      const response = await fetch(
        "https://clinimood-mern-backend.onrender.com/appointments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentBody),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert("Appointment created successfully!");
        await updateHistory();
        //window.location.href = "/history";
      } else {
        alert("Error creating appointment: " + data.message);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("An error occurred while creating the appointment.");
    }
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
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      const formattedDate = format(date, "yyyy-MM-dd");
      const isDisabled =
        isHoliday(formattedDate) ||
        isWeekend(formattedDate) ||
        isPastDate(formattedDate);

      daysInMonth.push(
        <div
          key={`day-${formattedDate}`}
          className={`appointment-form__calendar-day ${
            isDisabled ? "appointment-form__calendar-day--disabled" : ""
          } ${
            selectedDate === formattedDate
              ? "appointment-form__calendar-day--selected"
              : ""
          }`}
          onClick={() => !isDisabled && handleDateClick(formattedDate)}
        >
          {i}
        </div>
      );
    }

    return [...emptyDays, ...daysInMonth];
  };

  const isFormValid =
    formData.date && formData.doctorDni && formData.time && formData.description;

  if (!user) {
    // Si el usuario no está logueado, redirigir a la página de login
    alert("Please log in to make an appointment.");
    window.location.href = "/login";
  }

  return (
    <div className="appointment-form">
      <h2 className="appointment-form__title">Book an Appointment</h2>
      <form className="appointment-form__form" onSubmit={handleSubmit}>
        <div className="appointment-form__calendar-container">
          <div className="appointment-form__calendar-header">
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
          </div>
          <div className="appointment-form__calendar-grid">
            <div className="appointment-form__calendar-day-header">Mon</div>
            <div className="appointment-form__calendar-day-header">Tues</div>
            <div className="appointment-form__calendar-day-header">Wed</div>
            <div className="appointment-form__calendar-day-header">Thur</div>
            <div className="appointment-form__calendar-day-header">Fri</div>
            <div className="appointment-form__calendar-day-header">Sat</div>
            <div className="appointment-form__calendar-day-header">Sun</div>

            {renderCalendar()}
          </div>
        </div>

        <label htmlFor="doctor-select" className="appointment-form__title">
          Doctor
        </label>
        {loadingDoctors ? (
          <p>Loading doctors...</p>
        ) : (
          <select
            id="doctor-select"
            name="doctor"
            className="appointment-form__select"
            value={formData.doctorDni}
            onChange={handleDoctorChange}
            required
          >
            <option value="" disabled>
              Select...
            </option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor.DNI}>
                {doctor.name} - {doctor.role}
              </option>
            ))}
          </select>
        )}

        {formData.date && formData.doctorDni && (
          <div className="appointment-form__timeslot-container">
            <h3 className="appointment-form__title">
              {new Date(formData.date).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
              })}
            </h3><div>
            {timeslots.map((time, index) => {
              const isDisabled = isTimeSlotTaken(
                formData.date,
                time,
                formData.doctorDni
              );
              return (
                <button
                  key={`time-${index}`}
                  className={`appointment-form__timeslot ${
                    isDisabled
                      ? "appointment-form__timeslot--disabled"
                      : formData.time === time
                      ? "appointment-form__timeslot--selected"
                      : ""
                  }`}
                  type="button"
                  onClick={() =>
                    !isDisabled &&
                    handleTimeChange({ target: { value: time } })
                  }
                  disabled={isDisabled}
                >
                  {time}
                </button>
              );
            }
            )}
            </div>
          </div>
        )}

        <label htmlFor="description" className="appointment-form__title">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="appointment-form__textarea"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Describe the reason for your appointment"
          required
        ></textarea>

        <button
          type="submit"
          className={`appointment-form__button ${
            isFormValid ? "appointment-form__button--active" : ""
          }`}
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
