import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import DriverDashboard from '../pages/DriverDashboard';
import DriverProfile from '../pages/DriverProfile';
import RouteDetails from '../pages/RouteDetails';
import VehicleChecklist from '../pages/VehicleChecklist';
import EmergencyComplaints from '../pages/EmergencyComplaints';
import SalaryDocuments from '../pages/SalaryDocuments';
import Notices from '../pages/Notices';
import ChangePassword from '../pages/ChangePassword';
import DriverMaster from '../pages/DriverMaster';
import VehicleMaster from '../pages/VehicleMaster';
import RouteMaster from '../pages/RouteMaster';
import RouteStop from '../pages/RouteStop';
import RouteCharges from '../pages/RouteCharges';
import RouteTracking from '../pages/RouteTracking';
import TransportAllocation from '../pages/TransportAllocation';
import TransportAssignment from '../pages/TransportAssignment';

const Layout = () => {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('transportActivePage') || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('transportActivePage', activePage);
  }, [activePage]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'driver-dashboard':
        return <DriverDashboard setActivePage={setActivePage} />;
      case 'profile':
        return <DriverProfile />;
      case 'route-details':
        return <RouteDetails />;
      case 'route-tracking':
        return <RouteTracking />;
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
      case 'driver-master':
        return <DriverMaster />;
      case 'vehicle-master':
        return <VehicleMaster />;
      case 'route-master':
        return <RouteMaster />;
      case 'route-stop':
        return <RouteStop />;
      case 'route-charges':
        return <RouteCharges />;
      case 'transport-allocation':
        return <TransportAllocation />;
      case 'transport-assignment':
        return <TransportAssignment />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Navbar 
        toggleSidebar={toggleSidebar} 
        sidebarOpen={sidebarOpen}
      />
      <main className={`pt-20 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="max-w-[1600px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Layout;
