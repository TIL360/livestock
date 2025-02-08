import React, { useContext } from 'react';
import { FaBars, FaUserGraduate, FaWallet, FaSearch, FaUserTie, FaSignOutAlt, FaRegistered, FaCloudUploadAlt } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import '../CSS/sidebar.css';
import userContext from '../context/UserContext';

const Sidebar = ({ toggle, isOpen }) => {
  const { logout, user, usertype } = useContext(userContext);
  const navigate = useNavigate();

  const adminMenuItems = [
    { path: "/dashboard/studentlist", name: "Students", icon: <FaUserGraduate /> },
    { path: "/dashboard/applications", name: "Applications", icon: <FaUserGraduate /> },
    { path: "/dashboard/feedetail", name: "Fee", icon: <FaWallet /> },
    { path: "/dashboard/feesearch", name: "Collection", icon: <FaSearch /> },
    { path: "/dashboard/stafflist", name: "Staff", icon: <FaUserTie /> },
    { path: "/dashboard/attendance", name: "Attendance", icon: <FaUserTie /> },
    { path: "/dashboard/standards", name: "Classes", icon: <FaUserTie /> },
    { path: "/dashboard/resultprep", name: "Result Prepare", icon: <FaUserTie /> },
    { path: "/dashboard/result", name: "Result", icon: <FaUserTie /> },
    { path: "/dashboard/registration", name: "New User", icon: <FaRegistered /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaCloudUploadAlt /> },
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
  ];

  const staffMenuItems = [
    { path: "/dashboard/studentlist", name: "Students", icon: <FaUserGraduate /> },
    { path: "/dashboard/feesearch", name: "Collection", icon: <FaSearch /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaCloudUploadAlt /> },
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
  ];

  const studentMenuItems = [
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
  ];

  const menuItem = usertype === 'Admin' ? adminMenuItems : usertype === 'Staff' ? staffMenuItems : studentMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <div>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="top_section">
          <div className="bars" onClick={toggle} >
            {isOpen ? (
              <>
                <span className="text-left" >Welcome, {usertype ? usertype : "User"}! {user.username}</span>
                <FaBars />
              </>
            ) : (
              <FaBars />
            )}
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className="link" activeclassname="active" onClick={item.action && item.name === "Logout" ? handleLogout : null} >
            <div className="icon">{item.icon}</div>
            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;