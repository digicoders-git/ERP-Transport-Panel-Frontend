import React, { useState, useEffect, useCallback } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch, 
  MdClose, 
  MdPersonSearch, 
  MdCheckCircle, 
  MdError,
  MdFilterList,
  MdDirectionsBus
} from 'react-icons/md';
import { FaUserGraduate, FaRoute, FaUserTie, FaChevronRight, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { transportAllocationAPI, routeAPI, routeStopAPI, vehicleAPI, studentAPI, staffAPI } from '../api';
import { toast } from 'react-toastify';

const TransportAllocation = () => {
  const [allocations, setAllocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formData, setFormData] = useState({
    userType: 'student',
    studentId: '',
    staffId: '',
    userName: '',
    routeId: '',
    routeStopId: '',
    vehicleId: '',
    monthlyCharges: '',
    service: 'both', // pickup only, drop only, both
    joiningDate: new Date().toISOString().split('T')[0],
    status: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [allocResponse, routeResponse, vehicleResponse] = await Promise.all([
        transportAllocationAPI.getAll(1, 100),
        routeAPI.getAll(1, 100),
        vehicleAPI.getAll(1, 100)
      ]);
      setAllocations(allocResponse.data.allocations || []);
      setRoutes(routeResponse.data.data || routeResponse.data.routes || []);
      setVehicles(vehicleResponse.data.data || vehicleResponse.data.vehicles || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (formData.routeId) {
      fetchStops(formData.routeId);
    } else {
      setStops([]);
    }
  }, [formData.routeId]);

  const fetchStops = async (routeId) => {
    try {
      const response = await routeStopAPI.getByRoute(routeId);
      setStops(response.data.stops || []);
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query, type) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (!query || query.length < 2) {
            setSearchResults([]);
            return;
          }
          try {
            setIsSearching(true);
            let response;
            if (type === 'student') {
              response = await studentAPI.search(query);
              setSearchResults(response.data.data || []);
            } else {
              response = await staffAPI.search(query);
              setSearchResults(response.data.data || []);
            }
          } catch (error) {
            console.error('Search error:', error);
          } finally {
            setIsSearching(false);
          }
        }, 500);
      };
    })(),
    []
  );

  useEffect(() => {
    if (!editingAllocation && userSearch.length >= 2) {
      debouncedSearch(userSearch, formData.userType);
    } else {
      setSearchResults([]);
    }
  }, [userSearch, debouncedSearch, formData.userType, editingAllocation]);

  const selectUser = (user) => {
    const name = formData.userType === 'student' ? `${user.firstName} ${user.lastName}` : user.name;
    setFormData({
      ...formData,
      studentId: formData.userType === 'student' ? user._id : '',
      staffId: formData.userType === 'staff' ? user._id : '',
      userName: name
    });
    setUserSearch(name);
    setSearchResults([]);
    toast.info(`${formData.userType === 'student' ? 'Student' : 'Staff'} selected`);
  };

  const handleAdd = () => {
    setEditingAllocation(null);
    setFormData({
      userType: 'student',
      studentId: '',
      staffId: '',
      userName: '',
      routeId: '',
      routeStopId: '',
      vehicleId: '',
      monthlyCharges: '',
      service: 'both',
      joiningDate: new Date().toISOString().split('T')[0],
      status: true
    });
    setUserSearch('');
    setSearchResults([]);
    setShowModal(true);
  };

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);
    setFormData({
      userType: allocation.userType,
      studentId: allocation.student?._id || allocation.student || '',
      staffId: allocation.staff?._id || allocation.staff || '',
      userName: allocation.userName,
      routeId: allocation.route?._id || allocation.route || '',
      routeStopId: allocation.routeStop?._id || allocation.routeStop || '',
      vehicleId: allocation.vehicle?._id || allocation.vehicle || '',
      monthlyCharges: allocation.monthlyCharges,
      service: allocation.service,
      joiningDate: allocation.joiningDate ? allocation.joiningDate.split('T')[0] : '',
      status: allocation.status
    });
    setUserSearch(allocation.userName);
    setSearchResults([]);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Allocation?',
      text: "This user will be removed from transport services.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#e11d48',
      confirmButtonText: 'Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await transportAllocationAPI.delete(id);
          setAllocations(allocations.filter(a => a._id !== id));
          toast.success('Allocation removed');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.routeId || !formData.routeStopId || !formData.vehicleId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      if (editingAllocation) {
        await transportAllocationAPI.update(editingAllocation._id, formData);
        toast.success('Allocation updated');
      } else {
        await transportAllocationAPI.create(formData);
        toast.success('Allocation created');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredAllocations = allocations.filter(alloc =>
    alloc.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Loading Allocation Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Transport Allocation</h1>
            <p className="text-slate-500 font-medium text-sm">Assign students and staff to transport routes.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
          >
            <MdAdd size={18} /> New Allocation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Enrolled', val: allocations.length, icon: MdDirectionsBus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Students', val: allocations.filter(a => a.userType === 'student').length, icon: FaUserGraduate, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Staff', val: allocations.filter(a => a.userType === 'staff').length, icon: FaUserTie, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active', val: allocations.filter(a => a.status).length, icon: MdCheckCircle, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
            </div>
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-lg`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-800">Enrollment Directory</h2>
          <div className="relative w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route & Stop</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAllocations.map((alloc) => (
                <tr key={alloc._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${alloc.userType === 'student' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {alloc.userName?.charAt(0)}
                      </div>
                      <p className="font-bold text-slate-700">{alloc.userName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${alloc.userType === 'student' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {alloc.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="font-bold text-slate-700">{alloc.route?.routeName || 'N/A'}</p>
                      <p className="text-slate-400 text-[10px]">{alloc.routeStop?.stopName || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-600">{alloc.vehicle?.vehicleNo || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(alloc)} className="text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-md"><MdEdit size={18} /></button>
                      <button onClick={() => handleDelete(alloc._id)} className="text-rose-600 p-1.5 hover:bg-rose-50 rounded-md"><MdDelete size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide">{editingAllocation ? 'Update Allocation' : 'Assign New Transport'}</h3>
                <p className="text-indigo-100 text-[10px] uppercase tracking-widest font-bold mt-1">Enroll users in transport services</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><MdClose size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
              {/* User Selection */}
              <div className="md:col-span-2 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData({...formData, userType: 'student', studentId: '', staffId: '', userName: ''});
                      setUserSearch('');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${formData.userType === 'student' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                  >
                    Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData({...formData, userType: 'staff', studentId: '', staffId: '', userName: ''});
                      setUserSearch('');
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${formData.userType === 'staff' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                  >
                    Staff
                  </button>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Search {formData.userType} in Database</label>
                  <div className="relative">
                    <MdPersonSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Type name to search ${formData.userType}...`}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      readOnly={!!editingAllocation}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm"
                      required
                    />
                    {isSearching && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => selectUser(user)}
                          className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-3 border-b last:border-0"
                        >
                           <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center font-bold text-xs">
                              {(user.firstName || user.name).charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-slate-800 text-xs">{user.firstName ? `${user.firstName} ${user.lastName}` : user.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{user.admissionNumber || user.staffId || 'ID N/A'}</p>
                           </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Route & Stop */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaRoute /> Route *</label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({...formData, routeId: e.target.value, routeStopId: ''})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  required
                >
                  <option value="">Select Route...</option>
                  {routes.map(r => <option key={r._id} value={r._id}>{r.routeName}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt /> Stop *</label>
                <select
                  value={formData.routeStopId}
                  onChange={(e) => setFormData({...formData, routeStopId: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  required
                  disabled={!formData.routeId}
                >
                  <option value="">Select Stop...</option>
                  {stops.map(s => <option key={s._id} value={s._id}>{s.stopName} (Seq: {s.stopOrder})</option>)}
                </select>
              </div>

              {/* Vehicle & Charges */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdDirectionsBus /> Vehicle *</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  required
                >
                  <option value="">Select Vehicle...</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNo} ({v.vehicleType})</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaMoneyBillWave /> Monthly Charges *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.monthlyCharges}
                  onChange={(e) => setFormData({...formData, monthlyCharges: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  required
                />
              </div>

              {/* Service & Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                >
                  <option value="both">Both (Pick & Drop)</option>
                  <option value="pickup only">Pickup Only</option>
                  <option value="drop only">Drop Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  required
                />
              </div>

              <div className="md:col-span-2 pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : editingAllocation ? 'Update Allocation' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportAllocation;
