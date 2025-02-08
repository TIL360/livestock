// dashboard.js
import React, { useState } from "react";
import Sidebar from "./SideBar";
import { Route, Routes } from "react-router-dom";
import StudentList from "../students/StudentList";
import StudentCreate from "../students/StudentCreate";
import StudentEdit from "../students/StudentEdit";
import FeeDetail from "../Fee/FeeDetail";
import FeeCollection from "../Fee/FeeCollection";
import FeePaid from "../Fee/FeePaid";
import UnpaidFee from "../Fee/UnpaidFee";
import Standards from "../standards/standards";
import Standardedit from "../standards/standardedit";
import Standardcreate from "../standards/standardcreate";
import StaffList from "../Staff/StaffList";
import StaffAdd from "../Staff/StaffAdd";
import StaffEdit from "../Staff/StaffEdit";
import Salary from "../salaries/Salary";
import Leaves from "../salaries/Leaves";
import Attendance from "../Attendance/Attendance";
import AttReport from "../Attendance/AttReport";
import ResultPrep from "../Result/ResultPrep";
import Result from "../Result/Result";
import ResultObtMarks from "../Result/ResultObtMarks";
import PRPdf from "../Result/PRPdf";
import Applications from "../Pages/Applications";
import FeeSearch from "../Fee/FeeSearch";
import FeeEdit from "../Fee/FeeEdit";
import Registration from "../User/Registration";
import UpdateUser from "../User/UpdateUser";
import DynamicDB from "./DynamicDB";

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
      <div className="container-fluid">
        <Sidebar toggle={toggleSidebar} isOpen={isOpen} />
        <div className={`main ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Routes>
            <Route index element={<StudentList />} />
            <Route path="studentlist" element={<StudentList />} />
            <Route path="studentcreate" element={<StudentCreate />} />
            <Route path="studentedit/:id" element={<StudentEdit />} />
            <Route path="feedetail" element={<FeeDetail />} />
            <Route path="feecollection/:idf" element={<FeeCollection />} />
            <Route path="feesearch" element={<FeeSearch />} />
            <Route path="feeedit/:idf" element={<FeeEdit />} />
            <Route path="feepaid" element={<FeePaid />} />
            <Route path="unpaidfee" element={<UnpaidFee />} />
            <Route path="standards" element={<Standards />} />
            <Route path="standardedit/:sid" element={<Standardedit />} />
            <Route path="standardcreate" element={<Standardcreate />} />
            <Route path="stafflist" element={<StaffList />} />
            <Route path="staffadd" element={<StaffAdd />} />
            <Route path="staffedit/:staffid" element={<StaffEdit />} />
            <Route path="salary" element={<Salary />} />
            <Route path="leaves/:salaryid" element={<Leaves />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attreport" element={<AttReport />} />
            <Route path="resultprep" element={<ResultPrep />} />
            <Route path="result" element={<Result />} />
            <Route path="resultobtmarks/:resultid" element={<ResultObtMarks />} />
            <Route path="PRPdf/:resultid" element={<PRPdf />} />
            <Route path="applications" element={<Applications />} />
            <Route path="registration" element={<Registration />} />
            <Route path="updateuser" element={<UpdateUser />} />
            <Route path="dynamicdb" element={<DynamicDB />} />
          </Routes>
        </div>
      </div>
    );
};

export default Dashboard;
