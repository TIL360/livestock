import React, { useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FeePdf from '../Fee/Feepdf'; // Ensure the path is correct

export default function Invoicefee() {
  const [admNo, setAdmNo] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('');

  const handleSearch = async () => {
    if (!admNo) {
      setError('Please enter an admission number.');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/invoicefee/${admNo}`);
      if (!response.data.data || typeof response.data.data !== 'object') {
        setError('No invoices found');
        setInvoices([]);
      } else {
        setError('');
        setInvoices([response.data.data]); // Wrap it in an array
        console.log(response.data);
 

 
        const firstResult = response.data.data;
        setName(firstResult.name);
        setStandard(firstResult.FeeStandard);
    

      }
    } catch (err) {
      setError('Error fetching invoices. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div style={{ background: "white", padding: '20px', height: '100vh' }}>
      <h2 className='text-center'>Download Fee Invoice</h2>
      <br/>
      <div className='row'>
        <div className="col-md-6">
          <input type="text" className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" placeholder="Enter Admission Number" value={admNo} onChange={(e) => setAdmNo(e.target.value)} />
        </div>
        <div className='col-md-2'>
          <button className="btn btn-primary btn-sm mb-1 shadow p-2 rounded" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <br/>
      {error && <p className="text-danger">{error}</p>}
      <hr/>
      {invoices.length > 0 && (
        <div>
          <h3 className='text-center'>Details of {name}, Class: {standard}</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Month / Year</th>
                <th>Total Fee</th>
                <th>Total Arrears</th>
                <th>Monthly Fee / Arrears</th>
                <th>Adm Fee / Arrears</th>
                <th>Fine Fee / Arrears</th>
                <th>Exam Fee / Arrears</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.idf}>
                  <td>{invoice.fmonth} - {invoice.fyear}</td>
                  <td>Rs. {invoice.total_fee}</td>
                  <td>Rs. {invoice.total_arrears}</td>
                  <td>Rs. {invoice.monthly_fee_feetbl} / Rs. {invoice.arrears} </td>
                  <td>Rs. {invoice.adm_fee} / Rs. {invoice.adm_arrears} </td>
                  <td>Rs. {invoice.fine_fee} / Rs. {invoice.fine_arrears} </td>
                  <td>Rs. {invoice.exam_fee} / Rs. {invoice.exam_arrears} </td>
                  <td>{invoice.collection_by ? <button className='btn btn-success'>Fee Paid</button> : <button className='btn btn-danger'>Unpaid</button>}</td>
                  <td>
                    <PDFDownloadLink document={<FeePdf feeDetails={[invoice]} />} fileName={`fee_report_${invoice.idf}.pdf`}>
                      <button className="btn btn-warning">Download</button>
                    </PDFDownloadLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}