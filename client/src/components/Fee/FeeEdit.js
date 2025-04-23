import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

const FeeEdit = () => {
  const navigate = useNavigate();
  const { token } = useContext(userContext);
  const { idf } = useParams();
  const [feedetail, setFeeDetail] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fee/edit/${idf}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched fee details:', response.data);
        setFeeDetail(response.data.data);
        setErrorMessage(""); // Reset error message when data is fetched
      } catch (error) {
        console.error('Error fetching fee details:', error);
        setErrorMessage('Error fetching fee details.'); // Set error message
      }
    };
    fetchFeeDetails();
  }, [idf, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeeDetail((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedFields = {
      monthly_fee_feetbl: feedetail.monthly_fee_feetbl,
      arrears: feedetail.arrears,
      adm_fee: feedetail.adm_fee,
      adm_arrears: feedetail.adm_arrears,
      fine_fee: feedetail.fine_fee,
      fine_arrears: feedetail.fine_arrears,
      exam_fee: feedetail.exam_fee,
      exam_arrears: feedetail.exam_arrears,
      misc_fee: feedetail.misc_fee, // Add misc_fee
      misc_arrears: feedetail.misc_arrears, // Add misc_arrears
      updated_at: new Date().toLocaleDateString('en-GB'),
    };

    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/fee/edit/${idf}`, updatedFields, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Server response:', response);
      navigate('/dashboard/feesearch', { state: { message: 'Fee updated successfully!' } });
    } catch (error) {
      console.error('Error updating fee:', error);
      setErrorMessage(error.response.data.error || 'Error updating fee.'); // Set the error message
    }
  };
  
  const handleBack = () => {
    navigate("/dashboard/feesearch");
  };

  return (
    <>
      <div style={{ backgroundColor: "white" }} className="card col-md-8 mx-auto">
        <div className="row">
          <h1 className="text-center">Fee Edit</h1>
          <p>
          {errorMessage && (
            <div className="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}</p>
         <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Monthly Fee</label>
              <input
                className="form-control"
                type="number"
                name="monthly_fee_feetbl"
                value={feedetail.monthly_fee_feetbl || 0}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Arrears</label>
              <input className="form-control" type="text" name="arrears" value={feedetail.arrears || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Adm Fee</label>
              <input className="form-control" type="text" name="adm_fee" value={feedetail.adm_fee || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Adm Arrears</label>
              <input className="form-control" type="text" name="adm_arrears" value={feedetail.adm_arrears || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Fine Fee</label>
              <input className="form-control" type="text" name="fine_fee" value={feedetail.fine_fee || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Fine Arrears</label>
              <input className="form-control" type="text" name="fine_arrears" value={feedetail.fine_arrears || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Exam Fee</label>
              <input className="form-control" type="text" name="exam_fee" value={feedetail.exam_fee || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Exam Arrears</label>
              <input className="form-control" type="text" name="exam_arrears" value={feedetail.exam_arrears || 0} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">{feedetail.remarks || "Misc Fee"}</label>
              <input
                className="form-control"
                type="text"
                name="misc_fee"
                value={feedetail.misc_fee || 0}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-md-5">
          <div className="col-md-5">
  <div className="form-group">
    <label className="form-label">
      {feedetail.remarks ? `${feedetail.remarks} arrears` : "Misc Fee"}
    </label>
    <input
      className="form-control"
      type="text"
      name="misc_arrears"
      value={feedetail.misc_arrears || 0}
      onChange={handleInputChange}
    />
  </div>
</div>

</div>
</div>
        <div className='row'>
          <button className="btn btn-success col-md-2 ml-3" onClick={(e) => handleUpdate(e)}> Update </button>
          <button className="btn btn-secondary ml-1 col-md-2" onClick={(e) => handleBack(e)}> Back </button>
        </div>
      </div>
    </>
  );
};

export default FeeEdit;
