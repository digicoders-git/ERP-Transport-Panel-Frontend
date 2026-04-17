import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaIdCard, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaEdit,
  FaShieldAlt,
  FaStar,
  FaBriefcase,
  FaCamera
} from 'react-icons/fa';
import { MdVerifiedUser, MdEmail, MdPhoneAndroid, MdCake } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { driverAuthAPI } from '../api';
import { toast } from 'react-toastify';

const DriverProfile = () => {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5002';

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      setLoading(true);
      const response = await driverAuthAPI.getProfile();
      if (response.data?.driver) {
        setDriver(response.data.driver);
        setFormData(response.data.driver);
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name || '');
      data.append('mobileNo', formData.mobileNo || '');
      data.append('address', formData.address || '');
      data.append('experience', formData.experience || 0);
      
      if (selectedFile) {
        data.append('profilePic', selectedFile);
      }

      await driverAuthAPI.updateProfile(data);
      setEditMode(false);
      fetchDriverProfile();
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Update failed');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  const driverData = driver || user;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                    Staff Identity
                 </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase">DRIVER PROFILE</h1>
              <p className="text-slate-500 font-medium text-sm">Review and manage your professional profile.</p>
           </div>
           <button
             onClick={() => setEditMode(!editMode)}
             className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
               editMode ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
             }`}
           >
             <FaEdit size={14} />
             <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 text-center relative overflow-hidden h-full">
            <div className="relative z-10">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden relative border border-slate-100">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : driverData?.profilePic ? (
                    <img 
                      src={driverData.profilePic.startsWith('http') ? driverData.profilePic : `${API_URL}${driverData.profilePic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <FaUser className="text-slate-200 text-5xl" />
                  )}
                  
                  {editMode && (
                    <label className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center cursor-pointer transition-opacity opacity-0 hover:opacity-100">
                      <FaCamera className="text-white text-2xl mb-1" />
                      <span className="text-[9px] text-white font-bold uppercase tracking-widest">Update Photo</span>
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  )}
                </div>
                {!editMode && (
                  <div className="absolute -right-2 -bottom-2 bg-emerald-500 text-white p-2 rounded-xl shadow-md border-2 border-white">
                    <MdVerifiedUser size={18} />
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-1 uppercase">{driverData?.name}</h2>
              <p className="text-slate-400 text-xs font-bold mb-6 flex items-center justify-center gap-1.5">
                 <MdEmail size={14} className="text-indigo-400" /> {driverData?.email}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                 <span className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                   driverData?.status !== false 
                     ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                     : 'bg-rose-50 text-rose-600 border-rose-100'
                 }`}>
                   {driverData?.status !== false ? 'ACTIVE' : 'INACTIVE'}
                 </span>
                 <span className="px-4 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    Staff ID: #{driverData?._id?.slice(-4) || '2450'}
                 </span>
              </div>
              
              <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-center">Rating</p>
                    <div className="flex justify-center gap-0.5 text-amber-400">
                      <FaStar size={10} /><FaStar size={10} /><FaStar size={10} /><FaStar size={10} /><FaStar size={10} className="opacity-20" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-center">Safety</p>
                    <div className="text-emerald-500 text-[10px] font-bold flex items-center justify-center gap-1 uppercase">
                       <FaShieldAlt size={10} /> Verified
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { label: 'Primary Contact', val: driverData?.mobileNo, icon: MdPhoneAndroid },
                 { label: 'License Identification', val: driverData?.licenseNo, icon: FaIdCard },
                 { label: 'License Expiry', val: driverData?.licenseExpiryDate ? new Date(driverData.licenseExpiryDate).toLocaleDateString() : 'N/A', icon: FaCalendar },
                 { label: 'Work Experience', val: `${driverData?.experience} Years`, icon: FaBriefcase },
                 { label: 'Assigned Branch', val: driverData?.branch?.branchName || 'Main Campus', icon: FaMapMarkerAlt },
                 { label: 'Residential Address', val: driverData?.address || 'Not Provided', icon: FaMapMarkerAlt },
               ].map((item, index) => (
                 <div key={index} className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-indigo-600 rounded-xl border border-slate-100">
                       <item.icon size={20} />
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                       <p className="text-lg font-bold text-slate-800 tracking-tight">{item.val || 'N/A'}</p>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.mobileNo || ''}
                    onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Residential Address</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 min-h-[80px]"
                  rows="3"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all shadow-sm active:scale-95"
                >
                  Confirm Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
