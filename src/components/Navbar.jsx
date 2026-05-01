import React, { useState, useEffect } from 'react';
import { FaBars, FaBus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 h-24 fixed top-0 right-0 z-40 transition-all duration-300 flex items-center shadow-lg shadow-slate-200/20 ${
      sidebarOpen ? 'left-64' : 'left-16'
    } font-sans`}>
      <div className="flex justify-between items-center w-full px-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100"
          >
            <FaBars size={18} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-md font-bold text-slate-800 tracking-tight uppercase leading-none">TRANSPORT PANEL</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Control</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden lg:block text-right pr-6 border-r border-slate-100">
            <div className="text-sm font-bold text-slate-700 tracking-tight">{formatTime(currentTime)}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(currentTime)}</div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-100 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-none uppercase">{user?.name || 'Authorized User'}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Staff Access</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-300 hover:text-rose-600 transition-colors group"
            title="Logout"
          >
            <FaSignOutAlt size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
