import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdAttachMoney, MdClose, MdAccountBalanceWallet, MdTrendingUp, MdDescription } from 'react-icons/md';
import { FaMoneyCheckAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { routeChargeAPI, routeAPI } from '../api';
import { toast } from 'react-toastify';

const RouteCharges = () => {
  const [charges, setCharges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    routeId: '',
    monthlyCharge: '',
    quarterlyCharge: '',
    annualCharge: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [chargeResponse, routeResponse] = await Promise.all([
        routeChargeAPI.getAll(1, 100),
        routeAPI.getAll(1, 100)
      ]);
      setCharges(chargeResponse.data.data || []);
      setRoutes(routeResponse.data.data || []);
    } catch (error) {
      toast.error('Failed to load pricing data');
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredCharges = charges.filter(charge => {
    const route = routes.find(r => r._id === charge.routeId);
    return route?.routeName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAdd = () => {
    setEditingCharge(null);
    setFormData({ routeId: '', monthlyCharge: '', quarterlyCharge: '', annualCharge: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (charge) => {
    setEditingCharge(charge);
    setFormData({
      routeId: charge.routeId || '',
      monthlyCharge: charge.monthlyCharge || '',
      quarterlyCharge: charge.quarterlyCharge || '',
      annualCharge: charge.annualCharge || '',
      description: charge.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Pricing?',
      text: "This pricing record will be permanently removed.",
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
          await routeChargeAPI.delete(id);
          setCharges(charges.filter(c => c._id !== id));
          toast.success('Pricing removed');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.routeId || !formData.monthlyCharge) {
      toast.error('Missing required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        monthlyCharge: parseFloat(formData.monthlyCharge),
        quarterlyCharge: formData.quarterlyCharge ? parseFloat(formData.quarterlyCharge) : 0,
        annualCharge: formData.annualCharge ? parseFloat(formData.annualCharge) : 0
      };

      if (editingCharge) {
        await routeChargeAPI.update(editingCharge._id, payload);
        toast.success('Pricing updated');
      } else {
        await routeChargeAPI.create(payload);
        toast.success('Pricing added');
      }
      
      setShowModal(false);
      fetchData();
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
          <p className="text-slate-600 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Rates...</p>
        </div>
      </div>
    );
  }

  const totalMonthlyRevenue = charges.reduce((sum, c) => sum + (c.monthlyCharge || 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                  Revenue Management
               </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight text-uppercase">ROUTE PRICING</h1>
            <p className="text-slate-500 font-medium text-sm">Manage transport fees and subscription rates.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <MdAdd size={18} /> Add Pricing
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Rates', val: charges.length, icon: FaFileInvoiceDollar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Projected Monthly', val: `₹${totalMonthlyRevenue.toLocaleString()}`, icon: MdTrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Estimated Annual', val: `₹${(totalMonthlyRevenue * 12).toLocaleString()}`, icon: MdAccountBalanceWallet, color: 'text-blue-600', bg: 'bg-blue-50' }
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
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Fee Structure Directory</h2>
          
          <div className="relative group w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by route..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route Gateway</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pricing Matrix</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCharges.length > 0 ? (
                filteredCharges.map((charge) => {
                  const route = routes.find(r => r._id === charge.routeId);
                  return (
                    <tr key={charge._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                              <FaMoneyCheckAlt size={18} />
                           </div>
                           <p className="font-bold text-slate-800">{route?.routeName || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded font-bold text-[11px] border border-emerald-100">
                              <span className="text-[9px] uppercase tracking-tighter mr-1 opacity-70">Mon:</span>
                              ₹{charge.monthlyCharge?.toLocaleString()}
                           </div>
                           <div className="space-y-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                              <p>Qtr: <span className="text-slate-700">₹{charge.quarterlyCharge?.toLocaleString()}</span></p>
                              <p>Ann: <span className="text-slate-700">₹{charge.annualCharge?.toLocaleString()}</span></p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                           <p className="text-[11px] font-medium text-slate-500 line-clamp-1 italic">"{charge.description || 'Standard Pricing Plan'}"</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button 
                            onClick={() => handleEdit(charge)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(charge._id)}
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
                    <p className="text-slate-400 font-medium text-sm italic">No pricing records found.</p>
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
                   {editingCharge ? 'Edit Pricing Details' : 'Configure New Rates'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Define fee structure for the transport route.</p>
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Target Route *</label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formData.routeId}
                    onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 appearance-none cursor-pointer"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Monthly *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.monthlyCharge}
                      onChange={(e) => setFormData({...formData, monthlyCharge: e.target.value})}
                      className="w-full pl-6 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Quarterly</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.quarterlyCharge}
                      onChange={(e) => setFormData({...formData, quarterlyCharge: e.target.value})}
                      className="w-full pl-6 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Annual</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.annualCharge}
                      onChange={(e) => setFormData({...formData, annualCharge: e.target.value})}
                      className="w-full pl-6 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Description / Notes</label>
                <div className="relative">
                   <MdDescription className="absolute left-3 top-3 text-slate-400" />
                   <textarea
                     placeholder="Notes about this pricing model..."
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                  {loading ? 'Processing...' : editingCharge ? 'Save Changes' : 'Record Pricing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteCharges;
