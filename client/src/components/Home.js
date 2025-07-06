import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import fontfile from './Fonts/Poppins-BlackItalic.ttf';
import fontfile2 from './Fonts/GreatVibes-Regular.ttf';
import axios from 'axios'; 
import hadithImage from "./Images/hadith.jpg"; 

const Home = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateTitle, setAnimateTitle] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);

  useEffect(() => {
    setAnimateTitle(true);
    setAnimateContent(true);

    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/image/webimage`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [images.length]);

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Trick';
            src: url(${fontfile}) format('truetype');
          }
          @font-face {
            font-family: 'GreatVibes-Regular';
            src: url(${fontfile2}) format('truetype');
          }

          .title {
            transition: all 1s ease-in-out;
            opacity: 0;
          }
          .title.animate {
            opacity: 1;
          }

          .content {
            transition: all 1s ease-in-out;
            opacity: 0;
          }
          .content.animate {
            opacity: 1;
          }

          /* Carousel animation */
          .carousel-item {
            transition: transform 1s ease, opacity 1s ease;
            position: relative;
            opacity: 0;
            transform: translateX(100%);
          }
          .carousel-item.active {
            opacity: 1;
            transform: translateX(0);
          }
          /* Optional: style for image container */
          .hadith-image {
            width: 80%;
            max-width: 1000px;
            height: auto;
            object-fit: cover;
            margin: 30px auto;
            display: block;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
        `}
      </style>
      
      <div className="container my-5" style={{ textAlign: 'center' }}>
        {/* Title Section */}
        
        <h1
          className={`title ${animateTitle ? 'animate' : ''}`}
          style={{
            fontSize: '50px',
            fontFamily: 'GreatVibes-Regular',
            color: '#031564',
            textShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)',
            marginBottom: '20px',
          }}
        >
          Welcome to
        </h1>
        <h1
          className={`title ${animateTitle ? 'animate' : ''}`}
          style={{
            fontSize: '50px',
            fontFamily: 'Trick',
            color: '#284b63',
            textShadow: '0px 10px 10px #000000',
            marginBottom: '30px',
          }}
        >
          RAZA & SONs <br /> Livestock, Murree
        </h1>

        {/* Optional separator or content */}
        <div className={`content ${animateContent ? 'animate' : ''}`}>
          <hr style={{ maxWidth: '600px', margin: '0 auto' }} />
        </div>

        {/* Hadith Image Section */}
        <div className="my-4">
          <img
            src={hadithImage}
            alt="Hadith"
            className="hadith-image"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
