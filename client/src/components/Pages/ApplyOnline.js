import React from 'react';

const ApplyOnline = () => {
  return (
    <div style={{
      height: "auto", 
      width: "80%", 
      marginLeft: "50px", 
      backgroundColor: "rgba(255, 255, 255, 0.8)", 
      boxShadow: "0px 0px 10px rgba(0,0,0,0.5)"
    }}>
      <div className='align-item-center mt-4 ' style={{ 
        height: "auto", 
        width: "80%", 
        padding: "15px"
      }}>
        <form>
          <h3>Application Form</h3>
          <div className='row'>
            <div className='col-md-6'>
              <label>Student Name</label>
              <input className='form-control' />
            </div>
            <div className='col-md-6'>
              <label>Father Name</label>
              <input className='form-control' />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>CNIC</label>
              <input className='form-control' />
            </div>
            <div className='col-md-6'>
              <label>Date of Birth</label>
              <input type='date' className='form-control' />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Email</label>
              <input type='email' className='form-control' />
            </div>
            <div className='col-md-6'>
              <label>Gender</label>
              <select className='form-control'>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Student Mobile No</label>
              <input type='tel' className='form-control' />
            </div>
            <div className='col-md-6'>
              <label>Father's Mobile No</label>
              <input type='tel' className='form-control' />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Matric Marks</label>
              <input type='number' className='form-control' />
            </div>
            <div className='col-md-6'>
              <label>F.Sc Marks</label>
              <input type='number' className='form-control' />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Domicile</label>
              <input className='form-control' />
            </div>
            <div className='col-md-6'>
              <label>Select Programe</label>
              <select className='form-control'>
                <option value=''>Select Programe</option>
                <option value='Operation Theater Technician'>Operation Theater Technician</option>
                <option value='Medical Lab Technician'>Medical Lab Technician</option>
                <option value='Medical Imaging Technician'>Medical Imaging Technician</option>
                <option value='Ophthalmology Technician'>Ophthalmology Technician</option>
                <option value='Nursing Technician'>Nursing Technician</option>
                <option value='Dental Hygiene Technician'>Dental Hygiene Technician</option>
                <option value='Physiotherapy Technician'>Physiotherapy Technician</option>
                <option value='Cardic Technician'>Cardic Technician</option>
                <option value='Dispenser'>Dispenser</option>
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <label>Address</label>
              <textarea className='form-control' />
            </div>
          </div>
          <button className='btn btn-success mt-1'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyOnline;
