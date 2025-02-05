import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../CSS/navbar.css";
import { FaBars } from "react-icons/fa";
import image1 from "../Images/logo.png";



function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar mb-3">
        <div className="nav-container">
        <img 
  src={image1} 
  width={80} 
  height={80} 
  alt="Logo" 
  
/>
          <NavLink exact to="/" className="nav-logo">
            <span>FALAH<br/> Institute Of Nursing <br/>And Allied Health Sciences</span>
            {/* <i className="fas fa-code"></i> */}
            </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
           
            <li className="nav-item">
              <NavLink
                
                to="/login"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                FINAHS
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                
                to="/programs"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Programes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                
                to="/applyonline"
                style={{background:"green", color:"white"}}
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Apply Online
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
              <span className="icon">
               <FaBars/>{" "}
              </span>
            ) : (
              <span className="icon">
             <FaBars/>
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;