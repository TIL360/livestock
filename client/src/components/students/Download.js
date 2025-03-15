import React from 'react';
import { useLocation } from 'react-router-dom';

import { PDFDownloadLink } from '@react-pdf/renderer';
import StudentPdf from './FormPdf';

export default function Download() {
  const { state } = useLocation();
 
  const studentData = state?.studentData; // Get student data from location state

  if (!studentData) {
    return <div>Loading...</div>; // You can handle this case as needed
  }

  return (
    <div className='text-center'>
      <h1>Download Student Admission Form (PDF)</h1>
      <PDFDownloadLink 
        document={<StudentPdf student={studentData} />} 
        fileName={`student_${studentData.adm_no}.pdf`}>
        {({ loading }) => (loading ? 'Loading document...' : <button className="btn btn-primary">Download Admission Form (PDF)</button>)}
      </PDFDownloadLink>
    </div>
  );
}
