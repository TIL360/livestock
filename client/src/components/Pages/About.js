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

        <div className='col-md-8 px-5 py-5 '>
          <h4 style={{color:'#3c6e71'}}>About Us</h4>
          <h2 style={{ color: "black" }}>Mr Ahmed Farooq</h2>
         
          <p className='text-justify' style={{ color: "black" }}>Results-driven professional with 20 years of diverse experience in multinational settings, complemented by qualifications in safety and quality management. Proven leadership skills, with expertise in training and assessment, poised to lead educational institutions effectively.</p>

       
          <h3 style={{color:'#3c6e71'}}>Vision</h3>
          <h3 style={{color:'#3c6e71'}}>Empowering Minds, Enriching Futures</h3>
          <p className='text-justify' style={{ color: "black" }}>

          Vision Statement: At Pakistan International Public School Murree, our vision is to foster a community of curious learners, creative thinkers, and compassionate individuals. We strive to empower students with knowledge, skills, and values necessary to excel in an ever-changing world, cultivating leaders who contribute positively to local and global communities.</p>
<h3 style={{color:'#3c6e71'}}>
Our Mission
          </h3>
<p style={{ color: "black" }}>

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
