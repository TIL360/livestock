import React, { useContext } from 'react';
import { FaBars, FaUserGraduate, FaWallet, FaUserTie, FaSignOutAlt, FaCloudUploadAlt, FaDatabase, FaQuestion, FaPlus, FaLock, FaEnvelope, FaTeamspeak, FaTasks, FaImage} from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import '../CSS/sidebar.css';
import userContext from '../context/UserContext';

const Sidebar = ({ toggle, isOpen }) => {
  const { logout, user, usertype } = useContext(userContext);
  const navigate = useNavigate();

  const adminMenuItems = [
    { path: "/dashboard/dynamicdb", name: "Dashboard", icon: <FaDatabase /> },
    { path: "/dashboard/studentlist", name: "Students", icon: <FaUserGraduate /> },
    { path: "/dashboard/applications", name: "Applications", icon: <FaEnvelope /> },
    { path: "/dashboard/feedetail", name: "Fee", icon: <FaWallet /> },
    { path: "/dashboard/stafflist", name: "Staff", icon: <FaUserTie /> },
    { path: "/dashboard/addquestion", name: "Q Bank", icon: <FaQuestion /> },
    { path: "/dashboard/infos", name: "Announcement", icon: <FaTeamspeak /> },
    { path: "/dashboard/assigntasks", name: "Diary", icon: <FaTasks /> },
    { path: "/dashboard/standards", name: "Classes", icon: <FaBars /> },
    { path: "/dashboard/resultprep", name: "Exams", icon: <FaUserTie /> },
    { path: "/dashboard/registration", name: "New User", icon: <FaPlus /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaLock /> },
    { path: "/dashboard/images", name: "Upload Images", icon: <FaImage /> },
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
  ];
 
  const accountantMenuItems = [
    { path: "/dashboard/stafflist", name: "Staff", icon: <FaUserTie /> },
    { path: "/dashboard/feedetail", name: "Fee", icon: <FaWallet /> },
    { path: "/dashboard/standards", name: "Classes", icon: <FaBars /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaCloudUploadAlt /> },
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
  ];

  const sectionHead = [
    { path: "/dashboard/infos", name: "Announcement", icon: <FaTeamspeak /> },
    { path: "/dashboard/assigntasks", name: "Diary", icon: <FaTasks /> },
    { path: "/dashboard/addquestion", name: "Q Bank", icon: <FaQuestion /> },
    { path: "/dashboard/resultprep", name: "Exams", icon: <FaUserTie /> },
    { path: "/dashboard/updateuser", name: "Change PW", icon: <FaLock /> },
    { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout }
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
        <span className="text-left">Welcome, { user.username }!</span>
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