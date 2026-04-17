import React, { useState, useEffect, useCallback } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch, 
  MdLocationCity, 
  MdClose, 
  MdPersonSearch, 
  MdDirectionsBus, 
  MdCheckCircle, 
  MdError,
  MdFilterList,
  MdOutlineAssignmentTurnedIn
} from 'react-icons/md';
import { FaUserGraduate, FaRoute, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { transportAllocationAPI, routeAPI, studentAPI } from '../api';
import { toast } from 'react-toastify';

const TransportAllocation = () => {
  const [allocations, setAllocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [studentSearch, setStudentSearch] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentEmail: '',
    routeId: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [allocResponse, routeResponse] = await Promise.all([
        transportAllocationAPI.getAll(1, 100),
        routeAPI.getAll(1, 100)
      ]);
      setAllocations(allocResponse.data.data || []);
      setRoutes(routeResponse.data.data || []);
    } catch (error) {
      toast.error('Failed to load allocation data');
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const debouncedStudentSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (!query || query.length < 2) {
            setStudentResults([]);
            return;
          }
          try {
            setIsSearchingStudents(true);
            const response = await studentAPI.search(query);
            setStudentResults(response.data.data || []);
          } catch (error) {
            console.error('Student search error:', error);
          } finally {
            setIsSearchingStudents(false);
          }
        }, 500);
      };
    })(),
    []
  );

  useEffect(() => {
    if (!editingAllocation && studentSearch.length >= 2) {
      debouncedStudentSearch(studentSearch);
    } else {
        setStudentResults([]);
    }
  }, [studentSearch, debouncedStudentSearch, editingAllocation]);

  const selectStudent = (student) => {
    setFormData({
      ...formData,
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentEmail: student.email
    });
    setStudentSearch(`${student.firstName} ${student.lastName}`);
    setStudentResults([]);
    toast.info(`Student selected`);
  };

  const filteredAllocations = allocations.filter(alloc =>
    alloc.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alloc.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAllocation(null);
    setFormData({ studentId: '', studentName: '', studentEmail: '', routeId: '', status: 'active' });
    setStudentSearch('');
    setStudentResults([]);
    setShowModal(true);
  };

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);
    setFormData({
      studentId: allocation.studentId || '',
      studentName: allocation.studentName || '',
      studentEmail: allocation.studentEmail || '',
      routeId: allocation.routeId || '',
      status: allocation.status ? 'active' : 'inactive'
    });
    setStudentSearch(allocation.studentName || '');
    setStudentResults([]);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Allocation?',
      text: "This student will be removed from transport services.",
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
    if (!formData.studentName || !formData.routeId) {
      toast.error('Please select student and route');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        status: formData.status === 'active'
      };

      if (editingAllocation) {
        await transportAllocationAPI.update(editingAllocation._id, payload);
        toast.success('Allocation updated');
      } else {
        await transportAllocationAPI.create(payload);
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

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading Allocation Registry...</p>
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
                  Student Enrollment
               </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">TRANSPORT ALLOCATION</h1>
            <p className="text-slate-500 font-medium text-sm">Assign students to specific transport routes.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <MdAdd size={18} /> New Allocation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Enrolled', val: allocations.length, icon: FaUserGraduate, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Service', val: allocations.filter(a => a.status).length, icon: MdCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'On Hold', val: allocations.filter(a => !a.status).length, icon: MdError, color: 'text-rose-600', bg: 'bg-rose-50' }
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

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Student Assignment Directory</h2>
          
          <div className="relative group w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((allocation) => {
                  const route = routes.find(r => r._id === allocation.routeId);
                  return (
                    <tr key={allocation._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center font-bold text-indigo-600 text-sm border border-indigo-100">
                            {allocation.studentName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none mb-1">{allocation.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{allocation.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600">
                          <FaRoute className="text-indigo-400" size={12} />
                          <span>{route?.routeName || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          allocation.status 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {allocation.status ? 'Active' : 'On Hold'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button 
                            onClick={() => handleEdit(allocation)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(allocation._id)}
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
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <p className="text-slate-400 font-medium text-sm italic">No allocation found in registry.</p>
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
                  {editingAllocation ? 'Edit Allocation' : 'Assign Transport'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Link student to a transport route.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Student Search *</label>
                <div className="relative">
                  <MdPersonSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    readOnly={!!editingAllocation}
                    className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 placeholder:font-normal ${editingAllocation ? 'opacity-50' : ''}`}
                    required
                  />
                  {isSearchingStudents && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {studentResults.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
                    {studentResults.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => selectStudent(s)}
                        className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                      >
                         <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center font-bold text-indigo-600 text-xs">
                            {s.firstName.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-800 text-xs">{s.firstName} {s.lastName}</p>
                            <p className="text-[9px] text-slate-400 font-medium">ID: {s.admissionNumber}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Select Route *</label>
                  <select
                    value={formData.routeId}
                    onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none"
                    required
                  >
                    <option value="">Choose Route...</option>
                    {routes.map(route => (
                       <option key={route._id} value={route._id}>
                       {route.routeName}
                       </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">On Hold</option>
                  </select>
                </div>
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
                  {loading ? 'Processing...' : editingAllocation ? 'Update Info' : 'Confirm Allocation'}
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
