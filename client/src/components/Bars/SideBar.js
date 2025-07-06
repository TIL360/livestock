import React, { useContext } from 'react';
import { FaBars, FaBullhorn, FaPaw, FaSignOutAlt, FaDatabase, FaPlus, FaLock, FaEnvelope, FaUsers, FaImage, FaMoneyBill } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import '../CSS/sidebar.css';
import userContext from '../context/UserContext';

const Sidebar = ({ toggle, isOpen }) => {
  const { logout, user, usertype } = useContext(userContext);
  const navigate = useNavigate();

  const adminMenuItems = [
    { path: "/dashboard/dynamicdb", name: "Dashboard", icon: <FaDatabase /> },
    { path: "/dashboard/animalslist", name: "Live Stock", icon: <FaPaw /> }, // Changed icon for clarity
    { path: "/dashboard/applications", name: "Applications", icon: <FaEnvelope /> },
    { path: "/dashboard/infos", name: "Announcement", icon: <FaBullhorn /> }, // Changed icon for announcements
    { path: "/dashboard/expenses", name: "Expenses", icon: <FaMoneyBill /> },
    { path: "/dashboard/registration", name: "New User", icon: <FaPlus /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaLock /> },
    { path: "/dashboard/images", name: "Upload Images", icon: <FaImage /> },
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
  ];

  const accountantMenuItems = [
    { path: "/dashboard/dynamicdb", name: "Dashboard", icon: <FaDatabase /> },
    { path: "/dashboard/animalslist", name: "Live Stock", icon: <FaUsers /> },
    { path: "/dashboard/applications", name: "Applications", icon: <FaEnvelope /> },
    { path: "/dashboard/infos", name: "Announcement", icon: <FaBullhorn /> },
    { path: "/dashboard/registration", name: "New User", icon: <FaPlus /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaLock /> },
    { path: "/dashboard/images", name: "Upload Images", icon: <FaImage /> },
  ];

  const sectionHead = [
    { path: "/dashboard/dynamicdb", name: "Dashboard", icon: <FaDatabase /> },
    { path: "/dashboard/animalslist", name: "Live Stock", icon: <FaUsers /> },
    { path: "/dashboard/applications", name: "Applications", icon: <FaEnvelope /> },
    { path: "/dashboard/infos", name: "Announcement", icon: <FaBullhorn /> },
    { path: "/dashboard/registration", name: "New User", icon: <FaPlus /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaLock /> },
    { path: "/dashboard/images", name: "Upload Images", icon: <FaImage /> },
  ];

  const menuItem = usertype === 'Admin' ? adminMenuItems : usertype === 'Accountant' ? accountantMenuItems : sectionHead;

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <div>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="top_section">
          <div className="bars" onClick={toggle}>
            {isOpen ? (
              <>
                <span className="text-left">Welcome, {user.username}!</span>
                <FaBars />
              </>
            ) : (
              <FaBars />
            )}
          </div>
        </div>

        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassname="active"
            onClick={item.name === "Logout" ? handleLogout : null}
          >
            <div className="icon">{item.icon}</div>
            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
