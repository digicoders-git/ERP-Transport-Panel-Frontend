import React, { useState, useEffect } from 'react';
import { 
  FaBus, 
  FaRoute, 
  FaUsers, 
  FaCalendar, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaMapMarkerAlt,
  FaPlay,
  FaStop,
  FaClock,
  FaChevronRight,
  FaLocationArrow,
  FaSignal,
  FaHistory
} from 'react-icons/fa';
import { MdTrendingUp, MdLocationSearching, MdVerifiedUser } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { driverDashboardAPI } from '../api';
import { toast } from 'react-toastify';
import useSound from '../hooks/useSound';

const Dashboard = ({ setActivePage }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tripStatus, setTripStatus] = useState('idle'); // idle, picking, dropping
  const [location, setLocation] = useState(null);
  const { playSound } = useSound();
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStops: 0,
    assignment: null,
    routeStops: [],
    driver: null
  });

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await driverDashboardAPI.getStats();
      if (response.data) {
        setStats({
          totalStudents: response.data.stats?.totalStudents || 0,
          totalStops: response.data.stats?.totalStops || 0,
          assignment: response.data.assignment,
          routeStops: response.data.routeStops || [],
          driver: response.data.driver
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const startTrip = (type) => {
    playSound('start');
    setTripStatus(type);
    toast.info(`${type === 'picking' ? 'Student Pickup' : 'Student Drop'} started`);
    
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.error('Location error:', err),
        { enableHighAccuracy: true }
      );
    }
    
    // Redirect to Live Tracking
    setActivePage('route-tracking');
  };

  const endTrip = () => {
    playSound('end');
    setTripStatus('idle');
    setLocation(null);
    toast.success('Trip completed successfully');
  };

  const quickActions = [
    { id: 1, title: 'Transport Registry', icon: FaUsers, bgColor: 'bg-indigo-600', action: () => setActivePage('profile') },
    { id: 2, title: 'Route Details', icon: FaRoute, bgColor: 'bg-indigo-700', action: () => setActivePage('route-details') },
    { id: 3, title: 'Vehicle Checklist', icon: FaBus, bgColor: 'bg-slate-800', action: () => setActivePage('vehicle-checklist') },
    { id: 4, title: 'Complaints', icon: FaExclamationCircle, bgColor: 'bg-rose-600', action: () => setActivePage('emergency-complaints') }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen mt-15">
      {/* Professional Header Section */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                Transport Operations
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase">
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {stats.assignment 
                ? `Assigned Route: ${stats.assignment.route?.routeName} | Bus No: ${stats.assignment.vehicle?.vehicleNo}`
                : "Awaiting route assignments..."}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-slate-600">
            <div className="text-right">
               <p className="text-2xl font-bold tracking-tight text-slate-800 uppercase">
                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Asset Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <div className="space-y-1">
               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                     <MdLocationSearching size={18} />
                  </div>
                  Trip Controls
               </h2>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Manage current route phase</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {tripStatus === 'idle' ? (
              <>
                <button
                  onClick={() => startTrip('picking')}
                  className="flex-1 group bg-indigo-600 p-6 rounded-xl transition-all active:scale-95 text-white shadow-lg shadow-indigo-100"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                      <FaPlay className="ml-0.5" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-1">Inbound Trip</p>
                      <h3 className="text-lg font-bold uppercase tracking-wide">Start Pickup</h3>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => startTrip('dropping')}
                  className="flex-1 group bg-slate-800 p-6 rounded-xl transition-all active:scale-95 text-white shadow-lg shadow-slate-100"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                      <FaPlay size={14} className="ml-0.5" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-1">Outbound Trip</p>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wide">Start Drop</h3>
                    </div>
                  </div>
                </button>
              </>
            ) : (
              <div className="w-full">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl text-indigo-600 border border-slate-100">
                    <FaMapMarkerAlt className="animate-pulse" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Real-time tracking enabled</p>
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                      {tripStatus === 'picking' ? 'Student Pickup Phase' : 'Student Drop Phase'}
                    </h3>
                  </div>
                  <button
                    onClick={endTrip}
                    className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 active:scale-95"
                  >
                    <FaStop size={12} /> 
                    <span>Complete Trip</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Asset Performance Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
          <div className="space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-3 uppercase tracking-wider text-slate-800">
               <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
                  <FaBus size={14} />
               </div>
               Asset Allocation
            </h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm">🆔</div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Vehicle Number</p>
                  <p className="text-lg font-bold text-slate-700">{stats.assignment?.vehicle?.vehicleNo || 'Not Assigned'}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm">🗺️</div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Route</p>
                  <p className="text-md font-bold text-slate-700 truncate max-w-[150px] uppercase">{stats.assignment?.route?.routeName || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActivePage('route-details')}
              className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-200"
            >
              Route Overview <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Assigned Students', val: stats.totalStudents, icon: FaUsers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Route Stops', val: stats.totalStops, icon: FaMapMarkerAlt, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Alerts', val: 0, icon: FaExclamationCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Service Days', val: 24, icon: FaCalendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} w-fit mb-4`}>
              <item.icon size={18} />
            </div>
            <p className="text-3xl font-bold text-slate-800 tracking-tight mb-0.5">{item.val}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`group ${action.bgColor} p-6 rounded-xl shadow-sm transition-all active:scale-95 text-white text-left`}
            >
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                   <Icon />
                </div>
                <p className="font-bold text-md uppercase tracking-wide">{action.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Route List Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">Assigned Stop Sequence</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Timings and locations for current route</p>
          </div>
          <div className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Waypoints</span>
            <span className="text-sm font-bold text-indigo-600">{stats.routeStops.length}</span>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:h-full before:w-px before:-translate-x-1/2 before:bg-slate-100">
            {stats.routeStops.length > 0 ? (
              stats.routeStops.map((stop, index) => (
                <div key={stop._id} className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative z-10 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs shadow-sm">
                      {stop.stopOrder}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-800 text-sm uppercase">{stop.stopName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                         <FaMapMarkerAlt className="text-indigo-400" size={10} /> {stop.stopLocation}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-600">
                         <FaClock size={11} />
                         <p className="text-xs font-bold">{stop.pickupTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm font-medium italic">No route details found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
