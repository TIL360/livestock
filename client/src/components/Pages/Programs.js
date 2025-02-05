import React from 'react';
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ height: "100%" }}>
        <h3 className='text-center' style={{
          fontSize: "40px",
          color: "white",
          textShadow: "-1px 0px 0px black, 1px 0px 0px black, 0px -1px 0px black, 0px 1px 0px black"
        }}>
          PROGRAMS OFFERED AT FINAHS, RWP
        </h3>
        <div className='row' style={{
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div className='col-md-6' style={{
            padding: "20px",
            marginBottom: "20px"
          }}>
            <button className='btn' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe1')}>
              Operation Theater Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe2')}>
              Medical Lab Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe3')}>
              Medical Imaging Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe4')}>
              Opthalmology Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe5')}>
              Nursing Technician
            </button>
          
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe6')}>
              Dental Hygiene Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe7')}>
              Physiotherapy Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe8')}>
              Cardic Technician
            </button>
            <button className='btn btn-success' style={{
              width: "90%",
              marginTop: "10px",
              backgroundColor:"#003049",
              color: "#f0ebd8",
              fontSize: "18px",
              border: "1px Solid White",
              height: "50px",
              marginBottom: "10px",
              boxShadow: "0px 5px 5px black"
            }}
              onClick={() => navigate('/programe9')}>
              Dispenser
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default Programs;
