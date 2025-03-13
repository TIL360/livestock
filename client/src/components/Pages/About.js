import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import principal from '../Images/principal.jpg';
import solar from '../Images/solar.jpg';
import Quran from '../Images/Quran.jpg';
import coaching from '../Images/coaching.jpg';
import orphans from '../Images/orphans.jpg';
import lab from '../Images/lab.jpg';
import ground from '../Images/playground.jpg';
import library from '../Images/library.jpg';
import environment from '../Images/environment.jpg';
import scholarship from '../Images/scholarship.jpg';



const About = () => {
 


   

  return (
    <>
     
        <div className='row'>
          <div className='col-md-6 px-5 py-5'>
            <img src={principal} alt="Principal" className="img-fluid" />
          </div>

          <div className='col-md-6 px-5 py-5'>
            <h4 style={{ color: "blue" }}>About Us</h4>
            <h2>Muhammad Asad</h2>
            <p>Managing Director, Social Activist & Public Speaker .</p>
            <p>MA (Political Science)</p>
            <p>10 Years experience in the teaching field and administration.</p>
          </div>
          <br/>
          <hr/>
          <br/>
         
        </div>
        <hr/>
        <div className='row'>
                    <h3 className='text-center' style={{color:"Blue"}}>Our Services</h3>
                        <h2 className='text-center'>
                        We Provide quality education at the threshold</h2>
          <div className='col-md-4 px-5 py-5'>
          <img src={solar} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Solar Electricity</h3>
          <p>We provide education with loadsheding free environment with the help of solar electricity.</p>
          </div>
        
          <div className='col-md-4 px-5 py-5'>
          <img src={Quran} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Nazra e Quran / Hifz e Quran </h3>
          <p>We do provide separate classes of Nazra and Hifz for Students </p>
          </div>
        
        
          <div className='col-md-4 px-5 py-5'>
          <img src={lab} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Science & Computer Lab</h3>
          <p className='text-justify'>We do provide state of the art science and computer labs for matriculation students.</p>
          

          </div>
        
          <div className='col-md-4 px-5 py-5'>
          <img src={coaching} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Coaching Classes</h3>
          <p> A team of expert staff provides Coaching Classes and career counseling.</p>
          </div>
        
          <div className='col-md-4 px-5 py-5'>
          <img src={orphans} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Free Education for orphan</h3>
          <p>We do provide Completely free education for orphans from Nursery to Grade X </p>
          </div>

          <div className='col-md-4 px-5 py-5'>
          <img src={ground} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          
          <h3>Playground</h3>
          <p>Lucrative play grounds for children with different sport facilities. </p>
          </div>

         

          <div className='col-md-4 px-5 py-5'>
          <img src={scholarship} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Subsidy Policies </h3>
          <p>We facilitate needy and deserving students by giving them Scholarships and fee concessions </p>
          </div>

          <div className='col-md-4 px-5 py-5'>
          <img src={library} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Library </h3>
          <p className='text-justify'>The library is filled with over 500 books of different fields.</p>
          </div>

          <div className='col-md-4 px-5 py-5'>
          <img src={environment} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
          <h3>Educational Environment </h3>
          <p className='text-justify'> We have a safe, clean and entertaining Learning environment for students.</p>
          </div>
        

         
          
                  </div>
    </>
  );
};

export default About;
