import React, { useState } from 'react';
import { FaBus, FaIdCard, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials
  const validCredentials = {
    'DRV001': 'pass123',
    'DRV002': 'pass456',
    'DRV003': 'pass789'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (driverId.trim() && password.trim()) {
      localStorage.setItem('driverId', driverId);
      onLogin();
    } else {
      toast.error('Please enter Driver ID and Password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-pink-300/15 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-green-300/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-orange-300/25 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-cyan-300/30 rounded-full animate-bounce delay-700"></div>
      </div>
      
      {/* Floating Bus Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <FaBus className="absolute top-20 left-1/4 text-white/10 text-4xl animate-float" />
        <FaBus className="absolute bottom-32 right-1/4 text-white/10 text-3xl animate-float-delayed" />
        <FaBus className="absolute top-1/2 right-20 text-white/10 text-2xl animate-float-slow" />
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-96 z-10 border border-white/20">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <FaBus className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">School Driver Panel</h2>
          <p className="text-gray-600 text-sm mt-2">Enter any ID and password to login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaIdCard className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter any Driver ID"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 font-semibold shadow-lg transform hover:scale-105"
          >
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;