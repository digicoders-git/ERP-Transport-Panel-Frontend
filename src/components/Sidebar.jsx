import React from 'react';
import { 
  FaBus, 
  FaUser, 
  FaRoute, 
  FaClipboardCheck, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaBullhorn, 
  FaLock, 
  FaSignOutAlt,
  FaTachometerAlt
} from 'react-icons/fa';

const Sidebar = ({ activePage, setActivePage, onLogout, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FaTachometerAlt },
    { id: 'profile', name: 'My Profile', icon: FaUser },
    { id: 'route-details', name: 'Route & Students', icon: FaRoute },
    { id: 'vehicle-checklist', name: 'Vehicle Checklist', icon: FaClipboardCheck },
    { id: 'emergency-complaints', name: 'Emergency & Complaints', icon: FaExclamationTriangle },
    { id: 'salary-documents', name: 'Salary & Documents', icon: FaMoneyBillWave },
    { id: 'notices', name: 'Notices', icon: FaBullhorn }
  ];

  return (
    <div className={`bg-slate-800 text-white h-screen p-4 flex flex-col fixed left-0 top-0 transition-all duration-300 z-20 shadow-lg ${
      isOpen ? 'w-64' : 'w-16'
    }`} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="mb-6 border-b border-gray-600 pb-4">
        {isOpen ? (
          <>
            <h2 className="text-xl font-bold text-center text-white">Driver Panel</h2>
            <p className='text-sm font-semibold text-center text-gray-300 tracking-wide'>SCHOOL TRANSPORT</p>
          </>
        ) : (
          <div className="flex justify-center">
            <FaBus className="text-3xl text-white" />
          </div>
        )}
      </div>
      
      <nav className="space-y-3 flex-1 overflow-y-scroll text-center scrollbar-hide">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex justify-space text-center items-center rounded-lg transition-all duration-300 cursor-pointer ${
                activePage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${isOpen ? 'gap-2 py-3 text-center' : 'justify-center px-2 py-3'}`}
              title={!isOpen ? item.name : ''}
            >
              <IconComponent className="text-lg flex-shrink-0" />
              {isOpen && <span className="font-semibold tracking-wide">{item.name}</span>}
            </button>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t border-gray-600 space-y-3">
        <button
          onClick={() => setActivePage('change-password')}
          className={`w-full flex items-center rounded-lg transition-all duration-300 cursor-pointer ${
            activePage === 'change-password'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } ${isOpen ? 'gap-1 px-4 py-3' : 'justify-center px-2 py-3'}`}
          title={!isOpen ? 'Change Password' : ''}
        >
          <FaLock className="text-lg flex-shrink-0" />
          {isOpen && <span className="font-semibold tracking-wide">Change Password</span>}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer ${
            isOpen ? 'gap-1 px-4 py-3' : 'justify-center px-2 py-3'
          }`}
          title={!isOpen ? 'Logout' : ''}>
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          {isOpen && <span className="font-semibold tracking-wide">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;