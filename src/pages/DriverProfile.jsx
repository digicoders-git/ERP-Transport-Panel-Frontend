import React, { useState } from 'react';
import { FaUser, FaPhone, FaIdCard, FaBus, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DriverProfile = () => {
  const driverId = localStorage.getItem('driverId');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const driverProfiles = {
    DRV001: {
      name: 'Rajesh Kumar',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      mobile: '+91 9876543210',
      address: '123 Main Street, Delhi',
      licenseNumber: 'DL-1420110012345',
      licenseExpiry: '2025-12-31',
      busNumber: 'UP-14-AB-1234',
      route: 'Route A - Morning',
      joiningDate: '2020-01-15',
      experience: '15 years'
    },
    DRV002: {
      name: 'Suresh Singh',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      mobile: '+91 9876543211',
      address: '456 Park Road, Noida',
      licenseNumber: 'DL-1420110012346',
      licenseExpiry: '2026-06-30',
      busNumber: 'UP-14-CD-5678',
      route: 'Route B - Evening',
      joiningDate: '2019-03-20',
      experience: '12 years'
    },
    DRV003: {
      name: 'Amit Sharma',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      mobile: '+91 9876543212',
      address: '789 City Center, Gurgaon',
      licenseNumber: 'DL-1420110012347',
      licenseExpiry: '2024-09-15',
      busNumber: 'UP-14-EF-9012',
      route: 'Route C - Both',
      joiningDate: '2021-07-10',
      experience: '8 years'
    }
  };

  const profile = driverProfiles[driverId] || driverProfiles.DRV001;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      mobile: profile.mobile,
      address: profile.address
    });
    setSelectedPhoto(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Profile update request submitted for admin approval',
      icon: 'success',
      confirmButtonColor: '#3B82F6'
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setSelectedPhoto(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Driver Profile</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white cursor-pointer text-[#5F9598] px-4 py-2 rounded-lg hover:bg-[#F3F4F4] transition flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Photo and Basic Info */}
              <div className="text-center">
                <div className="relative w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={selectedPhoto || profile.photo} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                    <FaUser className="text-gray-500 text-4xl" />
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer" onClick={() => document.getElementById('photo-upload').click()}>
                      <FaEdit className="text-white text-xl" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600">Driver ID: {driverId}</p>
                <p className="text-sm text-gray-500 mt-2">Joined: {profile.joiningDate}</p>
              </div>

              {/* Personal Details */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaPhone className="text-orange-500 mr-2" />
                      <span className="font-medium">Mobile Number</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.mobile}
                        onChange={(e) => setEditData({...editData, mobile: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.mobile}</p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaIdCard className="text-orange-500 mr-2" />
                      <span className="font-medium">License Number</span>
                    </div>
                    <p className="text-gray-700">{profile.licenseNumber}</p>
                    <p className="text-sm text-gray-500">Expires: {profile.licenseExpiry}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <div className="flex items-center mb-2">
                      <FaUser className="text-orange-500 mr-2" />
                      <span className="font-medium">Address</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        rows="2"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Assignment */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Vehicle Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaBus className="text-blue-500 mr-2" />
                    <span className="font-medium">Bus Number</span>
                  </div>
                  <p className="text-xl font-semibold text-blue-700">{profile.busNumber}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaIdCard className="text-green-500 mr-2" />
                    <span className="font-medium">Route</span>
                  </div>
                  <p className="text-xl font-semibold text-green-700">{profile.route}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-purple-500 mr-2" />
                    <span className="font-medium">Experience</span>
                  </div>
                  <p className="text-xl font-semibold text-purple-700">{profile.experience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;