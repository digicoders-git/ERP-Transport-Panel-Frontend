import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdPerson, MdClose, MdPermContactCalendar, MdVerifiedUser, MdHistory, MdLocationOn } from 'react-icons/md';
import { FaIdCard, FaUserTie } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { driverAPI } from '../api';
import { toast } from 'react-toastify';

const DriverMaster = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNo: '',
    licenseNo: '',
    licenseExpiryDate: '',
    experience: '',
    address: '',
    salary: '',
    status: true
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setPageLoading(true);
      const response = await driverAPI.getAll(1, 100);
      const driversData = response.data?.data?.drivers || response.data?.drivers || response.data?.data || [];
      setDrivers(driversData);
    } catch (error) {
      toast.error('Failed to load drivers');
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.mobileNo?.includes(searchTerm)
  );

  const handleAdd = () => {
    setEditingDriver(null);
    setFormData({ 
      name: '', 
      email: '', 
      password: '',
      mobileNo: '', 
      licenseNo: '', 
      licenseExpiryDate: '',
      experience: '',
      address: '',
      salary: '',
      status: true 
    });
    setShowModal(true);
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name || '',
      email: driver.email || '',
      password: '',
      mobileNo: driver.mobileNo || '',
      licenseNo: driver.licenseNo || '',
      licenseExpiryDate: driver.licenseExpiryDate ? driver.licenseExpiryDate.split('T')[0] : '',
      experience: driver.experience || '',
      address: driver.address || '',
      salary: driver.salary || '',
      status: driver.status !== false
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Driver?',
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
          await driverAPI.delete(id);
          setDrivers(drivers.filter(d => d._id !== id));
          toast.success('Driver removed');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobileNo || !formData.licenseNo || !formData.licenseExpiryDate || formData.experience === '') {
      toast.error('Missing required fields');
      return;
    }

    if (!editingDriver && !formData.password) {
      toast.error('Password required for new driver');
      return;
    }

    try {
      setLoading(true);
      const payload = { ...formData, experience: parseInt(formData.experience) };
      if (!payload.password && editingDriver) delete payload.password;

      if (editingDriver) {
        await driverAPI.update(editingDriver._id, payload);
        toast.success('Driver profile updated');
      } else {
        await driverAPI.create(payload);
        toast.success('Driver enrolled');
      }
      
      setShowModal(false);
      fetchDrivers();
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
          <p className="text-slate-600 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Drivers...</p>
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
                  Fleet Management
               </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">DRIVER MASTER</h1>
            <p className="text-slate-500 font-medium text-sm">Manage and monitor all transport staff profiles.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <MdAdd size={18} /> Add Driver
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Drivers', val: drivers.length, icon: FaUserTie, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Personnel', val: drivers.filter(d => d.status).length, icon: MdVerifiedUser, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Inactive / On Leave', val: drivers.filter(d => !d.status).length, icon: MdHistory, color: 'text-rose-600', bg: 'bg-rose-50' }
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
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Driver Registry</h2>
          
          <div className="relative group w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, license..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credentials</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <tr key={driver._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center font-bold text-indigo-500 text-sm">
                          {driver.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">{driver.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{driver.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                           {driver.licenseNo}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 tracking-wider">{driver.mobileNo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{driver.experience} Years</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        driver.status 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {driver.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button 
                          onClick={() => handleEdit(driver)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(driver._id)}
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
                    <p className="text-slate-400 font-medium text-sm italic">No drivers found in registry.</p>
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
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  {editingDriver ? 'Edit Driver Profile' : 'Register New Driver'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Provide the necessary staff information below.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name *</label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 placeholder:font-normal"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mobile No *</label>
                  <div className="relative">
                    <MdPermContactCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={formData.mobileNo}
                      onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 placeholder:font-normal"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email *</label>
                  <input
                    type="email"
                    placeholder="name@school.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 disabled:opacity-50"
                    disabled={!!editingDriver}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">System Password *</label>
                  <input
                    type="password"
                    placeholder={editingDriver ? "Keep blank to leave unchanged" : "Set password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    required={!editingDriver}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">License No *</label>
                  <input
                    type="text"
                    placeholder="DL Number"
                    value={formData.licenseNo}
                    onChange={(e) => setFormData({...formData, licenseNo: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.licenseExpiryDate}
                    onChange={(e) => setFormData({...formData, licenseExpiryDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Exp (Years) *</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Base Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="Monthly salary"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    min="0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Status</label>
                  <div className="flex gap-4 p-2 bg-slate-50 rounded-lg border border-slate-200 h-[44px] items-center px-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.checked})}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Active & Operational</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Address</label>
                <div className="relative">
                  <MdLocationOn className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    placeholder="Residential address..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 min-h-[80px]"
                  />
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
                  {loading ? 'Processing...' : editingDriver ? 'Save Changes' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMaster;
