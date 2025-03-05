import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../CSS/navbar.css";
import { FaBars } from "react-icons/fa";
import image1 from "../Images/logo.png";

function NavBar() {
  const [click, setClick] = useState(false);
  const [showPages, setShowPages] = useState(false); // State for toggling Pages submenu

  const handleClick = () => setClick(!click);
  const togglePages = () => setShowPages(!showPages); // Function to toggle Pages submenu

  return (
    <>
      <nav className="navbar mb-3">
        <div className="nav-container">
          <img src={image1} width={80} height={80} alt="Logo" />
          <NavLink exact to="/" className="nav-logo">
            <span>ISPS Wah, Islamabad</span>
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
                ISPS App
              </NavLink>
            </li>
            {/* New Pages menu */}
            <li className="nav-item" onClick={togglePages}>
              <span className="nav-links" style={{ cursor: "pointer" }}>
                Pages 
              </span>
              {showPages && (
                <ul className="sub-menu">
                  <li className="nav-item">
                    <NavLink
                      to="/announcementpublished"
                      activeClassName="active"
                      className="nav-links"
                      onClick={handleClick}
                    >
                      Announcements
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/taskview"
                      activeClassName="active"
                      className="nav-links"
                      onClick={handleClick}
                    >
                      Diary
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/invoicefee"
                      activeClassName="active"
                      className="nav-links"
                      onClick={handleClick}
                    >
                      Fee
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/result"
                      activeClassName="active"
                      className="nav-links"
                      onClick={handleClick}
                    >
                      Result
                    </NavLink>
                  </li>
                 
                </ul>
              )}
            </li>
            {/* <li className="nav-item">
              <NavLink
                to="/programs"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Programs
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink
                to="/applyonline"
                style={{ background: "green", color: "white" }}
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Apply Online
              </NavLink>
            </li>
            
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ? (
              <span className="icon">
                <FaBars />
              </span>
            ) : (
              <span className="icon">
                <FaBars />
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
