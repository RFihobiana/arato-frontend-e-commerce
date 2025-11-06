import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../composants/back-office/SideBar";
import "../../styles/back-office/TableauDeBord.css";

const TableauLayout = () => {
  return (
    <div className="dashboard-layout">
      <SideBar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TableauLayout;
