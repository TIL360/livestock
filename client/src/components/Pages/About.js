import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import principal from '../Images/principal.jpg';


const About = () => {
  return (
    <>
      <div className='row'>
        <div className='col-md-4 px-5 py-5'>
          <img 
            src={principal} 
            alt="Principal" 
            className="img-fluid rounded-circle border border-secondary shadow-lg" 
          />
        </div>

        <div className='col-md-8 px-4 py-5'>
          <h4 className='text-info'>About Us</h4>
          <h2 style={{ color: "white" }}>Mr Mubashir</h2>
          <p style={{ color: "white" }}>MSC ۔ M۔Ed</p>
          <p style={{ color: "white" }}>25 Years teaching and administration experience.</p>

       
          <h3 className='text-info'>Vision</h3>
          <h3 className='text-info'>Empowering Minds, Enriching Futures</h3>
          <p style={{ color: "white" }}>

          Vision Statement: At Pakistan International Public School Murree, our vision is to foster a community of curious learners, creative thinkers, and compassionate individuals. We strive to empower students with knowledge, skills, and values necessary to excel in an ever-changing world, cultivating leaders who contribute positively to local and global communities.</p>
<h3 className='text-info'>
Our Mission
          </h3>
<p style={{ color: "white" }}>

At Pakistan International Public School Murree, our mission is to:
<br/>
•⁠ ⁠Provide a supportive and inclusive learning environment
<br/>
•⁠ ⁠Foster academic excellence and personal growth
<br/>
•⁠ ⁠Develop critical thinking, creativity, and problem-solving skills
<br/>
•⁠ ⁠Cultivate leadership, teamwork, and social responsibility
<br/>
•⁠ ⁠Prepare students for success in academics, careers, and beyond"
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
