import React from 'react';

const Footer = () => {
  return (
    <>
      <div className='row text-white' style={{backgroundColor:"black", fontSize:"12px"}}>
        <div className='col-md-8' style={{
          borderRight: '1px solid white'
        }}>
          <h6>ISPS Wah Cantt, Islamabad</h6>
          <p>Contact: +92 336 5777728 || Website: https://www.ispschool.xyz</p>
          <p>Gudwal, Wah Cantt, Islamabad</p>
        </div>
        <div className='col-md-4'>
          <h6>Designed by: Techinfolab360</h6>
          <p>Website: https://www.techinfolab360.xyz</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
