import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <>
      <div className='row text-white' style={{backgroundColor:"black", fontSize:"12px"}}>
        <div className='col-md-8' style={{ borderRight: '1px solid white' }}>
          <h6>P.I.P.S, Murree</h6>
          <p>Contact: +92 3151436832 || Website: https://www.rahbarschool.com</p>
          <p>Garhi Habibullah, Tehsil Balakot, District Mansehra</p><br/>
          <a href="https://www.facebook.com/share/1EJfPNDzvB/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginRight: '10px', fontSize:"30px" }}>
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://wa.me/923151436832" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginRight: '10px', fontSize:"30px" }}>
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>
        <div className='col-md-4'>
          <h6>Designed by: Techinfolab360</h6>
          <p>Website: https://www.techinfolab360.xyz</p>
             <a href="https://web.facebook.com/profile.php?id=61555994156467" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginRight: '10px', fontSize:"30px" }}>
                        <FontAwesomeIcon icon={faFacebook} />
                      </a>
        </div>
      </div>
    </>
  );
};

export default Footer;