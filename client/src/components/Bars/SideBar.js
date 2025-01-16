// sidebar.js

import React from 'react';
import { FaBars, FaUserGraduate, FaWallet, FaChalkboard, FaClock, FaUserTie,FaClipboardList, FaPenSquare } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import '../CSS/sidebar.css';


// For Students:

// - FaUserGraduate (user graduate icon)
// - FaChild (child icon)
// - FaPencil (pencil icon, can represent learning or writing)
// - FaBook (book icon, represents education or reading)
// - FaIdCard (ID card icon, can represent student ID)

// For Fee Details:

// - FaRupeeSign (rupee sign icon, represents currency or money)
// - FaCreditCard (credit card icon, represents payment method)
// - FaWallet (wallet icon, represents financial transactions)
// - FaFileInvoice (file invoice icon, represents billing or invoices)
// - FaMoneyCheck (money check icon, represents payment or transactions)

const Sidebar = ({ toggle, isOpen }) => {
    const menuItem = [
{ path: "/dashboard/studentlist", name: "Students", icon: <FaUserGraduate /> },
{ path: "/dashboard/feedetail", name: "Fee", icon: <FaWallet /> },
{ path: "/dashboard/stafflist", name: "Staff", icon: <FaUserTie  /> },
{ path: "/dashboard/attendance", name: "Attendance", icon: <FaClock /> },
{ path: "/dashboard/standards", name: "Classes", icon: <FaChalkboard /> },
{ path: "/dashboard/resultprep", name: "Result Prepare", icon: <FaPenSquare /> },
{ path: "/dashboard/result", name: "Result", icon: <FaClipboardList /> },


    ];

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
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
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
