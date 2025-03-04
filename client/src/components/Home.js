import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import fontfile from './Fonts/Angels.ttf';
import { Carousel } from 'react-bootstrap'; 
import axios from 'axios'; 
import principal from './Images/principal.jpg';
import solar from './Images/solar.jpg';
import Quran from './Images/Quran.jpg';
import coaching from './Images/coaching.jpg';
import orphans from './Images/orphans.jpg';
import lab from './Images/lab.jpg';

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
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

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

          .carousel-item {
            transition: transform 1s ease, opacity 1s ease;
            position: relative;
            opacity: 0;
            transform: translateX(100%); /* Start off-screen to the right */
          }

          .carousel-item.active {
            opacity: 1;
            transform: translateX(0); /* Slide in to the original position */
          }

          .carousel-item-prev,
          .carousel-item-next {
            opacity: 0;
            transform: translateX(100%); /* Start off-screen to the right */
          }

          .carousel-item-prev.active,
          .carousel-item-next.active {
            opacity: 1;
            transform: translateX(0); /* Slide in */
          }

          .carousel-item:not(.active) {
            opacity: 0.5; /* Make non-active items less visible */
          }
        `}
      </style>
      <div style={{ height: "auto" }}>
        <div>
          <div style={{ textAlign: 'center' }}>
            <br />
            <h1 className={`title ${animateTitle ? 'animate' : ''}`} style={{ fontSize: '50px', fontFamily: 'Arial', color: '#031564', textShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)' }}>
              Welcome to
            </h1>
            <h1 className={`title ${animateTitle ? 'animate' : ''}`} style={{ fontSize: '50px', fontFamily: 'Trick', color: '#031564', textShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)' }}>
              Islamic Scholar Public School, Wah Cantt
            </h1>
            <div className={`content ${animateContent ? 'animate' : ''}`}>
              <hr />
            </div>
          </div>

          <div className='container'>
            <div className='mx-2 shadow p-2 border-3 border-info'>

              {/* Image Slider */}
              <Carousel activeIndex={currentIndex} onSelect={setCurrentIndex} interval={null}>
                {images.map((image, index) => (
                  <Carousel.Item key={image.id} className={currentIndex === index ? 'active' : ''}>
                    <img
                      className="d-block w-100"
                      src={`${process.env.REACT_APP_API_URL}/uploads/webimages/${image.photo}`} 
                      alt={image.title}
                      style={{ height: '500px', width: '80%', objectFit: 'cover' }} 
                    />
                    <Carousel.Caption>
                      <h3 style={{ color: "black" }}>{image.title}</h3>
                      <p style={{ color: "black" }}>{image.description}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <br/><br/><br/><br/><br/><hr/><br/>
          </div>

        </div>
        <div className='row'>
          <div className='col-md-6 px-5 py-5'>
            <img src={principal} alt="Principal" className="img-fluid" />
          </div>

          <div className='col-md-6 px-5 py-5'>
            <h4 style={{ color: "blue" }}>About Us</h4>
            <h2>Adil Shahzad</h2>
            <p>20 years experience in teaching field with administration C.E.O (M.Sc Physics & B.Sc (Double Maths).</p>
          </div>
          <br/>
          <hr/>
          <br/>
          <div className='row'>
            <h3 className='text-center' style={{color:"Blue"}}>Our Services</h3>
                <h2 className='text-center'>
                We strive to serve the nation</h2>
  <div className='col-md-4 px-5 py-5'>
  <img src={solar} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
  <h3>Solar Electricity</h3>
  <p>We provide education with loadsheding free environment with the help of solar electricity.</p>
  </div>

  <div className='col-md-4 px-5 py-5'>
  <img src={Quran} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
  <h3>Tafseer e Quran</h3>
  <p>We do provide tafseer e Quran education to students parallel to academic education.</p>
  </div>


  <div className='col-md-4 px-5 py-5'>
  <img src={lab} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
  <h3>Science & Computer Lab</h3>
  <p>We do provide quality standard Science & Computer Lab for students to meet their needs.</p>
  </div>

  <div className='col-md-4 px-5 py-5'>
  <img src={coaching} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
  <h3>Free Coaching Classes</h3>
  <p>Free coaching classes are arranged for students.</p>
  </div>

  <div className='col-md-4 px-5 py-5'>
  <img src={orphans} alt="Principal" className="img-fluid" style={{alignItems:"center"}} />
  <h3>Free Education for Orphans</h3>
  <p>We do provide free education to orphans.</p>
  </div>


          </div>
        </div>

      </div>
    </>
  );
};

export default Home;
