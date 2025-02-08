import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import logo from './Images/logo.png';
import fontfile from './Fonts/Trick.ttf';

const Home = () => {
  const navigate = useNavigate();
  const [animateLogo, setAnimateLogo] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);

  const handleClick = () => {
    navigate('/applyonline');
  }

  useEffect(() => {
    setAnimateLogo(true);
    setAnimateTitle(true);
    setAnimateContent(true);
  }, []);

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Trick';
            src: url(${fontfile}) format('truetype');
          }

          .logo {
            transition: all 1s ease-in-out;
            transform: translateY(100px);
            opacity: 0;
          }

          .logo.animate {
            transform: translateY(0);
            opacity: 1;
          }

          .title {
            transition: all 1s ease-in-out;
            transform: translateY(-100px);
            opacity: 0;
          }

          .title.animate {
            transform: translateY(0);
            opacity: 1;
          }

          .content {
            transition: all 1s ease-in-out;
            transform: translateY(100px);
            opacity: 0;
          }

          .content.animate {
            transform: translateY(0);
            opacity: 1;
          }
        `}
      </style>
      <div style={{ height: "auto" }}>
        <div>
          <div style={{ textAlign: 'center' }}>
            <img
              src={logo}
              alt="Falah Institute Logo"
              className={`text-center mx-auto d-block logo ${animateLogo ? 'animate' : ''}`}
              style={{
                width: '20%',
                borderRadius: '50%',
                boxShadow: '10px 10px 14px rgba(0, 0, 0, 0.2)',
              }}
            />
            <br />
            <h1
              className={`title ${animateTitle ? 'animate' : ''}`}
              style={{
                fontSize: '150px',
                fontFamily: 'Trick',
                color: "white",
                textShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              FINAHS
            </h1>
            <div
              className={`content ${animateContent ? 'animate' : ''}`}
            >
              <hr />
              <h2
                style={{
                  fontSize: '40px',
                  color: "#03045e",
                  backgroundColor: "white"
                }}
              >
                Falah Institute Of Nursing And Allied Health Sciences
              </h2>
              <button className='btn btn-primary' onClick={handleClick}> Apply Online</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;