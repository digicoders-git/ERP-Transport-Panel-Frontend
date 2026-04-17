import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPhone, 
  FaUser, 
  FaClock, 
  FaLocationArrow, 
  FaCheckDouble,
  FaSignal,
  FaStreetView,
  FaChevronRight,
  FaUsers,
  FaBus,
  FaExclamationTriangle,
  FaFlagCheckered
} from 'react-icons/fa';
import { MdMyLocation, MdOutlineDoneAll, MdTimer, MdGpsFixed, MdVerifiedUser, MdErrorOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const RouteTracking = () => {
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [currentStop, setCurrentStop] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState('Initializing GPS...');
  const [gpsStatus, setGpsStatus] = useState('connecting'); // connecting, active, error
  const [gpsErrorMessage, setGpsErrorMessage] = useState('');

  useEffect(() => {
    fetchTodayRoute();
    const watchId = startLocationTracking();
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const fetchTodayRoute = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transport-panel/attendance/today-route', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRouteData(data);
        if (data.routeStops?.length > 0) {
          setCurrentStop(data.routeStops[0]);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Sync failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGpsStatus('active');
          setGpsErrorMessage('');
          getLocationName(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGpsStatus('error');
          let msg = 'GPS link unstable';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              msg = "Location access denied. Please enable GPS.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              msg = "GPS request timed out.";
              break;
          }
          setGpsErrorMessage(msg);
          toast.error(msg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsStatus('error');
      setGpsErrorMessage("GPS not supported on this browser.");
      return null;
    }
  };

  const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      setLocation(data.address?.city || data.address?.town || data.address?.suburb || 'Stationary');
    } catch (error) {
      setLocation('In Transit');
    }
  };

  const handleAttendance = async (studentId, status) => {
    if (!currentStop) {
      toast.error('Select a verified stop first');
      return;
    }

    try {
      const response = await fetch('/api/transport-panel/attendance/mark-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          routeStopId: currentStop._id,
          attendanceType: 'pickup',
          status,
          latitude,
          longitude,
          location
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSelectedStudents(prev => ({
          ...prev,
          [studentId]: status
        }));
        toast.success(`Attendance: ${status.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Attendance error:', error);
      toast.error('Attendance sync failed');
    }
  };

  const handleDeparture = async () => {
    if (!currentStop) return;

    const result = await Swal.fire({
      title: 'Confirm Departure?',
      text: `Departing from ${currentStop.stopName}. Notifications will be sent.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Depart',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-8 py-3 font-bold',
        cancelButton: 'rounded-lg px-8 py-3 font-bold'
      }
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch('/api/transport-panel/attendance/update-stop-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          routeStopId: currentStop._id,
          status: 'departed',
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success(`Departed. Notifications sent.`);
        
        const currentIndex = routeData.routeStops.findIndex(s => s._id === currentStop._id);
        if (currentIndex < routeData.routeStops.length - 1) {
          setCurrentStop(routeData.routeStops[currentIndex + 1]);
          setSelectedStudents({});
        } else {
          toast.info('Route sequence finished');
        }
      }
    } catch (error) {
      console.error('Departure error:', error);
      toast.error('Departure log failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Telemetry...</p>
        </div>
      </div>
    );
  }

  if (!routeData || !currentStop) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSignal className="text-slate-300 text-3xl" />
           </div>
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">NO ACTIVE TRIP</h2>
           <p className="text-slate-500 font-medium max-w-xs mx-auto mt-1 text-sm">Waiting for trip assignment from admin office.</p>
           <button 
             onClick={fetchTodayRoute}
             className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all"
           >
             Retry Sync
           </button>
        </div>
      </div>
    );
  }

  const stopStudents = routeData.stopWiseStudents?.[currentStop._id] || [];
  const attendanceComplete = stopStudents.length === 0 || stopStudents.every(s => selectedStudents[s._id]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Real-time Tracking Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                  Live tracking
               </span>
               <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold border ${
                 gpsStatus === 'active' 
                   ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                   : gpsStatus === 'error' 
                   ? 'bg-rose-50 text-rose-600 border-rose-100'
                   : 'bg-amber-50 text-amber-600 border-amber-100'
               }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${gpsStatus === 'active' ? 'bg-emerald-600 animate-pulse' : gpsStatus === 'error' ? 'bg-rose-600' : 'bg-amber-600 animate-pulse'}`}></span> 
                  {gpsStatus === 'active' ? 'GPS ACTIVE' : gpsStatus === 'error' ? 'GPS ERROR' : 'CONNECTING GPS...'}
               </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">TRIP DASHBOARD</h1>
              <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5 mt-0.5 uppercase tracking-wide">
                <FaLocationArrow className="text-xs" /> {gpsStatus === 'error' ? gpsErrorMessage : location}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 min-w-[200px]">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <MdGpsFixed className="text-sm" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Global Coordinates</span>
            </div>
            {gpsStatus === 'active' ? (
              <p className="text-xl font-bold font-mono tracking-tight text-slate-700">
                {latitude?.toFixed(4)} <span className="text-slate-300 mx-1">/</span> {longitude?.toFixed(4)}
              </p>
            ) : (
              <p className="text-sm font-bold text-rose-400 italic">No GPS Lock</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Stop Status */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Current Destination</p>
               <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                     <FaMapMarkerAlt size={20} />
                  </div>
                  {currentStop.stopName}
               </h2>
               <p className="text-slate-400 font-medium text-xs ml-12">{currentStop.stopLocation}</p>
            </div>
            <div className="text-right hidden sm:block">
               <span className="px-3 py-1 bg-slate-800 text-white rounded text-[10px] font-bold uppercase tracking-widest">
                  Stop #{currentStop.stopOrder}
               </span>
               <p className="text-xl font-bold text-indigo-600 mt-2 tracking-tight">{stopStudents.length} Students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Scheduled Arrival</p>
                <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
                   <FaClock className="text-sm opacity-50" /> {currentStop.pickupTime}
                </div>
             </div>
             <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Scheduled Departure</p>
                <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
                   <FaClock className="text-sm opacity-50" /> {currentStop.dropTime}
                </div>
             </div>
          </div>

          <div className="space-y-3">
             <button
               disabled={!attendanceComplete}
               onClick={handleDeparture}
               className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95 group ${
                 attendanceComplete 
                   ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer' 
                   : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
               }`}
             >
               <FaCheckDouble size={16} /> 
               <span>MARK DEPARTURE FROM {currentStop.stopName.toUpperCase()}</span>
             </button>
             {!attendanceComplete && (
               <p className="text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center gap-2">
                  <FaExclamationTriangle /> Please mark all students before departing
               </p>
             )}
          </div>
        </div>

        {/* Student Verification */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2 uppercase">
               <FaUsers className="text-indigo-600" /> Student List
            </h3>
            <p className="text-xs text-slate-400 font-medium">Verification for current sequence</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[450px] pr-1 custom-scrollbar">
            {stopStudents.length > 0 ? (
              stopStudents.map((student) => (
                <div key={student._id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4 transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center font-bold text-indigo-600 text-sm border border-indigo-100">
                        {(student.student?.name || student.userName || '?').charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm leading-none mb-1 truncate">{student.student?.name || student.userName || 'Unknown Student'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                           {student.student?.class ? `Class ${student.student.class}` : student.userType || 'Student'} • {student.student?.rollNo ? `Roll ${student.student.rollNo}` : `ID: ${student._id?.slice(-6)}`}
                        </p>
                     </div>
                     {(student.student?.parentPhone) && (
                        <a 
                          href={`tel:${student.student.parentPhone}`}
                          className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                           <FaPhone size={12} />
                        </a>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAttendance(student._id, 'present')}
                      className={`py-2 rounded font-bold uppercase tracking-wider text-[9px] transition-all flex items-center justify-center gap-1.5 border ${
                        selectedStudents[student._id] === 'present'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-100 text-emerald-600 hover:border-emerald-600'
                      }`}
                    >
                      <FaCheckCircle /> BOARDED
                    </button>
                    <button
                      onClick={() => handleAttendance(student._id, 'absent')}
                      className={`py-2 rounded font-bold uppercase tracking-wider text-[9px] transition-all flex items-center justify-center gap-1.5 border ${
                        selectedStudents[student._id] === 'absent'
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-white border-slate-100 text-rose-600 hover:border-rose-600'
                      }`}
                    >
                      <FaTimesCircle /> NO SHOW
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-300">
                <FaUsers size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-bold uppercase tracking-widest italic">No students expected here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Route Progress Visual Tracker */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                 <FaStreetView />
              </div>
              Real-time Route Progress
           </h3>
           <div className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
              Trip Stats: {routeData.routeStops?.findIndex(s => s._id === currentStop?._id) + 1} / {routeData.routeStops?.length || 0} COMPLETED
           </div>
        </div>

        {/* Vertical Stepper UI */}
        <div className="relative pl-8 space-y-12">
           {/* Vertical Line */}
           <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5 bg-slate-100">
              <div 
                className="absolute top-0 w-full bg-emerald-500 transition-all duration-1000"
                style={{ height: `${(routeData.routeStops?.findIndex(s => s._id === currentStop?._id) / (routeData.routeStops?.length - 1)) * 100}%` }}
              ></div>
           </div>

           {routeData.routeStops?.map((stop, index) => {
             const currentIndex = routeData.routeStops.findIndex(s => s._id === currentStop?._id);
             const isCompleted = index < currentIndex;
             const isActive = index === currentIndex;
             const isPending = index > currentIndex;
             const isLast = index === routeData.routeStops.length - 1;

             return (
               <div key={stop._id} className="relative flex items-start gap-8 group">
                  {/* Circle Indicator */}
                  <div className={`absolute -left-8 w-6 h-6 rounded-full border-4 z-10 transition-all duration-500 flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-emerald-500 border-white shadow-lg shadow-emerald-100' 
                      : isActive 
                      ? 'bg-indigo-600 border-white shadow-lg shadow-indigo-100 animate-pulse scale-110' 
                      : 'bg-white border-slate-200'
                  }`}>
                    {isCompleted && <FaCheckCircle size={10} className="text-white" />}
                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    {isLast && isPending && <FaFlagCheckered size={10} className="text-slate-300" />}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 p-6 rounded-2xl border transition-all duration-500 ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 shadow-xl text-white -translate-y-1' 
                      : isCompleted 
                      ? 'bg-white border-slate-100 opacity-60' 
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                                Stop #{stop.stopOrder}
                             </span>
                             {isCompleted && (
                                <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                                   <FaCheckCircle size={8} /> COMPLETED
                                </span>
                             )}
                          </div>
                          <h4 className="text-lg font-bold tracking-tight uppercase leading-none">{stop.stopName}</h4>
                          <p className={`text-xs font-medium ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{stop.stopLocation}</p>
                       </div>

                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>Scheduled</p>
                             <div className={`flex items-center gap-2 font-bold text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                <FaClock className="text-xs opacity-50" /> {stop.pickupTime}
                             </div>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                             isActive ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'
                          }`}>
                             {isActive ? <MdMyLocation className="animate-pulse" /> : <FaMapMarkerAlt />}
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default RouteTracking;
