import React, { useState, useEffect } from 'react';
import { 
  FaBullhorn, 
  FaCalendar, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaChevronDown, 
  FaChevronUp,
  FaCaretRight,
  FaRegLightbulb
} from 'react-icons/fa';
import { MdOutlineAnnouncement, MdVerified, MdOutlineScheduleSend } from 'react-icons/md';
import { driverDashboardAPI } from '../api';
import { toast } from 'react-toastify';

const Notices = () => {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await driverDashboardAPI.getNotices();
      setNotices(response.data?.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Notice synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const priorityStyles = {
    high: 'bg-rose-50 text-rose-600 border-rose-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  const getTypeStyle = (type) => {
    switch(type?.toLowerCase()) {
      case 'urgent': return 'border-l-4 border-l-rose-500 bg-white border-y border-r border-slate-200';
      case 'important': return 'border-l-4 border-l-amber-500 bg-white border-y border-r border-slate-200';
      case 'general': return 'border-l-4 border-l-indigo-500 bg-white border-y border-r border-slate-200';
      default: return 'border-l-4 border-l-slate-400 bg-white border-y border-r border-slate-200';
    }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center h-screen bg-slate-50">
         <div className="text-center">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-slate-600 font-bold tracking-widest animate-pulse uppercase text-xs">Loading Announcements...</p>
         </div>
       </div>
     );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen mt-15">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                    Announcements
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ACTIVE
                 </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight text-uppercase">NOTICE BOARD</h1>
              <p className="text-slate-500 font-medium text-sm">Stay updated with the latest operational news and bulletins.</p>
           </div>
           
           <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center shadow-sm">
                    <FaBullhorn className="text-slate-400 text-xs" />
                 </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center shadow-sm">
                 <span className="text-white font-bold text-[10px]">+{notices.length}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Notices', val: notices.length, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: MdOutlineAnnouncement },
          { label: 'Urgent Alerts', val: notices.filter(n => n.type?.toLowerCase() === 'urgent').length, color: 'text-rose-600', bg: 'bg-rose-50', icon: FaExclamationCircle },
          { label: 'General Info', val: notices.filter(n => n.type?.toLowerCase() === 'important').length, color: 'text-amber-600', bg: 'bg-amber-50', icon: FaRegLightbulb }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <p className={`text-2xl font-bold ${stat.color} tracking-tight`}>{stat.val}</p>
            </div>
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-lg`}>
               <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Notice Feed */}
      <div className="space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div
              key={notice._id}
              onClick={() => setSelectedNotice(selectedNotice?._id === notice._id ? null : notice)}
              className={`rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-sm ${getTypeStyle(notice.type)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm border ${priorityStyles[notice.priority?.toLowerCase()] || priorityStyles.low}`}>
                    {notice.priority?.toLowerCase() === 'high' ? <FaExclamationCircle /> : <FaBullhorn />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none mb-2">{notice.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100">
                        <MdOutlineScheduleSend size={14} className="text-slate-400" />
                        <span>Posted: {new Date(notice.publishDate).toLocaleDateString()}</span>
                      </div>
                      {notice.expiryDate && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 text-rose-600 rounded border border-rose-100">
                          <FaCalendar size={12} className="text-rose-400" />
                          <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 uppercase">
                         <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
                         {notice.type || 'General'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                   {selectedNotice?._id === notice._id ? <FaChevronUp className="text-slate-400" size={12} /> : <FaChevronDown className="text-slate-400" size={12} />}
                </div>
              </div>

              {/* Expanded Content */}
              {selectedNotice?._id === notice._id && (
                <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                       {notice.content}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                     <button className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:gap-3 transition-all">
                        Mark as Read <FaCaretRight />
                     </button>
                  </div>
                </div>
              )}

              {/* Preview with truncation */}
              {selectedNotice?._id !== notice._id && (
                <p className="mt-4 text-slate-500 text-sm line-clamp-2 md:pl-16 italic">
                  "{notice.content}"
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaBullhorn className="text-3xl text-slate-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">No Active Notices</h2>
            <p className="text-slate-400 text-sm mt-1">There are currently no announcements to display.</p>
          </div>
        )}
      </div>

      {/* Priority Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px] flex items-center gap-2">
           Legend: Priority Levels
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: 'High Priority', color: 'bg-rose-500' },
            { label: 'Important', color: 'bg-amber-500' },
            { label: 'Information', color: 'bg-indigo-500' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notices;
