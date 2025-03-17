import React from 'react'
import solar from '../Images/solar.jpg';
import Quran from '../Images/Quran.jpg';
import coaching from '../Images/coaching.jpg';
import orphans from '../Images/orphans.jpg';
import lab from '../Images/lab.jpg';
import ground from '../Images/playground.jpg';
import library from '../Images/library.jpg';
import environment from '../Images/environment.jpg';
import scholarship from '../Images/scholarship.jpg';

export default function Services() {
  return (
    <div>
      <div className='row'>
        <h3 className='text-center text-info' >Our Services</h3>
        <h2 className='text-center ' style={{ color: "white" }}>
          We Provide quality education at the threshold
        </h2>

        <div className='col-md-4 px-5 py-5'>
          <img src={solar} alt="Generator Facility" className="img-fluid" />
          <h3 style={{ color: "white" }}>Generator Facility</h3>
          <p style={{ color: "white" }}>We provide education with loadsheding free environment with the help of generator.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={Quran} alt="Nazra e Quran" className="img-fluid" />
          <h3 style={{ color: "white" }}>Nazra e Quran</h3>
          <p style={{ color: "white" }}>We do provide separate classes of Nazra for Students.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={lab} alt="Science & Computer Lab" className="img-fluid" />
          <h3 style={{ color: "white" }}>Science & Computer Lab</h3>
          <p className='text-justify' style={{ color: "white" }}>We do provide state of the art science and computer labs for matriculation students.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={coaching} alt="Coaching Classes" className="img-fluid" />
          <h3 style={{ color: "white" }}>Coaching Classes</h3>
          <p style={{ color: "white" }}>A team of expert staff provides Coaching Classes and career counseling.</p>
        </div>
 
        <div className='col-md-4 px-5 py-5'>
          <img src={orphans} alt="Free Education for Orphans" className="img-fluid" />
          <h3 style={{ color: "white" }}>Free Education for Orphans</h3>
          <p style={{ color: "white" }}>We do provide completely free education for orphans from Nursery to Grade X.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={ground} alt="Playground" className="img-fluid" />
          <h3 style={{ color: "white" }}>Playground</h3>
          <p style={{ color: "white" }}>Lucrative playgrounds for children with different sport facilities.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={scholarship} alt="Subsidy Policies" className="img-fluid" />
          <h3 style={{ color: "white" }}>Subsidy Policies</h3>
          <p style={{ color: "white" }}>We facilitate needy and deserving students by giving them Scholarships and fee concessions.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={library} alt="Library" className="img-fluid" />
          <h3 style={{ color: "white" }}>Library</h3>
          <p className='text-justify' style={{ color: "white" }}>The library is filled with over 500 books of different fields.</p>
        </div>

        <div className='col-md-4 px-5 py-5'>
          <img src={environment} alt="Educational Environment" className="img-fluid" />
          <h3 style={{ color: "white" }}>Educational Environment</h3>
          <p className='text-justify' style={{ color: "white" }}>We have a safe, clean, and entertaining Learning environment for students.</p>
        </div>
      </div>
    </div>
  )
}
