import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../composants/back-office/SideBar";
import Header from "../../composants/back-office/Header";
import "../../styles/back-office/TableauDeBord.css";

const TableauLayout = () => {
  return (
    <div className="dashboard-layout">
      <SideBar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TableauLayout;