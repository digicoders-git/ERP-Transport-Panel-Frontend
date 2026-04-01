import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdLocationCity, MdClose } from 'react-icons/md';
import Swal from 'sweetalert2';

const TransportAllocation = () => {
  const [allocations, setAllocations] = useState([
    { id: 1, studentName: 'Aarav Sharma', studentId: 'STU001', class: '10-A', route: 'Route A - Sector 15', stop: 'Sector 15 Gate', pickupTime: '07:30 AM', status: 'Active' },
    { id: 2, studentName: 'Priya Singh', studentId: 'STU002', class: '9-B', route: 'Route B - Gurgaon', stop: 'City Center', pickupTime: '07:45 AM', status: 'Active' },
    { id: 3, studentName: 'Arjun Kumar', studentId: 'STU003', class: '8-C', route: 'Route C - Noida', stop: 'Metro Station', pickupTime: '08:00 AM', status: 'Inactive' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    class: '',
    route: '',
    stop: '',
    pickupTime: '',
    status: 'Active'
  });

  const routes = ['Route A - Sector 15', 'Route B - Gurgaon', 'Route C - Noida', 'Route D - Faridabad'];
  const stops = ['Sector 15 Gate', 'City Center', 'Metro Station', 'Bus Stand', 'Main Market'];
  const classes = ['1-A', '2-A', '3-A', '4-A', '5-A', '6-A', '7-A', '8-A', '8-B', '8-C', '9-A', '9-B', '10-A', '10-B', '11-A', '12-A'];

  const filteredAllocations = allocations.filter(allocation =>
    allocation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAllocation(null);
    setFormData({ studentName: '', studentId: '', class: '', route: '', stop: '', pickupTime: '', status: 'Active' });
    setShowModal(true);
  };

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);
    setFormData(allocation);
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
        setAllocations(allocations.filter(a => a.id !== id));
        Swal.fire('Deleted!', 'Allocation has been deleted.', 'success');
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAllocation) {
      setAllocations(allocations.map(a => a.id === editingAllocation.id ? { ...formData, id: editingAllocation.id } : a));
    } else {
      setAllocations([...allocations, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MdLocationCity className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Transport Allocation</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <MdAdd className="text-lg" />
          <span>Add Allocation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{allocations.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Allocations</h3>
          <p className="text-3xl font-bold text-green-600">
            {allocations.filter(a => a.status === 'Active').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Routes in Use</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {new Set(allocations.map(a => a.route)).size}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Student Allocation List</h2>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search allocations..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stop</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pickup Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((allocation) => (
                <tr key={allocation.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{allocation.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{allocation.studentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{allocation.class}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{allocation.route}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{allocation.stop}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{allocation.pickupTime}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      allocation.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(allocation)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <MdEdit className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleDelete(allocation.id)}
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
                {editingAllocation ? 'Edit Allocation' : 'Add New Allocation'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <MdClose className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <input
                type="text"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <select
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              
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
              
              <select
                value={formData.stop}
                onChange={(e) => setFormData({...formData, stop: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Stop</option>
                {stops.map(stop => (
                  <option key={stop} value={stop}>{stop}</option>
                ))}
              </select>
              
              <input
                type="time"
                placeholder="Pickup Time"
                value={formData.pickupTime}
                onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                  {editingAllocation ? 'Update' : 'Add'}
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

export default TransportAllocation;