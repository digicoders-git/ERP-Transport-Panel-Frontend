import React, { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaStop, 
  FaMapMarkerAlt, 
  FaUserCheck, 
  FaChevronRight, 
  FaBus, 
  FaRoute,
  FaCheckCircle,
  FaRegCircle,
  FaClock
} from 'react-icons/fa';
import { tripAPI, routeAPI, vehicleAPI } from '../api';
import { toast } from 'react-toastify';

const TripManagement = () => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [stopLogs, setStopLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [startData, setStartData] = useState({ routeId: '', vehicleId: '', type: 'morning' });
  const [attendanceModal, setAttendanceModal] = useState({ show: false, stop: null, students: [], attendance: {} });

  useEffect(() => {
    fetchActiveTrip();
    fetchSetupData();
  }, []);

  const fetchActiveTrip = async () => {
    try {
      const response = await tripAPI.getActiveTrip();
      if (response.data.trip) {
        setActiveTrip(response.data.trip);
        setStopLogs(response.data.stopLogs);
      } else {
        setActiveTrip(null);
        setStopLogs([]);
      }
    } catch (error) {
      console.error('Error fetching active trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetupData = async () => {
    try {
      const [rRes, vRes] = await Promise.all([
        routeAPI.getAll(1, 100),
        vehicleAPI.getAll(1, 100)
      ]);
      setRoutes(rRes.data.routes || []);
      setVehicles(vRes.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching setup data:', error);
    }
  };

  const handleStartTrip = async () => {
    if (!startData.routeId || !startData.vehicleId) {
      return toast.error('Please select route and vehicle');
    }
    try {
      await tripAPI.startTrip(startData);
      toast.success('Trip started successfully!');
      setShowStartModal(false);
      fetchActiveTrip();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error starting trip');
    }
  };

  const handleArrive = async (stopId) => {
    try {
      await tripAPI.arriveAtStop(activeTrip._id, stopId);
      toast.success('Arrived at stop!');
      fetchActiveTrip();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error marking arrival');
    }
  };

  const openAttendance = (log) => {
    const initialAttendance = {};
    log.students.forEach(s => initialAttendance[s._id] = 'present');
    setAttendanceModal({ 
      show: true, 
      stop: log.stop, 
      students: log.students,
      attendance: initialAttendance
    });
  };

  const handleAttendanceSubmit = async () => {
    try {
      const attendanceData = Object.entries(attendanceModal.attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));
      await tripAPI.markAttendance(activeTrip._id, attendanceModal.stop._id, attendanceData);
      toast.success('Attendance marked successfully!');
      setAttendanceModal({ ...attendanceModal, show: false });
      fetchActiveTrip();
    } catch (error) {
      toast.error('Error marking attendance');
    }
  };

  const handleDepart = async (stopId) => {
    try {
      await tripAPI.departStop(activeTrip._id, stopId);
      toast.success('Departed from stop!');
      fetchActiveTrip();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error marking departure');
    }
  };

  const handleEndTrip = async () => {
    if (!window.confirm('Are you sure you want to end this trip?')) return;
    try {
      await tripAPI.endTrip(activeTrip._id);
      toast.success('Trip completed successfully!');
      fetchActiveTrip();
    } catch (error) {
      toast.error('Error ending trip');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6 mt-15 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Trip Management</h1>
          <p className="text-slate-500 text-sm">Monitor and control your transport journey</p>
        </div>
        {!activeTrip && (
          <button 
            onClick={() => setShowStartModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
          >
            <FaPlay /> Start New Trip
          </button>
        )}
      </div>

      {activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stops Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Route Stops Sequence</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  {activeTrip.type} SHIFT
                </span>
              </div>
              <div className="p-6 space-y-8">
                {stopLogs.map((log, index) => {
                  const isCurrent = index === activeTrip.currentStopIndex;
                  const isPast = index < activeTrip.currentStopIndex;
                  const isFuture = index > activeTrip.currentStopIndex;

                  return (
                    <div key={log._id} className={`flex gap-6 relative ${isFuture ? 'opacity-50' : ''}`}>
                      {index !== stopLogs.length - 1 && (
                        <div className={`absolute left-4 top-8 w-0.5 h-full ${isPast ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                      )}
                      
                      <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        isPast ? 'bg-indigo-500 border-indigo-500 text-white' : 
                        isCurrent ? 'bg-white border-indigo-500 text-indigo-500 shadow-lg shadow-indigo-100' : 
                        'bg-white border-slate-300 text-slate-300'
                      }`}>
                        {isPast ? <FaCheckCircle size={14} /> : <span>{index + 1}</span>}
                      </div>

                      <div className="flex-1 space-y-3 pb-8">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-bold ${isCurrent ? 'text-indigo-600' : 'text-slate-800'}`}>
                              {log.stop.stopName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Scheduled: {activeTrip.type === 'morning' ? log.stop.pickupTime : log.stop.dropTime}
                            </p>
                          </div>
                          {log.arrivalTime && (
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-indigo-500 uppercase">Arrived: {new Date(log.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              {log.departureTime && <p className="text-[10px] font-bold text-slate-400 uppercase">Departed: {new Date(log.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
                            </div>
                          )}
                        </div>

                        {isCurrent && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            {log.status === 'pending' && (
                              <button 
                                onClick={() => handleArrive(log.stop._id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                              >
                                <FaMapMarkerAlt /> Mark Arrived
                              </button>
                            )}
                            {log.status === 'arrived' && (
                              <>
                                <button 
                                  onClick={() => openAttendance(log)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                >
                                  <FaUserCheck /> Mark Attendance ({log.students.length})
                                </button>
                                <button 
                                  onClick={() => handleDepart(log.stop._id)}
                                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                >
                                  Depart Stop
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Trip Info Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest border-b pb-4">Trip Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><FaRoute /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Route</p>
                    <p className="font-bold text-slate-700">{activeTrip.route.routeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-lg"><FaBus /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Vehicle</p>
                    <p className="font-bold text-slate-700">{activeTrip.vehicle.vehicleNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><FaClock /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Started At</p>
                    <p className="font-bold text-slate-700">{new Date(activeTrip.startTime).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleEndTrip}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-8 shadow-lg shadow-rose-100"
              >
                End Current Trip
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-3xl">
            <FaBus />
          </div>
          <h2 className="text-xl font-bold text-slate-700">No Active Trip</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Start a new trip to begin tracking stops and student attendance for your assigned route.</p>
          <button 
            onClick={() => setShowStartModal(true)}
            className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Start Trip Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 p-6 text-white">
              <h3 className="text-xl font-bold uppercase tracking-wide">Start New Journey</h3>
              <p className="text-white/70 text-xs mt-1">Select your route and vehicle to begin</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Route</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium"
                  value={startData.routeId}
                  onChange={(e) => setStartData({...startData, routeId: e.target.value})}
                >
                  <option value="">Choose Route...</option>
                  {routes.map(r => <option key={r._id} value={r._id}>{r.routeName} ({r.routeCode})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Vehicle</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium"
                  value={startData.vehicleId}
                  onChange={(e) => setStartData({...startData, vehicleId: e.target.value})}
                >
                  <option value="">Choose Vehicle...</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.model})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift Type</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStartData({...startData, type: 'morning'})}
                    className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest border transition-all ${startData.type === 'morning' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    Morning
                  </button>
                  <button 
                    onClick={() => setStartData({...startData, type: 'evening'})}
                    className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest border transition-all ${startData.type === 'evening' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    Evening
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-4">
              <button 
                onClick={() => setShowStartModal(false)}
                className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleStartTrip}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100"
              >
                Start Trip Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attendanceModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide">Stop Attendance</h3>
                <p className="text-white/50 text-xs mt-1">{attendanceModal.stop?.stopName}</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 text-2xl font-bold">
                  {Object.values(attendanceModal.attendance).filter(v => v === 'present').length}
                </span>
                <span className="text-white/30 text-sm ml-1">/ {attendanceModal.students.length}</span>
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {attendanceModal.students.length > 0 ? (
                <div className="space-y-3">
                  {attendanceModal.students.map(student => (
                    <div key={student._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 overflow-hidden">
                          {student.profileImage ? (
                            <img src={student.profileImage} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><FaUserCheck /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{student.firstName} {student.lastName}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {student.admissionNumber}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setAttendanceModal({
                            ...attendanceModal, 
                            attendance: { ...attendanceModal.attendance, [student._id]: 'present' }
                          })}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${attendanceModal.attendance[student._id] === 'present' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
                        >
                          Picked
                        </button>
                        <button 
                          onClick={() => setAttendanceModal({
                            ...attendanceModal, 
                            attendance: { ...attendanceModal.attendance, [student._id]: 'absent' }
                          })}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${attendanceModal.attendance[student._id] === 'absent' ? 'bg-rose-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-8 italic">No students assigned to this stop.</p>
              )}
            </div>
            <div className="p-6 bg-slate-50 flex gap-4">
              <button 
                onClick={() => setAttendanceModal({ ...attendanceModal, show: false })}
                className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-widest text-xs"
              >
                Close
              </button>
              <button 
                onClick={handleAttendanceSubmit}
                className="flex-1 py-3 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-xs"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
