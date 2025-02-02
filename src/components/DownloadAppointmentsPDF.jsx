import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns"; // Import format and parseISO

/**
 * Component to download appointments in PDF format.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {Array} props.appointments - List of appointments with details.
 * @param {Object} props.patientDetails - A mapping of patient DNI to their details.
 *
 * @returns {JSX.Element} A button to download the PDF of appointments.
 */
const DownloadAppointmentsPDF = ({ appointments, patientDetails }) => {

  /**
   * Generates a PDF file containing the appointments and patient details.
   *
   * @function generatePDF
   * @description Creates a PDF document with the list of appointments and associated patient data.
   * The document includes the date, description, status, DNI, patient name, and phone number.
   * If any patient detail is missing, it will be displayed as "N/A".
   */
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title to the document
    doc.text("Doctor Appointments", 14, 10);

    // Prepare the table data by mapping through the appointments
    const tableData = appointments.map((appt) => {
      const patientInfo = patientDetails[appt.patientDNI] || {}; // Retrieve patient data by DNI, default to empty object
      return [
        format(parseISO(appt.date), "yyyy-MM-dd HH:mm"), // Format appointment date
        appt.description, // Appointment description
        appt.status, // Appointment status (e.g., confirmed, pending)
        patientInfo.DNI || "N/A", // Patient DNI, default to "N/A" if missing
        patientInfo.name || "N/A", // Patient name, default to "N/A" if missing
        patientInfo.phone || "N/A", // Patient phone number, default to "N/A" if missing
      ];
    });

    // Generate the table in the PDF document
    autoTable(doc, {
      head: [["Date", "Description", "Status", "DNI", "Patient Name", "Phone"]], // Table headers
      body: tableData, // Table body (appointments data)
      startY: 20, // Start table after title
    });

    // Save the generated PDF with a specified file name
    doc.save("appointments.pdf");
  };

  return (
      <button
          className="appointments__download-button"
          onClick={generatePDF}
          disabled={appointments.length === 0} // Disable button if no appointments are available
      >
        Download PDF
      </button>
  );
};

export default DownloadAppointmentsPDF;
