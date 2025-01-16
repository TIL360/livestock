import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function SearchedInvoice() {
  const { admNo } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/feepay/${admNo}`);
        console.log(response.data);
        if (response.data.success && response.data.data.length > 0) {
          setInvoiceData(response.data.data[0]);
        } else {
          setError(new Error(response.data.message || "No data found"));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [admNo]);

  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
        const response = await axios.post('http://localhost:3000/payment.php', {
            phone,
            cnic,
            // Make sure to include other necessary data such as invoice ID if needed
        });

        if (response.data.success) {
            setSuccessMessage('Payment successful!'); // Show success message
        } else {
            setPaymentError('Payment failed: ' + response.data.message);
        }
    } catch (err) {
        setPaymentError('Payment failed: ' + err.message);
    }
};


  if (loading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h2>Invoice Details for Admission No: {admNo}</h2>
      {invoiceData ? (
        <div>
          <table>
            <tbody>
              <tr>
                <td>Invoice No</td>
                <td>{invoiceData.idf}</td>
              </tr>
              <tr>
                <td>Adm No</td>
                <td>{invoiceData.fee_adm_no}</td>
              </tr>
              <tr>
                <td>Year</td>
                <td>{invoiceData.fyear}</td>
              </tr>
              <tr>
                <td>Monthly Fee</td>
                <td>{invoiceData.monthly_fee}</td>
              </tr>
              <tr>
                <td>Total Fee</td>
                <td>{invoiceData.total_fee}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>No invoice found for this admission number.</div>
      )}

      <div>
        <h4>Payment Through Mobile</h4>
        <form onSubmit={handlePayment}>
          <div>
            <input
              placeholder='Enter your mobile number'
              type='text'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder='Last six digits of CNIC'
              type='text'
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              required
            />
          </div>
          <button className='btn btn-success'>Pay Invoice</button>
        </form>
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
      </div>
    </div>
  );
}
