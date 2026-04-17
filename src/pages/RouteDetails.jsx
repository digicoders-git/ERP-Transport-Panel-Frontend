import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock, 
  FaPhone, 
  FaSchool, 
  FaBus, 
  FaRoute, 
  FaChevronRight, 
  FaIdCard,
  FaShieldAlt
} from 'react-icons/fa';
import { MdOutlineAdminPanelSettings, MdVerified, MdGpsFixed, MdTimer, MdMyLocation } from 'react-icons/md';
import { driverDashboardAPI } from '../api';
import { toast } from 'react-toastify';

const RouteDetails = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    assignment: null,
    routeStops: [],
    students: []
  });

  useEffect(() => {
    fetchRouteDetails();
  }, []);

  const fetchRouteDetails = async () => {
    try {
      setLoading(true);
      const response = await driverDashboardAPI.getRouteDetails();
      if (response.data) {
        setData({
          assignment: response.data.assignment,
          routeStops: response.data.routeStops || [],
          students: response.data.students || []
        });
      }
    } catch (error) {
      console.error('Error fetching route details:', error);
      toast.error('Failed to sync route information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Route Data...</p>
        </div>
      </div>
    );
  }

  if (!data.assignment) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 text-center shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRoute className="text-slate-200 text-3xl" />
           </div>
           <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">No Route Assigned</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto mt-2 leading-relaxed">No active route assignment has been identified for your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                    Route Information
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-bold border border-emerald-100 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                 </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase leading-tight">{data.assignment.route?.routeName}</h1>
              <p className="text-slate-500 font-medium text-sm">Route Identifier: {data.assignment.route?.routeCode}</p>
           </div>
           
           <div className="bg-slate-50 rounded-xl px-6 py-4 border border-slate-100 text-right min-w-[180px]">
              <div className="flex items-center justify-end gap-2 text-indigo-400 mb-1">
                 <MdVerified size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Route Code</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 leading-none">#{data.assignment.route?.routeCode?.slice(-4) || '2045'}</p>
           </div>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 tracking-wider mb-6 flex items-center gap-3 uppercase">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                <FaBus size={14} />
             </div>
             Vehicle Details
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Asset Number', val: data.assignment.vehicle?.vehicleNo, icon: FaBus },
              { label: 'Vehicle Type', val: data.assignment.vehicle?.vehicleType, icon: FaShieldAlt },
              { label: 'Student Capacity', val: `${data.assignment.vehicle?.vehicleCapacity} Seats`, icon: FaUsers }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-white">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-white text-indigo-500 rounded-lg border border-slate-100 shadow-sm">
                      <item.icon size={16} />
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-md font-bold text-slate-800 tracking-tight">{item.val || 'N/A'}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 tracking-wider mb-6 flex items-center gap-3 uppercase">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                <FaRoute size={14} />
             </div>
             Route Parameters
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Start Hub', val: data.assignment.route?.startPoint, icon: MdMyLocation },
              { label: 'End Point', val: data.assignment.route?.endPoint, icon: MdGpsFixed },
              { label: 'Route Length', val: `${data.assignment.route?.totalDistance} KM`, icon: MdTimer }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-white">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-white text-emerald-500 rounded-lg border border-slate-100 shadow-sm">
                      <item.icon size={16} />
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-md font-bold text-slate-800 tracking-tight">{item.val || 'N/A'}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Sequence */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
           <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                 <FaMapMarkerAlt size={14} />
              </div>
              Stops & Timings
           </h2>
           <span className="px-3 py-1 bg-slate-800 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm">
              {data.routeStops.length} Checked Waypoints
           </span>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {data.routeStops.map((stop, index) => (
            <React.Fragment key={stop._id}>
              <div className="min-w-[240px] p-6 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50">
                <div className="flex items-start justify-between mb-6">
                   <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-100">
                      {stop.stopOrder}
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-md font-bold text-slate-800 tracking-tight uppercase leading-tight">{stop.stopName}</p>
                   </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-50 shadow-sm">
                     <MdTimer size={14} className="text-indigo-400" />
                     <div className="flex-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Pickup Time</p>
                        <p className="font-bold text-slate-700 text-xs leading-none">{stop.pickupTime}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-50 shadow-sm">
                     <FaClock size={12} className="text-rose-400" />
                     <div className="flex-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Drop Time</p>
                        <p className="font-bold text-slate-700 text-xs leading-none">{stop.dropTime}</p>
                     </div>
                  </div>
                </div>
              </div>
              {index < data.routeStops.length - 1 && (
                <div className="flex-shrink-0">
                   <FaChevronRight className="text-slate-200" size={12} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Personnel Manifest */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
             <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">Assigned Student List</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Member manifest for current deployment</p>
             </div>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-100 rounded-lg shadow-sm text-center">
             <p className="text-lg font-bold text-indigo-600 leading-none">{data.students.length}</p>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 leading-none">Registered</p>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Student Details</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Grade/Roll</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Pickup Hub</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.students.length > 0 ? (
                data.students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600 border border-slate-200 text-xs">
                             {(student.userName || student.student?.studentName || 'N').charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="font-bold text-slate-800 text-sm mb-0.5">{student.userName || student.student?.studentName || 'N/A'}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: #{(student.student?._id || student._id)?.slice(-6).toUpperCase()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div>
                          <p className="font-bold text-slate-700 text-xs uppercase">{student.userType || 'N/A'} {student.student?.class ? ` - ${student.student.class}` : ''}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Roll: {student.student?.rollNo || 'N/A'}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-xs font-bold text-slate-500 uppercase">{student.routeStop?.stopName || 'HUB NOT ASSIGNED'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm shadow-emerald-50/50">
                          <MdVerified size={12} /> {student.routeStop?.pickupTime || '00:00'}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active member data identified.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;
