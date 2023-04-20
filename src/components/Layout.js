import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "../App.css";

const Layout = () => {
  return (
    <div className="App">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Layout;
