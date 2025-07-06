import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import principal from '../Images/principal.jpg';


const About = () => {
  return (
    <>
      <div className='row' style={{height:"600px"}}>
        <div className='col-md-4 px-5 py-5'>
          <img 
            src={principal} 
            alt="Principal" 
            className="img-fluid rounded-circle border border-secondary shadow-lg" 
          />
        </div>

        <div className='col-md-8 px-5 py-5 '>
          <h4 style={{color:'#3c6e71'}}>About Us</h4>
          <h2 style={{ color: "black" }}>Numberdar Raja Muhammad Raza</h2>
         
     
          <h3 style={{color:'#3c6e71'}}></h3>
          <h3 style={{color:'#3c6e71'}}>Aim</h3>
          <p className='text-justify' style={{ color: "black" }}>
          At this platform, we are passionate about providing high-quality livestock while upholding the values of honesty, integrity, and fairness in all our dealings. Rooted in the teachings of Islam, we conduct our business in a completely Shariah-compliant manner, ensuring transparency and trust with every transaction.

Our mission is to serve our community with ethically sourced livestock, fostering long-term relationships built on mutual respect and Islamic ethical standards. We believe that success is not just measured by growth, but by the trust and satisfaction of our customers, grounded in the principles of Islamic trading.

Join us on this journey of ethical business, where faith and quality go hand in hand.
</p>
        </div>
        <br />
        <hr />
        <br />
      </div>
      
      <hr />
      
    </>
  );
};

export default About;
