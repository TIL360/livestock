import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import logo from './Images/logo.png';
import fontfile from './Fonts/Trick.ttf';


const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/applyonline');
}
  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Trick';
            src: url(${fontfile}) format('truetype');
          }
        `}
      </style>
      <div style={{height:"auto"}}>
        <div
          
        >
          <div style={{ textAlign: 'center'}} >
            <br/><br/>
            <img 
  src={logo} 
  alt="Falah Institute Logo" 
  className="text-center mx-auto d-block" 
  style={{ 
    width: '20%', 
    borderRadius: '50%', // Change to 50% for a perfect circle
    boxShadow: '10px 10px 14px rgba(0, 0, 0, 0.2)', // Add shadow effect
  }} 
/>

<br/>
<hr/>
            <h1
              style={{
                fontSize: '200px',
                fontFamily: 'Trick',
                color:"white",
                textShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)'
               
              }}
            >
              FINAHS
            </h1>
            <h2 style={{ fontSize: '40px', color:"#03045e", backgroundColor:"white" }}>
              Falah Institute Of Nursing And Allied Health Sciences
            </h2>
            <button className='btn btn-primary'  onClick={handleClick}> Apply Online</button>
          </div>
          
        </div> 
      </div>
    </>
  );
};

export default Home;