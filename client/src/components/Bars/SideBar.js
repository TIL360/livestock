import React, { useContext } from 'react';
import { FaBars, FaUserGraduate, FaWallet, FaChalkboard, FaClock, FaUserTie, FaClipboardList, FaPenSquare, FaPaperPlane, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom'; 
import '../CSS/sidebar.css';
import userContext from '../context/UserContext';

const Sidebar = ({ toggle, isOpen }) => {
    const { logout } = useContext(userContext);
    const navigate = useNavigate(); 

    const menuItem = [
        { path: "/dashboard/studentlist", name: "Students", icon: <FaUserGraduate /> },
        { path: "/dashboard/applications", name: "Applications", icon: <FaPaperPlane /> },
        { path: "/dashboard/feedetail", name: "Fee", icon: <FaWallet /> },
        { path: "/dashboard/feecollection", name: "Collection", icon: <FaSearch /> },
        { path: "/dashboard/stafflist", name: "Staff", icon: <FaUserTie /> },
        { path: "/dashboard/attendance", name: "Attendance", icon: <FaClock /> },
        { path: "/dashboard/standards", name: "Classes", icon: <FaChalkboard /> },
        { path: "/dashboard/resultprep", name: "Result Prepare", icon: <FaPenSquare /> },
        { path: "/dashboard/result", name: "Result", icon: <FaClipboardList /> },
        { path: "/", name: "Logout", icon: <FaSignOutAlt />, action: logout } 
    ];

    const handleLogout = () => {
        logout(); // Call the logout function
        navigate('/')
        window.location.reload(); // Refresh the page
    };

    return (
        <div>
            <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <div className="top_section">
                    <div className="bars" onClick={toggle}>
                        <FaBars />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink 
                            to={item.path} 
                            key={index} 
                            className="link" 
                            activeclassname="active" 
                            onClick={item.action && item.name === "Logout" ? handleLogout : null}
                        >
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
        </div>
    );
};

export default Sidebar;
