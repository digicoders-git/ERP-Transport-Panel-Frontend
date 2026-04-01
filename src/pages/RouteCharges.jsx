import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdAttachMoney, MdClose } from 'react-icons/md';
import { FaRupeeSign } from "react-icons/fa";
import Swal from 'sweetalert2';

const RouteCharges = () => {
  const [charges, setCharges] = useState([
    { id: 1, route: 'Route A - North Campus', studentType: 'Day Scholar', monthlyFee: 1500, yearlyFee: 15000, status: 'Active' },
    { id: 2, route: 'Route A - North Campus', studentType: 'Hosteller', monthlyFee: 800, yearlyFee: 8000, status: 'Active' },
    { id: 3, route: 'Route B - South Campus', studentType: 'Day Scholar', monthlyFee: 1800, yearlyFee: 18000, status: 'Active' },
    { id: 4, route: 'Route C - Hostel Block', studentType: 'Day Scholar', monthlyFee: 1200, yearlyFee: 12000, status: 'Inactive' },
    { id: 5, route: 'Route D - Sports Complex', studentType: 'Day Scholar', monthlyFee: 2000, yearlyFee: 20000, status: 'Active' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [formData, setFormData] = useState({
    route: '',
    studentType: '',
    monthlyFee: '',
    yearlyFee: '',
    status: 'Active'
  });

  const routes = [
    'Route A - North Campus',
    'Route B - South Campus', 
    'Route C - Hostel Block',
    'Route D - Sports Complex'
  ];

  const studentTypes = ['Day Scholar', 'Hosteller'];

  const filteredCharges = charges.filter(charge =>
    charge.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.studentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCharge(null);
    setFormData({ route: '', studentType: '', monthlyFee: '', yearlyFee: '', status: 'Active' });
    setShowModal(true);
  };

  const handleEdit = (charge) => {
    setEditingCharge(charge);
    setFormData(charge);
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
        setCharges(charges.filter(c => c.id !== id));
        Swal.fire('Deleted!', 'Charge has been deleted.', 'success');
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCharge) {
      setCharges(charges.map(c => c.id === editingCharge.id ? { ...formData, id: editingCharge.id } : c));
    } else {
      setCharges([...charges, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaRupeeSign className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Route Charges</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <MdAdd className="text-lg" />
          <span>Add Charge</span>
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Charges</h3>
          <p className="text-3xl font-bold text-blue-600">{charges.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Charges</h3>
          <p className="text-3xl font-bold text-green-600">
            {charges.filter(c => c.status === 'Active').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Monthly Fee</h3>
          <p className="text-3xl font-bold text-purple-600">
            ₹{Math.round(charges.reduce((sum, c) => sum + parseInt(c.monthlyFee), 0) / charges.length)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Routes with Charges</h3>
          <p className="text-3xl font-bold text-orange-600">
            {[...new Set(charges.map(c => c.route))].length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Charge List</h2>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search charges..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Monthly Fee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Yearly Fee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCharges.map((charge) => (
                <tr key={charge.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{charge.route}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{charge.studentType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">₹{charge.monthlyFee}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">₹{charge.yearlyFee}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      charge.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {charge.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(charge)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <MdEdit className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleDelete(charge.id)}
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
                {editingCharge ? 'Edit Charge' : 'Add New Charge'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <MdClose className="text-xl text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                value={formData.studentType}
                onChange={(e) => setFormData({...formData, studentType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Student Type</option>
                {studentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <input
                type="number"
                placeholder="Monthly Fee (₹)"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
              
              <input
                type="number"
                placeholder="Yearly Fee (₹)"
                value={formData.yearlyFee}
                onChange={(e) => setFormData({...formData, yearlyFee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
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
                  {editingCharge ? 'Update' : 'Add'}
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

export default RouteCharges;