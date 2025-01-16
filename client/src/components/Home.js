import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import bgImage from './Images/bg.jpg';
import logo from './Images/logo.jpg';

const Home = () => {
  return (
    <>
      <div>
        <div style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            textAlign: "center",
            color: "white"
          }}>
            <img src={logo} className='text-center'/>
            <h1 style={{ fontSize: "200px" }}>FINAHS</h1>
            
            <h1 style={{ fontSize: "30px" }}>Falah Institute Of Nursing And Allied Health Sciences</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;