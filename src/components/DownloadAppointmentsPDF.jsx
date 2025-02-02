import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns"; // Importa format y parseISO

const DownloadAppointmentsPDF = ({ appointments, patientDetails }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Doctor Appointments", 14, 10);

    // eslint-disable-next-line react/prop-types
    const tableData = appointments.map((appt) => {
      const patientInfo = patientDetails[appt.patientDNI] || {};
      return [
        format(parseISO(appt.date), "yyyy-MM-dd HH:mm"), // Formatea la fecha
        appt.description,
        appt.status,
        patientInfo.DNI || "N/A",
        patientInfo.name || "N/A",
        patientInfo.phone || "N/A",
        
      ];
    });

    autoTable(doc, {
      head: [["Date", "Description", "Status", "DNI", "Patient Name", "Phone"]],
      body: tableData,
      startY: 20,
    });

    doc.save("appointments.pdf");
  };

  return (
    <button
      className="appointments__download-button"
      onClick={generatePDF}
      disabled={appointments.length === 0}
    >
      Download PDF
    </button>
  );
};

export default DownloadAppointmentsPDF;