import { useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import useAuthStore from '../../context/useAuthStore';
import useCreateAppointmentStore from '../../context/useCreateAppointmentStore'; // Importa el store
import "../../style/main.scss";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

const HOLIDAYS = [];

const generateTimes = () => {
  const times = [];
  let current = 8 * 60;
  const end = 13 * 60 + 30;
  while (current <= end) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    times.push(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    );
    current += 30;
  }
  return times;
};

const timeslots = generateTimes();

const AppointmentForm = () => {
  const { user } = useAuthStore();
  const patientDNI = user ? user.DNI : '';
  const navigate = useNavigate()

  const {
    currentMonth,
    formData,
    doctors,
    loadingDoctors,
    selectedDate,
    appointments,
    setCurrentMonth,
    setFormData,
    setSelectedDate,

    setPatientDNI, 

    loadData,
    handleSubmit,
  } = useCreateAppointmentStore();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: 'Error!',
        text: "Please log in to make an appointment.",
        icon: 'error',
        confirmButtonText: 'OK',
        didOpen: () => {
          document.querySelector('.swal2-popup').setAttribute('role', 'alert');
        }
      });
      
      navigate("/login")
    } else {

      setPatientDNI(patientDNI);

      loadData();
    }
  }, [user, patientDNI, loadData, setPatientDNI]);

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

  const handleTimeChange = (time) => {
    setFormData({ ...formData, time });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
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
      const isDisabled = isHoliday(formattedDate) || isWeekend(formattedDate) || isPastDate(formattedDate);

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
          onKeyDown={(e) => {
            if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
              handleDateClick(formattedDate);
            }
          }}
          tabIndex={isDisabled ? -1 : 0}
          role="button"
          aria-label={`Select ${formattedDate}`}
        >
          {i}
        </div>

      );
    }

    return [...emptyDays, ...daysInMonth];
  };

  const isFormValid =
    formData.date && formData.doctorDni && formData.time && formData.description;

  return (
    
    <div className="appointment-form">
      <h2 className="appointment-form__title">Book an Appointment</h2>
      <form className="appointment-form__form" onSubmit={(e) => handleSubmit(e, navigate)}>
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
          <p aria-live="polite">Loading doctors...</p>
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
            </h3>
            <div>
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
                      handleTimeChange(time)
                    }
                    disabled={isDisabled}
                  >
                    {time}
                  </button>
                );
              })}
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