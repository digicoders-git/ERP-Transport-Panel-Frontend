import React, { useState } from 'react';
import { FaBullhorn, FaCalendarAlt, FaExclamationTriangle, FaInfoCircle, FaRoute, FaClock } from 'react-icons/fa';

const Notices = () => {
  const [filter, setFilter] = useState('all');

  const notices = [
    {
      id: 1,
      title: 'Holiday Notice - Republic Day',
      content: 'School will remain closed on 26th January 2024 for Republic Day. No transport service will be available.',
      type: 'holiday',
      priority: 'high',
      date: '2024-01-20',
      author: 'School Administration'
    },
    {
      id: 2,
      title: 'Route Change Alert - Route A',
      content: 'Due to road construction on Main Street, Route A will be diverted via Park Road from 22nd January. Please inform students about the temporary change.',
      type: 'route_change',
      priority: 'urgent',
      date: '2024-01-18',
      author: 'Transport Manager'
    },
    {
      id: 3,
      title: 'Safety Instructions Update',
      content: 'All drivers must ensure students wear seat belts and maintain discipline during the journey. Regular safety checks are mandatory.',
      type: 'instruction',
      priority: 'medium',
      date: '2024-01-15',
      author: 'Safety Officer'
    },
    {
      id: 4,
      title: 'New Pickup Point Added',
      content: 'A new pickup point has been added at Metro Station for Route B. Timing: 7:45 AM. Please update your route accordingly.',
      type: 'route_change',
      priority: 'medium',
      date: '2024-01-12',
      author: 'Transport Manager'
    },
    {
      id: 5,
      title: 'Monthly Driver Meeting',
      content: 'All drivers are required to attend the monthly meeting on 25th January at 3:00 PM in the school auditorium.',
      type: 'meeting',
      priority: 'high',
      date: '2024-01-10',
      author: 'Principal'
    },
    {
      id: 6,
      title: 'Fuel Efficiency Guidelines',
      content: 'Please follow eco-friendly driving practices to improve fuel efficiency. Maintain steady speed and avoid sudden acceleration.',
      type: 'instruction',
      priority: 'low',
      date: '2024-01-08',
      author: 'Transport Manager'
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'holiday': return FaCalendarAlt;
      case 'route_change': return FaRoute;
      case 'instruction': return FaInfoCircle;
      case 'meeting': return FaClock;
      default: return FaBullhorn;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'holiday': return 'text-green-600';
      case 'route_change': return 'text-blue-600';
      case 'instruction': return 'text-purple-600';
      case 'meeting': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(notice => notice.type === filter);

  return (
    <div className="p-6 bg-gradient-to-br from-[#F3F4F4] to-[#5F9598]/10 min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5F9598] to-[#1D546D] p-6 text-white">
            <h1 className="text-2xl font-bold">Notices & Instructions</h1>
            <p className="text-purple-100">Stay updated with important announcements</p>
          </div>

          {/* Filter Tabs */}
          <div className="border-b bg-gray-50">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filter === 'all'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Notices
              </button>
              <button
                onClick={() => setFilter('holiday')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filter === 'holiday'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Holidays
              </button>
              <button
                onClick={() => setFilter('route_change')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filter === 'route_change'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Route Changes
              </button>
              <button
                onClick={() => setFilter('instruction')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filter === 'instruction'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => setFilter('meeting')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filter === 'meeting'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Meetings
              </button>
            </nav>
          </div>

          {/* Notices List */}
          <div className="p-6">
            {filteredNotices.length === 0 ? (
              <div className="text-center py-8">
                <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-600">No notices found for the selected filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotices.map((notice) => {
                  const IconComponent = getIcon(notice.type);
                  return (
                    <div key={notice.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <IconComponent className={`text-xl mr-3 ${getTypeColor(notice.type)}`} />
                          <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{notice.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{notice.date}</span>
                        </div>
                        <span>By: {notice.author}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Important Reminders */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Reminders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <FaExclamationTriangle className="text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800">Daily Checklist</h3>
              </div>
              <p className="text-sm text-yellow-700">Complete your daily vehicle checklist before starting trips.</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <FaClock className="text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Punctuality</h3>
              </div>
              <p className="text-sm text-blue-700">Maintain scheduled timings for all pickup and drop points.</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Safety First</h3>
              </div>
              <p className="text-sm text-green-700">Always prioritize student safety and follow traffic rules.</p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center mb-2">
                <FaBullhorn className="text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Communication</h3>
              </div>
              <p className="text-sm text-purple-700">Report any issues or emergencies immediately to admin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;