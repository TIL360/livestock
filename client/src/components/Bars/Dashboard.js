// dashboard.js
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { Route, Routes } from "react-router-dom";
import AnimalsList from "../animals/AnimalsList";
import AnimalCreate from "../animals/AnimalCreate";
import AnimalsEdit from "../animals/AnimalsEdit";
import AnimalsDied from "../animals/AnimalsDied";
import AnimalsSlaughter from "../animals/AnimalsSlaughter";
import AnimalSold from "../animals/AnimalsSold";
import Applications from "../Pages/Applications";
import ApplyOnline from "../Pages/ApplyOnline";
import Expenses from "../Expenses/Expenses";
import Registration from "../User/Registration";
import UpdateUser from "../User/UpdateUser";
import Infos from "../Info/Infos";
import CreateInfo from "../Info/CreateInfo";
import InfoEdit from "../Info/InfoEdit";
import DynamicDB from "../Bars/DynamicDB";


const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
      <div className="container-fluid">
        <Sidebar toggle={toggleSidebar} isOpen={isOpen} />
        <div className={`main ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Routes>
            <Route index element={<AnimalsList />} />
            <Route path="AnimalsList" element={<AnimalsList />} />
            <Route path="animalcreate" element={<AnimalCreate />} />
            <Route path="animalsedit/:id" element={<AnimalsEdit />} />
            <Route path="animalsdied" element={<AnimalsDied />} />
            <Route path="animalsslaughter" element={<AnimalsSlaughter />} />
            <Route path="animalssold" element={<AnimalSold />} />
            <Route path="applications" element={<Applications />} />
            <Route path="applyonline" element={<ApplyOnline />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="registration" element={<Registration />} />
            <Route path="updateuser" element={<UpdateUser />} />
            <Route path="infos" element={<Infos />} />
            <Route path="createinfo" element={<CreateInfo />} />
            <Route path="infoedit/:id" element={<InfoEdit />} />
            <Route path="dynamicdb" element={<DynamicDB />} />
           
          </Routes>
        </div>
      </div>
    );
};

export default Dashboard;
