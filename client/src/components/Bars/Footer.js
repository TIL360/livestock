import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className='d-flex justify-content-between align-items-center text-white' style={{ backgroundColor: "black", fontSize: "12px", padding: "10px" }}>
      <div className='col-md-8' style={{ borderRight: '1px solid white', paddingRight: '10px' }}>
        <h6>Contact Us</h6>
        <p>Contact: +92 322 5366745 </p>
        <p>
 <br />

        </p><br />
      </div>
      <div className='col-md-4 text-left ml-2'>
        <h6>Designed by: Techinfolab360</h6>
        <p>Website: https://www.techinfolab360.xyz</p>
        <p>E-mail: techinfolab360@gmail.com</p>
        <a href="https://web.facebook.com/profile.php?id=61555994156467" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginRight: '10px', fontSize: "20px" }}>
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
