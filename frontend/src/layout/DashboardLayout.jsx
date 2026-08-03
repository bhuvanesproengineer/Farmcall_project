import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content-area">
          <div className="dashboard-content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
