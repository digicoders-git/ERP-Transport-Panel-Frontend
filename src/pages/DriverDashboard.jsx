import React, { useState, useEffect } from 'react';
import { 
  FaBus, 
  FaRoute, 
  FaUsers, 
  FaPlay, 
  FaStop, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChevronRight,
  FaSignal,
  FaUserCircle
} from 'react-icons/fa';
import { MdMyLocation, MdOutlineDoneAll, MdTimer } from 'react-icons/md';
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
      role: 'Staff Driver',
      busNumber: 'UP-14-AB-1234',
      route: 'North Route - Morning',
      totalStudents: 25,
      nextPickup: 'Green Park - 07:30'
    },
    DRV002: {
      name: 'Suresh Singh',
      role: 'Head Driver',
      busNumber: 'UP-14-CD-5678',
      route: 'Central Route',
      totalStudents: 30,
      nextPickup: 'City Center - 14:00'
    },
    DRV003: {
      name: 'Amit Sharma',
      role: 'Senior Driver',
      busNumber: 'UP-14-EF-9012',
      route: 'East Route',
      totalStudents: 28,
      nextPickup: 'Mall Road - 07:45'
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
    setActivePage('route-tracking');
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
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Driver Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-3xl border border-indigo-100">
                 <FaUserCircle />
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                       {driver.role}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Available
                    </span>
                 </div>
                 <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase">{driver.name}</h1>
                 <p className="text-slate-500 font-medium text-sm">Transport Operations Dashboard</p>
              </div>
           </div>

           <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-slate-700">
                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">
                 {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Assigned Bus', val: driver.busNumber, icon: FaBus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Assigned Route', val: driver.route, icon: FaRoute, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Student List', val: driver.totalStudents, icon: FaUsers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Next Stop', val: driver.nextPickup, icon: FaClock, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                   <item.icon size={20} />
                </div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
             <p className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Control Module */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="space-y-1 lg:w-1/4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
             <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Trip Control</h2>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Start or end current route</p>
             {location && (
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                   <FaSignal className="text-emerald-500 text-xs" />
                   <span className="text-[10px] font-bold text-slate-600 uppercase">GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                </div>
             )}
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
            {tripStatus === 'idle' ? (
              <>
                <button
                  onClick={() => startTrip('morning')}
                  className="flex-1 bg-indigo-600 p-6 rounded-xl text-white transition-all active:scale-95 shadow-lg shadow-indigo-100 text-left relative overflow-hidden group"
                >
                   <div className="relative z-10 flex items-center justify-between">
                      <div>
                         <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-1">Morning Route</p>
                         <h3 className="text-xl font-bold uppercase tracking-wide">Pickup Phase</h3>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                         <FaPlay className="ml-0.5" />
                      </div>
                   </div>
                </button>
                <button
                  onClick={() => startTrip('evening')}
                  className="flex-1 bg-slate-800 p-6 rounded-xl text-white transition-all active:scale-95 shadow-lg shadow-slate-100 text-left relative overflow-hidden group"
                >
                   <div className="relative z-10 flex items-center justify-between">
                      <div>
                         <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-1">Evening Route</p>
                         <h3 className="text-xl font-bold uppercase tracking-wide">Drop Phase</h3>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg text-indigo-400">
                         <FaPlay className="ml-0.5" />
                      </div>
                   </div>
                </button>
              </>
            ) : (
              <div className="flex-1 p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl text-indigo-600 border border-slate-100">
                      <MdMyLocation className="animate-pulse" />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                         {tripStatus === 'morning' ? 'Pickup Phase Active' : 'Drop Phase Active'}
                      </h3>
                      <p className="text-indigo-400 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 mt-0.5">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Tracking Enabled
                      </p>
                   </div>
                </div>
                <button
                  onClick={endTrip}
                  className="w-full md:w-auto px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaStop size={12} /> Complete Trip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Module */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
        <h2 className="text-lg font-bold mb-8 text-slate-800 flex items-center gap-3 uppercase tracking-tight">
           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <MdOutlineDoneAll size={18} />
           </div>
           Operational Log
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Morning Pickup</h3>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded text-[9px] font-bold uppercase tracking-widest">Done</span>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest flex items-center gap-2">
                   <MdTimer /> Time: 42 mins
                </p>
                <p className="text-xl font-bold text-emerald-900 tracking-tight">25 Students Verified</p>
             </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Evening Drop</h3>
                <span className="px-3 py-1 bg-slate-200 text-slate-500 rounded text-[9px] font-bold uppercase tracking-widest">Pending</span>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <MdTimer /> Estimated: 45 mins
                </p>
                <p className="text-xl font-bold text-slate-400 italic tracking-tight">Not Started</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;