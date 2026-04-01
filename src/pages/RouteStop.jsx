import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdLocationOn, MdClose } from 'react-icons/md';
import Swal from 'sweetalert2';

const RouteStop = () => {
  const [stops, setStops] = useState([
    { id: 1, name: 'Main Gate Stop', route: 'Route A - North Campus', location: 'Main Gate', timing: '8:00 AM', order: 1, status: 'Active' },
    { id: 2, name: 'Library Junction', route: 'Route A - North Campus', location: 'Near Library', timing: '8:10 AM', order: 2, status: 'Active' },
    { id: 3, name: 'Canteen Stop', route: 'Route B - South Campus', location: 'Student Canteen', timing: '8:15 AM', order: 1, status: 'Active' },
    { id: 4, name: 'Hostel Block A', route: 'Route C - Hostel Block', location: 'Boys Hostel', timing: '7:45 AM', order: 1, status: 'Inactive' },
    { id: 5, name: 'Sports Ground', route: 'Route D - Sports Complex', location: 'Main Ground', timing: '8:30 AM', order: 2, status: 'Active' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    location: '',
    timing: '',
    order: '',
    status: 'Active'
  });

  const routes = [
    'Route A - North Campus',
    'Route B - South Campus', 
    'Route C - Hostel Block',
    'Route D - Sports Complex'
  ];

  const filteredStops = stops.filter(stop =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stop.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingStop(null);
    setFormData({ name: '', route: '', location: '', timing: '', order: '', status: 'Active' });
    setShowModal(true);
  };

  const handleEdit = (stop) => {
    setEditingStop(stop);
    setFormData(stop);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setStops(stops.filter(s => s.id !== id));
        Swal.fire('Deleted!', 'Stop has been deleted.', 'success');
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStop) {
      setStops(stops.map(s => s.id === editingStop.id ? { ...formData, id: editingStop.id } : s));
    } else {
      setStops([...stops, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MdLocationOn className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Route Stops</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <MdAdd className="text-lg" />
          <span>Add Stop</span>
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stops</h3>
          <p className="text-3xl font-bold text-blue-600">{stops.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Stops</h3>
          <p className="text-3xl font-bold text-green-600">
            {stops.filter(s => s.status === 'Active').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Inactive Stops</h3>
          <p className="text-3xl font-bold text-red-600">
            {stops.filter(s => s.status === 'Inactive').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Routes Covered</h3>
          <p className="text-3xl font-bold text-purple-600">
            {[...new Set(stops.map(s => s.route))].length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Stop List</h2>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stop Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Timing</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStops.map((stop) => (
                <tr key={stop.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{stop.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stop.route}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stop.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stop.timing}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">#{stop.order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      stop.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stop.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(stop)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <MdEdit className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleDelete(stop.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingStop ? 'Edit Stop' : 'Add New Stop'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <MdClose className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Stop Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <select
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Route</option>
                {routes.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <input
                type="time"
                placeholder="Timing"
                value={formData.timing}
                onChange={(e) => setFormData({...formData, timing: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <input
                type="number"
                placeholder="Stop Order"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
              
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  {editingStop ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
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