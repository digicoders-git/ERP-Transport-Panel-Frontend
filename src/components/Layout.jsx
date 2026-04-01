import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DriverDashboard from '../pages/DriverDashboard';
import DriverProfile from '../pages/DriverProfile';
import RouteDetails from '../pages/RouteDetails';
import VehicleChecklist from '../pages/VehicleChecklist';
import EmergencyComplaints from '../pages/EmergencyComplaints';
import SalaryDocuments from '../pages/SalaryDocuments';
import Notices from '../pages/Notices';
import ChangePassword from '../pages/ChangePassword';

const Layout = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DriverDashboard setActivePage={setActivePage} />;
      case 'profile':
        return <DriverProfile />;
      case 'route-details':
        return <RouteDetails />;
      case 'vehicle-checklist':
        return <VehicleChecklist />;
      case 'emergency-complaints':
        return <EmergencyComplaints />;
      case 'salary-documents':
        return <SalaryDocuments />;
      case 'notices':
        return <Notices />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return <DriverDashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={onLogout}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {renderPage()}
      </main>
    </div>
  );
};

export default Layout;