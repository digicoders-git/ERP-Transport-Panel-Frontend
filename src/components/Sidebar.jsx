import React from 'react';
import { 
  FaBus, 
  FaUser, 
  FaRoute, 
  FaClipboardCheck, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaBullhorn, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activePage, setActivePage, isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FaTachometerAlt },
    { id: 'profile', name: 'Personnel Profile', icon: FaUser },
    { id: 'route-details', name: 'Route Directory', icon: FaRoute },
    { id: 'route-tracking', name: 'Live Tracking', icon: FaMapMarkerAlt },
    { id: 'vehicle-checklist', name: 'Maintenance Log', icon: FaClipboardCheck },
    { id: 'emergency-complaints', name: 'Complaints Hub', icon: FaExclamationTriangle },
    { id: 'salary-documents', name: 'Salary Reports', icon: FaMoneyBillWave },
    { id: 'notices', name: 'Announcements', icon: FaBullhorn }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-20 shadow-2xl ${
      isOpen ? 'w-64' : 'w-16'
    } font-sans`}>
      <div className="p-4">
        {isOpen ? (
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">TRANSPORT</h2>
            <p className='text-[9px] font-bold text-indigo-400 tracking-[0.2em] uppercase'>Operations Panel</p>
          </div>
        ) : (
          <div className="flex justify-center -ml-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
               <FaBus className="text-xl text-white" />
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5 scrollbar-hide">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              } ${isOpen ? 'gap-3 py-3 px-4 mb-0.5' : 'justify-center py-3 px-0 mb-0.5'}`}
              title={!isOpen ? item.name : ''}
            >
              <IconComponent className={`text-lg shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isOpen && <span className="text-sm font-bold tracking-wide">{item.name}</span>}
            </button>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-lg text-slate-400 hover:bg-rose-600/10 hover:text-rose-500 transition-all duration-200 ${
            isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5'
          }`}
          title={!isOpen ? 'Logout' : ''}>
          <FaSignOutAlt className="text-lg shrink-0" />
          {isOpen && <span className="text-sm font-bold tracking-wide uppercase">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
