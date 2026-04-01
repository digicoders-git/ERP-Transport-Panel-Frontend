import React, { useState } from 'react';
import { FaExclamationTriangle, FaPhone, FaBus, FaRoute, FaUsers, FaClock, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';

const EmergencyComplaints = () => {
  const [activeTab, setActiveTab] = useState('emergency');
  const [emergencyType, setEmergencyType] = useState('');
  const [emergencyNote, setEmergencyNote] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');

  const emergencyTypes = [
    { value: 'accident', label: 'Accident', color: 'red' },
    { value: 'breakdown', label: 'Vehicle Breakdown', color: 'orange' },
    { value: 'medical', label: 'Medical Emergency', color: 'red' },
    { value: 'security', label: 'Security Issue', color: 'purple' },
    { value: 'weather', label: 'Weather Emergency', color: 'blue' }
  ];

  const complaintTypes = [
    { value: 'bus_problem', label: 'Bus Problem' },
    { value: 'route_issue', label: 'Route Issue' },
    { value: 'student_issue', label: 'Student Issue' },
    { value: 'timing_problem', label: 'Timing Problem' },
    { value: 'other', label: 'Other' }
  ];

  const handleEmergencySubmit = () => {
    if (!emergencyType || !emergencyNote) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please select emergency type and add details',
        icon: 'warning',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }
    
    Swal.fire({
      title: 'Emergency Alert Sent!',
      text: 'Emergency alert sent to admin and school management!',
      icon: 'success',
      confirmButtonColor: '#EF4444'
    });
    setEmergencyType('');
    setEmergencyNote('');
  };

  const handleComplaintSubmit = () => {
    if (!complaintType || !complaintDescription) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please select complaint type and add description',
        icon: 'warning',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }
    
    Swal.fire({
      title: 'Complaint Submitted!',
      text: 'Your complaint has been submitted successfully',
      icon: 'success',
      confirmButtonColor: '#3B82F6'
    });
    setComplaintType('');
    setComplaintDescription('');
  };

  const callAdmin = () => {
    Swal.fire({
      title: 'Calling Admin',
      text: 'Calling school admin: +91 9876543200',
      icon: 'info',
      confirmButtonColor: '#3B82F6'
    });
  };

  const callSchool = () => {
    Swal.fire({
      title: 'Calling School',
      text: 'Calling school office: +91 9876543201',
      icon: 'info',
      confirmButtonColor: '#3B82F6'
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#F3F4F4] to-[#5F9598]/10 min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Emergency & Complaints</h1>
            <p className="text-red-100">Report emergencies and submit complaints</p>
          </div>

          {/* Emergency Quick Actions */}
          <div className="p-6 bg-red-50 border-b">
            <h2 className="text-lg font-semibold text-red-800 mb-4">Quick Emergency Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={callAdmin}
                className="bg-red-500 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <FaPhone /> Call Admin
              </button>
              <button
                onClick={callSchool}
                className="bg-orange-500 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <FaPhone /> Call School
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('emergency')}
                className={`px-6 py-3 font-medium cursor-pointer ${
                  activeTab === 'emergency'
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Emergency Alert
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`px-6 py-3 cursor-pointer font-medium ${
                  activeTab === 'complaints'
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Submit Complaint
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'emergency' && (
              <div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
                    <div>
                      <h3 className="font-semibold text-red-800">Emergency Alert System</h3>
                      <p className="text-sm text-red-600">Use this for immediate emergencies requiring urgent attention</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Emergency Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {emergencyTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setEmergencyType(type.value)}
                          className={`p-4 cursor-pointer border-2 rounded-lg text-left transition ${
                            emergencyType === type.value
                              ? `border-${type.color}-500 bg-${type.color}-50`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-800">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Details
                    </label>
                    <textarea
                      value={emergencyNote}
                      onChange={(e) => setEmergencyNote(e.target.value)}
                      placeholder="Describe the emergency situation in detail..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="4"
                    />
                  </div>

                  <button
                    onClick={handleEmergencySubmit}
                    className="w-full cursor-pointer bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaExclamationTriangle />
                    Send Emergency Alert
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'complaints' && (
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Complaint Category
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {complaintTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setComplaintType(type.value)}
                          className={`p-4 cursor-pointer border-2 rounded-lg text-left transition flex items-center ${
                            complaintType === type.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="mr-3">
                            {type.value === 'bus_problem' && <FaBus className="text-orange-500" />}
                            {type.value === 'route_issue' && <FaRoute className="text-blue-500" />}
                            {type.value === 'student_issue' && <FaUsers className="text-green-500" />}
                            {type.value === 'timing_problem' && <FaClock className="text-purple-500" />}
                            {type.value === 'other' && <FaExclamationTriangle className="text-gray-500" />}
                          </div>
                          <div className="font-semibold text-gray-800">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complaint Description
                    </label>
                    <textarea
                      value={complaintDescription}
                      onChange={(e) => setComplaintDescription(e.target.value)}
                      placeholder="Describe your complaint in detail..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>

                  <button
                    onClick={handleComplaintSubmit}
                    className="w-full cursor-pointer bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane />
                    Submit Complaint
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {[
              { 
                date: '2024-01-15', 
                type: 'Complaint', 
                category: 'Bus Problem', 
                status: 'Resolved',
                description: 'AC not working properly'
              },
              { 
                date: '2024-01-12', 
                type: 'Emergency', 
                category: 'Breakdown', 
                status: 'Resolved',
                description: 'Flat tire on route'
              },
              { 
                date: '2024-01-10', 
                type: 'Complaint', 
                category: 'Timing Problem', 
                status: 'In Progress',
                description: 'Frequent delays due to traffic'
              }
            ].map((report, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mr-3 ${
                      report.type === 'Emergency' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {report.type}
                    </span>
                    <span className="font-medium text-gray-800">{report.category}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Resolved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{report.description}</p>
                <p className="text-xs text-gray-500">{report.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyComplaints;