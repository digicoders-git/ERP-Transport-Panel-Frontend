import React, { useState } from 'react';
import { FaRoute, FaMapMarkerAlt, FaClock, FaUsers, FaPhone, FaGraduationCap, FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useSound from '../hooks/useSound';

const RouteDetails = () => {
  const driverId = localStorage.getItem('driverId');
  const [activeTab, setActiveTab] = useState('route');
  const [completedStops, setCompletedStops] = useState([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [currentStop, setCurrentStop] = useState(null);
  const [attendance, setAttendance] = useState({});
  const { playSound } = useSound();

  const routeData = {
    DRV001: {
      routeName: 'Route A - Morning',
      busNumber: 'UP-14-AB-1234',
      startTime: '7:00 AM',
      endTime: '8:30 AM',
      totalDistance: '15 km',
      stops: [
        { id: 1, name: 'Green Park', time: '7:30 AM', students: 5 },
        { id: 2, name: 'Central Mall', time: '7:45 AM', students: 8 },
        { id: 3, name: 'City Hospital', time: '8:00 AM', students: 7 },
        { id: 4, name: 'Main Market', time: '8:15 AM', students: 5 }
      ],
      students: [
        { id: 1, name: 'Aarav Sharma', class: '5A', stop: 'Green Park', contact: '+91 9876543210' },
        { id: 2, name: 'Priya Singh', class: '6B', stop: 'Green Park', contact: '+91 9876543211' },
        { id: 3, name: 'Rohit Kumar', class: '4C', stop: 'Central Mall', contact: '+91 9876543212' },
        { id: 4, name: 'Sneha Gupta', class: '7A', stop: 'Central Mall', contact: '+91 9876543213' },
        { id: 5, name: 'Arjun Patel', class: '5B', stop: 'City Hospital', contact: '+91 9876543214' }
      ]
    },
    DRV002: {
      routeName: 'Route B - Evening',
      busNumber: 'UP-14-CD-5678',
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      totalDistance: '18 km',
      stops: [
        { id: 1, name: 'City Center', time: '2:00 PM', students: 6 },
        { id: 2, name: 'Park Avenue', time: '2:15 PM', students: 9 },
        { id: 3, name: 'Metro Station', time: '2:30 PM', students: 8 },
        { id: 4, name: 'Shopping Complex', time: '2:45 PM', students: 7 }
      ],
      students: [
        { id: 1, name: 'Kavya Reddy', class: '8A', stop: 'City Center', contact: '+91 9876543215' },
        { id: 2, name: 'Vikram Joshi', class: '9B', stop: 'Park Avenue', contact: '+91 9876543216' },
        { id: 3, name: 'Ananya Das', class: '7C', stop: 'Metro Station', contact: '+91 9876543217' }
      ]
    },
    DRV003: {
      routeName: 'Route C - Both',
      busNumber: 'UP-14-EF-9012',
      startTime: '7:45 AM / 2:15 PM',
      endTime: '9:00 AM / 3:45 PM',
      totalDistance: '20 km',
      stops: [
        { id: 1, name: 'Mall Road', time: '7:45 AM', students: 7 },
        { id: 2, name: 'Tech Park', time: '8:00 AM', students: 6 },
        { id: 3, name: 'Residential Area', time: '8:15 AM', students: 8 },
        { id: 4, name: 'Bus Terminal', time: '8:30 AM', students: 7 }
      ],
      students: [
        { id: 1, name: 'Ishaan Verma', class: '10A', stop: 'Mall Road', contact: '+91 9876543218' },
        { id: 2, name: 'Riya Agarwal', class: '11B', stop: 'Tech Park', contact: '+91 9876543219' }
      ]
    }
  };

  const route = routeData[driverId] || routeData.DRV001;

  const openAttendanceModal = (stop) => {
    setCurrentStop(stop);
    setShowAttendanceModal(true);
  };

  const handleAttendanceSubmit = () => {
    const stopStudents = route.students.filter(student => student.stop === currentStop.name);
    const allMarked = stopStudents.every(student => attendance[student.id] !== undefined);
    
    if (!allMarked) {
      toast.warn('Please Take Attendence first!', {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }
    
    playSound('depart');
    setCompletedStops([...completedStops, currentStop.id]);
    setShowAttendanceModal(false);
    setCurrentStop(null);
    toast.success(`${currentStop.name} departed successfull!`, {
      position: "top-center",
      autoClose: 2000
    });
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold">{route.routeName}</h1>
            <p className="text-blue-100">Bus: {route.busNumber}</p>
          </div>

          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('route')}
                className={`px-6 py-3 font-medium cursor-pointer ${
                  activeTab === 'route'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Route Map
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-3 font-medium cursor-pointer ${
                  activeTab === 'students'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Student List
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'route' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaClock className="text-blue-500 mr-2" />
                      <span className="font-medium">Timing</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-700">{route.startTime} - {route.endTime}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaRoute className="text-green-500 mr-2" />
                      <span className="font-medium">Distance</span>
                    </div>
                    <p className="text-lg font-semibold text-green-700">{route.totalDistance}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaUsers className="text-purple-500 mr-2" />
                      <span className="font-medium">Progress</span>
                    </div>
                    <p className="text-lg font-semibold text-purple-700">{completedStops.length}/{route.stops.length} Stops</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  <h3 className="text-xl font-bold mb-6 text-[#061E29] tracking-wide">Route Map Status</h3>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-3 shadow-lg"></div>
                          <span className="text-sm font-semibold text-[#061E29]">Pending</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3 shadow-lg"></div>
                          <span className="text-sm font-semibold text-blue-700">Completed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-purple-400 rounded-full"></div>
                      
                      {route.stops.map((stop, index) => {
                        const isCompleted = completedStops.includes(stop.id);
                        return (
                          <div key={stop.id} className="relative flex items-center mb-6 last:mb-0">
                            <div className={`w-10 h-10 absolute left-1 rounded-full flex items-center justify-center z-10 shadow-lg ${
                              isCompleted ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {isCompleted ? (
                                <FaCheck className="text-white text-sm" />
                              ) : (
                                <FaMapMarkerAlt className="text-white text-xs" />
                              )}
                            </div>
                            
                            <div className="ml-12 flex-1 bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-bold text-gray-800 text-lg">{stop.name}</h4>
                                  <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                                    <div className="flex items-center">
                                      <FaClock className="mr-2 text-blue-500" />
                                      <span className="font-medium">{stop.time}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <FaUsers className="mr-2 text-blue-500" />
                                      <span className="font-medium">{stop.students} students</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {!isCompleted && (
                                  <button
                                    onClick={() => openAttendanceModal(stop)}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                                  >
                                    <FaUsers className="text-sm" />
                                    Take Attendance
                                  </button>
                                )}
                                
                                {isCompleted && (
                                  <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg flex items-center gap-2 border border-green-300 font-medium">
                                    <FaCheck />
                                    Completed
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Student List (Read Only)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pickup Point
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emergency Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {route.students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <FaGraduationCap className="text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="text-red-500 mr-1" />
                              {student.stop}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FaPhone className="text-green-500 mr-1" />
                              {student.contact}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && currentStop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Attendance - {currentStop.name}
              </h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {route.students
                .filter(student => student.stop === currentStop.name)
                .map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          attendance[student.id] === 'present'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setAttendance(prev => ({ ...prev, [student.id]: 'absent' }))}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          attendance[student.id] === 'absent'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAttendanceSubmit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <FaPlay className="text-sm" />
                Depart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;