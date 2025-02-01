import React, { useEffect, useState } from "react";
import { fetchPatients } from "../assets/apiService"; 

import "../style/main.scss";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPatients(); 
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="patients-container">
      <h1 className="patients-title">List of Patients</h1>

      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length > 0 ? (
        <div className="patients-grid">
          {patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <h2>{patient.name}</h2>
              <p><strong>DNI:</strong> {patient.DNI}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              {patient.phone && <p><strong>Phone:</strong> {patient.phone}</p>}
              {patient.address && <p><strong>Address:</strong> {patient.address}</p>}
              <p className="patient-date">
                Registered: {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};

export default PatientsList;
