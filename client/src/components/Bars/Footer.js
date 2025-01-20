import React from 'react';

const Footer = () => {
  return (
    <>
      <div className='row text-white' style={{backgroundColor:"black", fontSize:"12px"}}>
        <div className='col-md-8' style={{
          borderRight: '1px solid white'
        }}>
          <h6>FINAHS, Rawalpindi</h6>
          <p>Contact: (051) 5910296 || Website: https://www.finahs.edu.pk</p>
          <p>Address: Gul-e-iqra Plaza, near Red Onion Murree Road, Saddar, Rawalpindi, Punjab 46000, Pakistan, Rawalpindi, Pakistan</p>
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
