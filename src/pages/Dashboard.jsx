import React from 'react';
import { 
  FaTaxi, 
  MdPerson, 
  MdMap, 
  MdLocationOn, 
  MdAssignment, 
  MdLocationCity,
  MdTrendingUp,
  MdWarning,
  MdCheckCircle
} from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa';

const Dashboard = ({ setActivePage }) => {
  const statsCards = [
    { title: 'Total Vehicles', value: '25', icon: FaTaxi, color: 'blue', subtext: '4 Active, 1 Maintenance' },
    { title: 'Active Drivers', value: '18', icon: MdPerson, color: 'green', subtext: '2 on leave' },
    { title: 'Total Routes', value: '12', icon: MdMap, color: 'purple', subtext: '45 stops covered' },
    { title: 'Transport Allocated', value: '320', icon: MdLocationCity, color: 'orange', subtext: '15 pending' },
    { title: 'Route Charges', value: '₹2,500', icon: FaRupeeSign, color: 'indigo', subtext: 'Avg per route' },
    { title: 'Assignments', value: '12', icon: MdAssignment, color: 'pink', subtext: 'All routes covered' }
  ];

  const recentActivities = [
    { action: 'New vehicle added', detail: 'DL-01-AB-1234 - School Taxi', time: '2 hours ago', type: 'success' },
    { action: 'Driver assigned', detail: 'Rajesh Kumar to Route A - Sector 15', time: '4 hours ago', type: 'info' },
    { action: 'Transport allocated', detail: 'Aarav Sharma to Route B - Gurgaon', time: '6 hours ago', type: 'success' },
    { action: 'Route charges updated', detail: 'Route C - Noida: ₹2,800', time: '1 day ago', type: 'warning' },
    { action: 'Vehicle maintenance', detail: 'DL-03-EF-9012 scheduled for service', time: '2 days ago', type: 'warning' }
  ];

  const quickStats = [
    { label: 'Today\'s Revenue', value: '₹8,500', trend: '+12%', positive: true },
    { label: 'Active Routes', value: '11/12', trend: '92%', positive: true },
    { label: 'On-time Performance', value: '94%', trend: '+3%', positive: true },
    { label: 'Fuel Efficiency', value: '12.5 km/l', trend: '+0.8', positive: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 space-y-8 p-6">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Transport Dashboard</h1>
          <p className="text-gray-600 mt-2 font-medium">Welcome back! Here's your transport overview</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = {
            blue: { 
              gradient: 'from-blue-500 to-cyan-400', 
              bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
              shadow: 'shadow-blue-200',
              text: 'text-blue-700'
            },
            green: { 
              gradient: 'from-green-500 to-emerald-400', 
              bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
              shadow: 'shadow-green-200',
              text: 'text-green-700'
            },
            purple: { 
              gradient: 'from-purple-500 to-violet-400', 
              bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
              shadow: 'shadow-purple-200',
              text: 'text-purple-700'
            },
            orange: { 
              gradient: 'from-orange-500 to-amber-400', 
              bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
              shadow: 'shadow-orange-200',
              text: 'text-orange-700'
            },
            indigo: { 
              gradient: 'from-indigo-500 to-blue-400', 
              bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
              shadow: 'shadow-indigo-200',
              text: 'text-indigo-700'
            },
            pink: { 
              gradient: 'from-pink-500 to-rose-400', 
              bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
              shadow: 'shadow-pink-200',
              text: 'text-pink-700'
            }
          };
          return (
            <div key={index} className={`${colorClasses[stat.color].bg} p-6 rounded-2xl shadow-lg ${colorClasses[stat.color].shadow} hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50 backdrop-blur-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</h3>
                  <p className={`text-4xl font-bold ${colorClasses[stat.color].text} mt-2`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">{stat.subtext}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${colorClasses[stat.color].gradient} rounded-2xl shadow-lg`}>
                  <IconComponent className="text-3xl text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-1">{stat.value}</p>
              </div>
              <div className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                stat.positive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}>
                <MdTrendingUp className="mr-1" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl mr-3 shadow-lg">
              <MdCheckCircle className="text-white text-xl" />
            </div>
            Recent Activities
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start p-4 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md border border-white/30">
                <div className={`w-3 h-3 rounded-full mt-2 mr-4 shadow-lg ${
                  activity.type === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  activity.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.detail}</p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-xl mr-3 shadow-lg">
              <MdWarning className="text-white text-xl" />
            </div>
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
              <span className="font-semibold text-green-800">Vehicle Fleet</span>
              <span className="text-sm text-green-700 font-bold bg-green-200 px-3 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
              <span className="font-semibold text-green-800">Driver Availability</span>
              <span className="text-sm text-green-700 font-bold bg-green-200 px-3 py-1 rounded-full">Good</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border border-yellow-200 shadow-sm">
              <span className="font-semibold text-yellow-800">Route Coverage</span>
              <span className="text-sm text-yellow-700 font-bold bg-yellow-200 px-3 py-1 rounded-full">1 Route Pending</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
              <span className="font-semibold text-green-800">Transport Allocation</span>
              <span className="text-sm text-green-700 font-bold bg-green-200 px-3 py-1 rounded-full">95% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-400 rounded-xl mr-3 shadow-lg">
            <MdAssignment className="text-white text-xl" />
          </div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button 
            onClick={() => setActivePage('vehicle-master')}
            className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 border border-blue-200"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mx-auto mb-3 w-fit shadow-lg group-hover:scale-110 transition-transform">
              <FaTaxi className="text-2xl text-white" />
            </div>
            <span className="text-sm font-bold text-blue-800">Add Vehicle</span>
          </button>
          <button 
            onClick={() => setActivePage('driver-master')}
            className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 border border-green-200"
          >
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl mx-auto mb-3 w-fit shadow-lg group-hover:scale-110 transition-transform">
              <MdPerson className="text-2xl text-white" />
            </div>
            <span className="text-sm font-bold text-green-800">Add Driver</span>
          </button>
          <button 
            onClick={() => setActivePage('route-master')}
            className="group p-6 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 border border-purple-200"
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-400 rounded-2xl mx-auto mb-3 w-fit shadow-lg group-hover:scale-110 transition-transform">
              <MdMap className="text-2xl text-white" />
            </div>
            <span className="text-sm font-bold text-purple-800">New Route</span>
          </button>
          <button 
            onClick={() => setActivePage('transport-allocation')}
            className="group p-6 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 border border-orange-200"
          >
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl mx-auto mb-3 w-fit shadow-lg group-hover:scale-110 transition-transform">
              <MdLocationCity className="text-2xl text-white" />
            </div>
            <span className="text-sm font-bold text-orange-800">Allocate Transport</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;