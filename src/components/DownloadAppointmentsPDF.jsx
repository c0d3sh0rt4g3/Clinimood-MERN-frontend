import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DownloadAppointmentsPDF = ({ appointments, patientDetails }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Doctor Appointments", 14, 10);

    const tableData = appointments.map((appt) => {
        const patientInfo = patientDetails[appt.patientDNI] || {};
        return [
          appt.date,
          appt.description,
          appt.status,
          patientInfo.name || "N/A",
          patientInfo.phone || "N/A",
        ];
      });
      

    autoTable(doc, {
      head: [["Date", "Description", "Status", "Patient Name", "Phone"]],
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
