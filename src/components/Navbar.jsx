import React, { useState, useEffect } from 'react';
import { FaBars, FaBus } from 'react-icons/fa';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const driverId = localStorage.getItem('driverId');
  
  const driverNames = {
    'DRV001': 'Rajesh Kumar',
    'DRV002': 'Suresh Singh', 
    'DRV003': 'Amit Sharma'
  };
  
  const driverPhotos = {
    'DRV001': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    'DRV002': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    'DRV003': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  };
  
  const driverName = driverNames[driverId] || 'Driver';
  const driverPhoto = driverPhotos[driverId];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <nav className={`bg-white shadow-lg border-b border-gray-200 px-6 py-4 fixed top-0 right-0 z-10 transition-all duration-300 ${
      sidebarOpen ? 'left-64' : 'left-16'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FaBars className="text-xl text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">School Driver Panel</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">{formatTime(currentTime)}</div>
            <div className="text-xs text-gray-500">{formatDate(currentTime)}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200">
                {driverPhoto ? (
                  <img 
                    src={driverPhoto} 
                    alt={driverName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center" style={{display: driverPhoto ? 'none' : 'flex'}}>
                  <FaBus className="text-white text-lg" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{driverName}</div>
                <div className="text-xs text-gray-500">{driverId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;