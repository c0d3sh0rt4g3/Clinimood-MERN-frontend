import { useState } from "react"
import { addMonths, subMonths, format, startOfMonth, endOfMonth } from "date-fns"
import "./AppointmentForm.css"


// Public holidays (customize as needed)
const HOLIDAYS = []

// Doctors and predefined schedules
//Modificar por lo que llegue por black-end
const DOCTORS = [
  { id: "dr-smith", name: "Dr. Smith - Cardiology" },
  { id: "dr-jones", name: "Dr. Jones - Pediatrics" },
  { id: "dr-brown", name: "Dr. Brown - Dermatology" },
]

// Generate predefined timeslots
//Modificar de lo que reciba por back-end
const generateTimes = () => {
  const times = []
  let current = 8 * 60 
  const end = 13 * 60 + 30 
  while (current <= end) {
    const hours = Math.floor(current / 60)
    const minutes = current % 60
    times.push(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    )
    current += 30
  }
  return times
}

const timeslots = generateTimes()

const AppointmentForm = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    date: "",
    doctor: "",
    time: "",
  })

  const isPastDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    // Establecer la hora en 00:00 para comparar solo la fecha sin la hora
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  }
  
  const [selectedDate, setSelectedDate] = useState("")

  const isHoliday = (date) => HOLIDAYS.includes(date)

  const isWeekend = (date) => {
    const dayOfWeek = new Date(date).getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  const handleDateClick = (date) => {
    if (!isHoliday(date) && !isWeekend(date)) {
      setSelectedDate(date)
      setFormData({ ...formData, date })
    }
  }

  const handleDoctorChange = (e) => {
    setFormData({ ...formData, doctor: e.target.value, time: "" })
  }

  const handleTimeChange = (e) => {
    setFormData({ ...formData, time: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.date || !formData.doctor || !formData.time) {
      alert("Please select a date, doctor, and time.")
      return
    }
    alert(`Appointment booked:\nDate: ${formData.date}\nDoctor: ${formData.doctor}\nTime: ${formData.time}`)
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const renderCalendar = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const daysInMonth = [];
    const emptyDays = [];
  
    let startDay = firstDayOfMonth.getDay();
    if (startDay === 0) startDay = 7; // Ajusta el domingo a la última columna
  
    // Añadir espacios vacíos antes del primer día del mes
    for (let i = 1; i < startDay; i++) {
      emptyDays.push(
        <div
          key={`empty-${i}`}
          className="appointment-form__calendar-day appointment-form__calendar-day--empty"
        ></div>
      );
    }
  
    // Añadir los días del mes
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const formattedDate = format(date, "yyyy-MM-dd");
      const isDisabled = isHoliday(formattedDate) || isWeekend(formattedDate) || isPastDate(formattedDate); // Agregar la validación para días pasados
  
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
          onClick={() => !isDisabled && handleDateClick(formattedDate)} // Deshabilitar selección si es pasado
        >
          {i}
        </div>
      );
    }
  
    return [...emptyDays, ...daysInMonth];
  }
  
  const isFormValid = formData.date && formData.doctor && formData.time

  return (
    <div className="appointment-form">
      <h2 className="appointment-form__title">Select date</h2>
      <form className="appointment-form__form" onSubmit={handleSubmit}>
        {/* Calendar */}
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
            <div className="appointment-form__calendar-day-header">Tues</div>
            <div className="appointment-form__calendar-day-header">Wed</div>
            <div className="appointment-form__calendar-day-header">Thur</div>
            <div className="appointment-form__calendar-day-header">Fri</div>
            {renderCalendar()}
          </div>
        </div>

        {/* Doctor selection */}
        <label htmlFor="doctor-select" className="appointment-form__label">
          Doctor
        </label>
        <select
          id="doctor-select"
          name="doctor"
          className="appointment-form__select"
          value={formData.doctor}
          onChange={handleDoctorChange}
          required
        >
          <option value="" disabled>
            Select...
          </option>
          {DOCTORS.map((doctor) => (
            <option key={doctor.id} value={doctor.name}>
              {doctor.name}
            </option>
          ))}
        </select>

        {/* Timeslot selection */}
        {formData.date && (
          <div className="appointment-form__timeslot-container">
            <h3>{new Date(formData.date).toLocaleDateString("en-US", { weekday: "long", day: "numeric" })}</h3>
            {timeslots.map((time, index) => (
              <button
                key={`time-${index}`}
                className={`appointment-form__timeslot ${
                  formData.time === time ? "appointment-form__timeslot--selected" : ""
                }`}
                type="button"
                onClick={() => handleTimeChange({ target: { value: time } })}
              >
                {time}
              </button>
            ))}
          </div>
        )}

        {/* Submit button */}
        
        <button
            type="submit"
            className={`appointment-form__button ${isFormValid ? "appointment-form__button--active" : ""}`}
            >
            Confirm
        </button>
      </form>
    </div>
  )
}

export default AppointmentForm
