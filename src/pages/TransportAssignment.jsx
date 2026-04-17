import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdAssignment, MdClose, MdPerson, MdDirectionsBus, MdRoute, MdCalendarToday, MdCheckCircle, MdCancel } from 'react-icons/md';
import { FaUserShield, FaBusAlt, FaMapMarkedAlt, FaHistory } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { transportAssignmentAPI, driverAPI, vehicleAPI, routeAPI } from '../api';
import { toast } from 'react-toastify';

const TransportAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    driverId: '',
    vehicleId: '',
    routeId: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [assignResponse, driverResponse, vehicleResponse, routeResponse] = await Promise.all([
        transportAssignmentAPI.getAll(1, 100),
        driverAPI.getAll(1, 100),
        vehicleAPI.getAll(1, 100),
        routeAPI.getAll(1, 100)
      ]);
      setAssignments(assignResponse.data.data || []);
      setDrivers(driverResponse.data.data || []);
      setVehicles(vehicleResponse.data.data || []);
      setRoutes(routeResponse.data.data || []);
    } catch (error) {
      toast.error('Failed to load assignment data');
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assign => {
    const driver = drivers.find(d => d._id === assign.driverId);
    const vehicle = vehicles.find(v => v._id === assign.vehicleId);
    return driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicle?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAdd = () => {
    setEditingAssignment(null);
    setFormData({ driverId: '', vehicleId: '', routeId: '', startDate: '', endDate: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      driverId: assignment.driverId || '',
      vehicleId: assignment.vehicleId || '',
      routeId: assignment.routeId || '',
      startDate: assignment.startDate?.split('T')[0] || '',
      endDate: assignment.endDate?.split('T')[0] || '',
      status: assignment.status ? 'active' : 'inactive'
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Assignment?',
      text: "This link will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#e11d48',
      confirmButtonText: 'Delete',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-6 py-2.5 font-bold',
        cancelButton: 'rounded-lg px-6 py-2.5 font-bold'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await transportAssignmentAPI.delete(id);
          setAssignments(assignments.filter(a => a._id !== id));
          toast.success('Assignment deleted');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.driverId || !formData.vehicleId || !formData.routeId) {
      toast.error('Missing required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        status: formData.status === 'active'
      };

      if (editingAssignment) {
        await transportAssignmentAPI.update(editingAssignment._id, payload);
        toast.success('Assignment updated');
      } else {
        await transportAssignmentAPI.create(payload);
        toast.success('Assignment created');
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading Assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                  Fleet Management
               </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">TRANSPORT ASSIGNMENT</h1>
            <p className="text-slate-500 font-medium text-sm">Coordinate drivers, vehicles, and routes.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <MdAdd size={18} /> New Assignment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Assignments', val: assignments.length, icon: FaHistory, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Service', val: assignments.filter(a => a.status).length, icon: MdCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Vehicles Used', val: `${new Set(assignments.map(a => a.vehicleId)).size} Units`, icon: FaBusAlt, color: 'text-blue-600', bg: 'bg-blue-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} tracking-tight`}>{stat.val}</p>
            </div>
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-lg`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Assignment Directory</h2>
          
          <div className="relative group w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search driver or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff & Vehicle</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Period</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const driver = drivers.find(d => d._id === assignment.driverId);
                  const vehicle = vehicles.find(v => v._id === assignment.vehicleId);
                  const route = routes.find(r => r._id === assignment.routeId);
                  return (
                    <tr key={assignment._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="flex -space-x-2 shrink-0">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-white flex items-center justify-center text-indigo-600">
                                 <MdPerson size={16} />
                              </div>
                              <div className="w-8 h-8 rounded-full bg-blue-50 border border-white flex items-center justify-center text-blue-600">
                                 <FaBusAlt size={14} />
                              </div>
                           </div>
                           <div>
                              <p className="font-bold text-slate-800 leading-none mb-1">{driver?.name || 'N/A'}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plate: {vehicle?.vehicleNumber || 'N/A'}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded text-[11px] font-bold text-slate-600 border border-slate-100">
                            <MdRoute size={14} className="text-indigo-400" />
                            <span>{route?.routeName || 'N/A'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] font-bold text-slate-700">{assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : '--'}</p>
                            <div className="w-full h-px bg-slate-100"></div>
                            <p className="text-[10px] font-bold text-slate-400">{assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'Active'}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          assignment.status 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {assignment.status ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button 
                            onClick={() => handleEdit(assignment)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(assignment._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <p className="text-slate-400 font-medium text-sm italic">No assignments found in directory.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                   {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Link staff and vehicle to a specific route.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Assign Driver *</label>
                 <select
                   value={formData.driverId}
                   onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                   className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none"
                   required
                 >
                   <option value="">Select Driver...</option>
                   {drivers.map(driver => <option key={driver._id} value={driver._id}>{driver.name}</option>)}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Vehicle Unit *</label>
                    <select
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none"
                      required
                    >
                      <option value="">Select Vehicle...</option>
                      {vehicles.map(vehicle => <option key={vehicle._id} value={vehicle._id}>{vehicle.vehicleNumber}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Route Gateway *</label>
                    <select
                      value={formData.routeId}
                      onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none"
                      required
                    >
                      <option value="">Select Route...</option>
                      {routes.map(route => <option key={route._id} value={route._id}>{route.routeName}</option>)}
                    </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Start Date</label>
                     <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">End Date</label>
                     <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                     />
                  </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Status</label>
                 <select
                   value={formData.status}
                   onChange={(e) => setFormData({...formData, status: e.target.value})}
                   className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none"
                 >
                   <option value="active">Active Assignment</option>
                   <option value="inactive">Expired / On Hold</option>
                 </select>
               </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all shadow-sm disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : editingAssignment ? 'Save Changes' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportAssignment;
