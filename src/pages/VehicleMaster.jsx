import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdDirectionsBus, MdClose, MdEventAvailable, MdHistory, MdOutlineAirlineSeatReclineExtra } from 'react-icons/md';
import { FaBus, FaCogs } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { vehicleAPI } from '../api';
import { toast } from 'react-toastify';

const VehicleMaster = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    registrationNumber: '',
    type: '',
    capacity: '',
    status: 'active'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setPageLoading(true);
      const response = await vehicleAPI.getAll(1, 100);
      setVehicles(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load vehicles');
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingVehicle(null);
    setFormData({ vehicleNumber: '', registrationNumber: '', type: '', capacity: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber || '',
      registrationNumber: vehicle.registrationNumber || '',
      type: vehicle.type || '',
      capacity: vehicle.capacity || '',
      status: vehicle.status ? 'active' : 'inactive'
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Vehicle?',
      text: "This record will be permanently removed.",
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
          await vehicleAPI.delete(id);
          setVehicles(vehicles.filter(v => v._id !== id));
          toast.success('Vehicle removed');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNumber || !formData.registrationNumber || !formData.capacity) {
      toast.error('Missing required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        status: formData.status === 'active'
      };

      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle._id, payload);
        toast.success('Vehicle updated');
      } else {
        await vehicleAPI.create(payload);
        toast.success('Vehicle added');
      }
      
      setShowModal(false);
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Fleet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                  Fleet Inventory
               </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">VEHICLE MASTER</h1>
            <p className="text-slate-500 font-medium text-sm">Registry of all school transport vehicles.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <MdAdd size={18} /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Vehicles', val: vehicles.length, icon: FaBus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Units', val: vehicles.filter(v => v.status).length, icon: MdEventAvailable, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Under Maintenance', val: vehicles.filter(v => !v.status).length, icon: MdHistory, color: 'text-rose-600', bg: 'bg-rose-50' }
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
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Active Fleet</h2>
          
          <div className="relative group w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by plate or type..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Plate</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                          {vehicle.vehicleNumber}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">{vehicle.registrationNumber}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Reg ID</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        <FaCogs size={12} /> {vehicle.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
                        <MdOutlineAirlineSeatReclineExtra size={16} />
                        <span>{vehicle.capacity} Seats</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        vehicle.status 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {vehicle.status ? 'Active' : 'Ground'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button 
                          onClick={() => handleEdit(vehicle)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <p className="text-slate-400 font-medium text-sm italic">No vehicles found in fleet.</p>
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
                  {editingVehicle ? 'Edit Vehicle Info' : 'New Vehicle Registry'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Capture details for transport assets.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Plate Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. RJ14 CP 4582"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 placeholder:font-normal"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Registration ID *</label>
                  <input
                    type="text"
                    placeholder="Official ID"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 placeholder:font-normal"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Vehicle Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="School Bus">School Bus</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Capacity *</label>
                  <div className="relative">
                    <MdOutlineAirlineSeatReclineExtra size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      placeholder="Total seats"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 placeholder:font-normal"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                >
                  <option value="active">Active & Operational</option>
                  <option value="inactive">Under Maintenance</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                  {loading ? 'Processing...' : editingVehicle ? 'Save Changes' : 'Record Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMaster;
