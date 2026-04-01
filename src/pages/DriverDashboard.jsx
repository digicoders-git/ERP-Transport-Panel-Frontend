import React, { useState, useEffect } from 'react';
import { FaBus, FaRoute, FaUsers, FaPlay, FaStop, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import useSound from '../hooks/useSound';

const DriverDashboard = ({ setActivePage }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tripStatus, setTripStatus] = useState('idle'); // idle, morning, evening
  const [location, setLocation] = useState(null);
  const { playSound } = useSound();

  const driverId = localStorage.getItem('driverId');
  
  const driverData = {
    DRV001: {
      name: 'Rajesh Kumar',
      busNumber: 'UP-14-AB-1234',
      route: 'Route A - Morning',
      totalStudents: 25,
      nextPickup: 'Green Park - 7:30 AM'
    },
    DRV002: {
      name: 'Suresh Singh',
      busNumber: 'UP-14-CD-5678',
      route: 'Route B - Evening',
      totalStudents: 30,
      nextPickup: 'City Center - 2:00 PM'
    },
    DRV003: {
      name: 'Amit Sharma',
      busNumber: 'UP-14-EF-9012',
      route: 'Route C - Both',
      totalStudents: 28,
      nextPickup: 'Mall Road - 7:45 AM'
    }
  };

  const driver = driverData[driverId] || driverData.DRV001;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startTrip = (type) => {
    playSound('start');
    setTripStatus(type);
    setActivePage('route-details');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  };

  const endTrip = () => {
    playSound('end');
    setTripStatus('idle');
    setLocation(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Driver Dashboard</h1>
        <p className="text-purple-600">Welcome back, {driver.name}</p>
        <p className="text-sm text-blue-500">{currentTime.toLocaleString()}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaBus className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-purple-600">Bus Number</p>
              <p className="text-xl font-semibold text-blue-700">{driver.busNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaRoute className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-purple-600">Route</p>
              <p className="text-xl font-semibold text-green-700">{driver.route}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaUsers className="text-pink-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-purple-600">Total Students</p>
              <p className="text-xl font-semibold text-pink-700">{driver.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaClock className="text-indigo-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-purple-600">Next Pickup</p>
              <p className="text-sm font-semibold text-indigo-700">{driver.nextPickup}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Control */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Trip Control</h2>
        <div className="flex gap-4">
          {tripStatus === 'idle' && (
            <>
              <button
                onClick={() => startTrip('morning')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2 cursor-pointer"
              >
                <FaPlay />Pick-Up
              </button>
              <button
                onClick={() => startTrip('evening')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-2 cursor-pointer"
              >
                <FaPlay />Drop
              </button>
            </>
          )}
          
          {tripStatus !== 'idle' && (
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <FaMapMarkerAlt className="inline mr-2" />
                {tripStatus === 'morning' ? 'Morning Trip Active' : 'Evening Trip Active'}
              </div>
              <button
                onClick={endTrip}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2 cursor-pointer"
              >
                <FaStop /> End Trip
              </button>
            </div>
          )}
        </div>
        
        {location && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
          </div>
        )}
      </div>

      {/* Today's Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">Morning Trip</h3>
            <p className="text-sm text-green-600">Status: Completed</p>
            <p className="text-sm text-green-600">Students: 25/25</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">Evening Trip</h3>
            <p className="text-sm text-blue-600">Status: Pending</p>
            <p className="text-sm text-blue-600">Students: 0/25</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;