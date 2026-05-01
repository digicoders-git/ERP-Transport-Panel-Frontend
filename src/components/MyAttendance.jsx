import React, { useState, useEffect } from 'react';
import { FaCalendar, FaSearch, FaSpinner } from 'react-icons/fa';
import api from '../api';
import { toast } from 'react-toastify';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMode, setActiveMode] = useState('manual');

    useEffect(() => {
        fetchAttendance();
        fetchActiveMode();
    }, []);

    const fetchActiveMode = async () => {
        try {
            const { data } = await api.get('/staff-panel/attendance-config/settings');
            if (data.success) {
                setActiveMode(data.data.staffMode || 'manual');
            }
        } catch (error) {
            console.error('Failed to fetch mode', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/staff-panel/attendance-staff/my-history');
            if (data.success) {
                setAttendance(data.data);
            }
        } catch (error) {
            toast.error('Failed to load attendance history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'bg-emerald-100 text-emerald-700';
            case 'absent': return 'bg-rose-100 text-rose-700';
            case 'late': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const filtered = attendance.filter(a => 
        new Date(a.date).toLocaleDateString().includes(searchTerm)
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <FaSpinner className="animate-spin text-3xl text-indigo-600 mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Personnel Logs...</p>
        </div>
    );

    return (
        <div className="space-y-6 mt-25">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">My Attendance Log</h2>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                            activeMode === 'manual' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            activeMode === 'biometric' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            activeMode === 'hybrid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                            <div className={`w-1 h-1 rounded-full animate-pulse ${
                                activeMode === 'manual' ? 'bg-blue-600' :
                                activeMode === 'biometric' ? 'bg-purple-600' :
                                activeMode === 'hybrid' ? 'bg-emerald-600' :
                                'bg-orange-600'
                            }`}></div>
                            {activeMode} Mode Live
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Verified work presence and logs</p>
                </div>
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        placeholder="SEARCH DATE..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest">
                            <th className="px-6 py-5 text-left">Date</th>
                            <th className="px-6 py-5 text-left">Status</th>
                            <th className="px-6 py-5 text-left">Time In</th>
                            <th className="px-6 py-5 text-left">Time Out</th>
                            <th className="px-6 py-5 text-left">Source</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-black text-slate-700">
                                    {new Date(item.date).toLocaleDateString('en-IN')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-500">{item.timeIn ? new Date(item.timeIn).toLocaleTimeString() : '-'}</td>
                                <td className="px-6 py-4 font-bold text-slate-500">{item.timeOut ? new Date(item.timeOut).toLocaleTimeString() : '-'}</td>
                                <td className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.source}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAttendance;
