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
import Addquestion from "../Qbank/Addquestion";
import Addqtopaper from "../Qbank/Addqtopaper";
import Paper from "../Qbank/Paper";
import Infos from "../Info/Infos";
import CreateInfo from "../Info/CreateInfo";
import InfoEdit from "../Info/InfoEdit";
import DateSheetPrint from "../Result/DateSheetPrint";
import DateSheet from "../Result/Datesheet";
import EditPaper from "../Result/EditPaper";
import Assigntasks from "../Assignments/Assigntasks";
import TaskCreate from "../Assignments/TaskCreate";
import TaskEdit from "../Assignments/TaskEdit";
import DynamicDBUser from "../Bars/DynamicDBUser";
import Images from "../Web Images/Images";
import Feemisc from "../Fee/Feemisc";

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
            <Route path="addquestion" element={<Addquestion />} />
            <Route path="addqtopaper" element={<Addqtopaper />} />
            <Route path="paper" element={<Paper />} />
            <Route path="infos" element={<Infos />} />
            <Route path="createinfo" element={<CreateInfo />} />
            <Route path="infoedit/:id" element={<InfoEdit />} />
            <Route path="datesheetprint" element={<DateSheetPrint />} />
            <Route path="datesheet" element={<DateSheet />} />
            <Route path="editpaper/:id" element={<EditPaper />} />
            <Route path="assigntasks" element={<Assigntasks />} />
            <Route path="taskcreate" element={<TaskCreate />} />
            <Route path="taskedit/:syllabus_id" element={<TaskEdit />} />
            <Route path="dynamicdbuser" element={<DynamicDBUser />} />
            <Route path="images" element={<Images />} />
            <Route path="feemisc" element={<Feemisc />} />
          </Routes>
        </div>
      </div>
    );
};

export default Dashboard;
