import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdLocationOn, MdClose } from 'react-icons/md';
import { FaRoute, FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api';
import { toast } from 'react-toastify';

const RouteStop = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    stopName: '',
    location: '',
    sequence: '',
    arrivalTime: '',
    departureTime: ''
  });

  const addLog = (msg) => {
    console.log(msg);
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    addLog('Component mounted');
    addLog(`Token: ${localStorage.getItem('token') ? 'EXISTS' : 'MISSING'}`);
    addLog(`API Base URL: ${api.defaults.baseURL}`);
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      addLog(`Route selected: ${selectedRoute}`);
      fetchStops();
    }
  }, [selectedRoute]);

  const fetchRoutes = async () => {
    try {
      addLog('Fetching routes...');
      const response = await api.get('/route/all', { params: { page: 1, limit: 100 } });
      addLog(`Routes response status: ${response.status}`);
      addLog(`Routes data: ${JSON.stringify(response.data).substring(0, 200)}`);
      
      const routesData = response.data.routes || response.data.data || [];
      addLog(`Routes extracted: ${routesData.length}`);
      setRoutes(routesData);
      
      if (routesData.length > 0 && !selectedRoute) {
        addLog(`Auto-selecting first route: ${routesData[0]._id}`);
        setSelectedRoute(routesData[0]._id);
      }
      setPageLoading(false);
    } catch (error) {
      addLog(`ERROR fetching routes: ${error.message}`);
      addLog(`Status: ${error.response?.status}`);
      addLog(`Data: ${JSON.stringify(error.response?.data)}`);
      toast.error('Failed to load routes');
      setPageLoading(false);
    }
  };

  const fetchStops = async () => {
    try {
      setPageLoading(true);
      const url = `/route-stop/route/${selectedRoute}`;
      addLog(`Fetching stops from: ${url}`);
      
      const response = await api.get(url);
      addLog(`Stops response status: ${response.status}`);
      addLog(`Stops response: ${JSON.stringify(response.data).substring(0, 300)}`);
      
      let stopsData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        stopsData = response.data.data;
        addLog(`Found ${stopsData.length} stops in response.data.data`);
      } else if (response.data && response.data.routeStops && Array.isArray(response.data.routeStops)) {
        stopsData = response.data.routeStops;
        addLog(`Found ${stopsData.length} stops in response.data.routeStops`);
      } else {
        addLog(`Unexpected response format: ${JSON.stringify(response.data)}`);
      }
      
      const mappedStops = stopsData.map(stop => ({
        ...stop,
        sequence: stop.stopOrder,
        arrivalTime: stop.pickupTime,
        departureTime: stop.dropTime,
        location: stop.stopLocation || ''
      }));
      
      addLog(`Mapped ${mappedStops.length} stops`);
      setStops(mappedStops);
    } catch (error) {
      addLog(`ERROR fetching stops: ${error.message}`);
      addLog(`Status: ${error.response?.status}`);
      addLog(`Data: ${JSON.stringify(error.response?.data)}`);
      toast.error('Failed to load stops');
      setStops([]);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredStops = stops.filter(stop =>
    stop.stopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stop.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingStop(null);
    setFormData({ stopName: '', location: '', sequence: '', arrivalTime: '', departureTime: '' });
    setShowModal(true);
  };

  const handleEdit = (stop) => {
    setEditingStop(stop);
    setFormData({
      stopName: stop.stopName || '',
      location: stop.location || '',
      sequence: stop.sequence || '',
      arrivalTime: stop.arrivalTime || '',
      departureTime: stop.departureTime || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Stop?',
      text: "This stop will be removed from the route.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#e11d48',
      confirmButtonText: 'Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/route-stop/delete/${id}`);
          setStops(stops.filter(s => s._id !== id));
          toast.success('Stop removed');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.stopName || !formData.location || !formData.sequence) {
      toast.error('Missing required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (editingStop) {
        const payload = {
          stopName: formData.stopName,
          stopOrder: parseInt(formData.sequence),
          pickupTime: formData.arrivalTime,
          dropTime: formData.departureTime
        };
        await api.put(`/route-stop/update/${editingStop._id}`, payload);
        toast.success('Stop updated');
      } else {
        const payload = {
          routeId: selectedRoute,
          stops: [{
            stopName: formData.stopName,
            stopOrder: parseInt(formData.sequence),
            pickupTime: formData.arrivalTime,
            dropTime: formData.departureTime
          }]
        };
        await api.post('/route-stop/add', payload);
        toast.success('Stop added');
      }
      
      setShowModal(false);
      fetchStops();
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
          <p className="text-slate-600 font-bold uppercase tracking-widest text-xs animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedRouteData = routes.find(r => r._id === selectedRoute);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Debug Logs */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-48 overflow-y-auto">
        <p className="text-xs font-bold text-red-800 mb-2">DEBUG LOGS:</p>
        {logs.map((log, i) => (
          <p key={i} className="text-xs text-red-700 font-mono">{log}</p>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">ROUTE STOPS</h1>
            <p className="text-slate-500 font-medium text-sm">Manage stopping points for transport routes.</p>
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={!selectedRoute}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-wider"
          >
            <MdAdd size={18} /> Add Stop
          </button>
        </div>
      </div>

      {/* Route Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-2">Select Route</label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 text-sm"
        >
          <option value="">Choose a route...</option>
          {routes.map(route => (
            <option key={route._id} value={route._id}>
              {route.routeName} ({route.startPoint} - {route.endPoint})
            </option>
          ))}
        </select>
        {selectedRouteData && (
          <p className="text-xs text-slate-500 mt-2">Total Stops: <strong>{stops.length}</strong></p>
        )}
      </div>

      {/* Stops Table */}
      {selectedRoute ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Stop Sequence ({stops.length} stops)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-50 bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-20">Seq</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stop Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrival</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStops && filteredStops.length > 0 ? (
                  filteredStops.map((stop) => (
                    <tr key={stop._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex w-8 h-8 items-center justify-center bg-slate-800 text-white rounded font-bold text-xs">
                          {stop.sequence}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{stop.stopName}</p>
                        <p className="text-[10px] text-slate-400">{stop.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                           <FaClock size={12} /> {stop.arrivalTime || '--:--'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-rose-600 font-bold text-sm">
                           <FaClock size={12} /> {stop.departureTime || '--:--'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <button 
                            onClick={() => handleEdit(stop)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(stop._id)}
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
                      <p className="text-slate-400 font-medium text-sm italic">No stops found for this route.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-16 border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
           <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1 uppercase">Select Route</h3>
           <p className="text-slate-500 font-medium text-sm">Pick a route from the menu above to manage its stopping sequence.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {editingStop ? 'Edit Route Stop' : 'Add New Stop'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Stop Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Market Square"
                  value={formData.stopName}
                  onChange={(e) => setFormData({...formData, stopName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                  required
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Location *</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                  required
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sequence *</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={formData.sequence}
                  onChange={(e) => setFormData({...formData, sequence: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                  required
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Arrival Time</label>
                <input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Departure Time</label>
                <input
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
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
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : editingStop ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteStop;
