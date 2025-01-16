import React, { useState } from 'react'; 
import { FaBars, FaUserAlt, FaRegChartBar, FaCommentAlt } from "react-icons/fa"; 
import { NavLink } from 'react-router-dom'; 
import '../CSS/sidebar.css';

const Sidebar = ({ children }) => { 
    const [isOpen, setIsOpen] = useState(false); 
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [ 
        { path: "/dashboard/studentlist", name: "Students", icon: <FaUserAlt /> }, 
        { path: "/dashboard/feedetail", name: "Fee", icon: <FaRegChartBar /> }, 
        { path: "/dashboard/standards", name: "Classes", icon: <FaCommentAlt /> } 
    ];

    return ( 
        <div className="container"> 
            <div className={`sidebar ${isOpen ? 'show-sidebar' : ''}`} style={{ width: isOpen ? "200px" : "50px" }}> 
                <div className="top_section"> 
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Logo</h1>
                    <div className="bars" onClick={toggle}>
                        <FaBars />
                    </div>
                </div>
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeClassName="active">
                        <div className="icon">{item.icon}</div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                    </NavLink>
                ))}
            </div>
            <main style={{ flexGrow: 1 }}>{children}</main>
        </div>
    ); 
};

export default Sidebar;
