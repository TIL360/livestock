import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StudentPdf from './FormPdf'; // Import the PDF component
import { useParams } from "react-router-dom";

export default function Download() {
      const { id } = useParams();
  const { token } = useContext(userContext);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/students/download/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, [id, token]);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-center'>
      <h1>Download Student PDF</h1>
      <PDFDownloadLink
        document={<StudentPdf student={studentData} />}
        fileName={`student_${studentData.adm_no}.pdf`}
      >
        {({ loading }) => (loading ? 'Loading document...' : <button className="btn btn-primary">Download Admission Form (PDF) </button>)}
      </PDFDownloadLink>
    </div>
  );
};


