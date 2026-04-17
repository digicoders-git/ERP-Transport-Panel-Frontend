import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaHistory, 
  FaCheckCircle, 
  FaClock, 
  FaInfoCircle, 
  FaArrowRight, 
  FaExclamationCircle
} from 'react-icons/fa';
import { MdReportProblem, MdVerified, MdOutlineNotificationImportant, MdOutlinePostAdd } from 'react-icons/md';
import { driverComplaintAPI } from '../api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const EmergencyComplaints = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    reportType: 'complaint',
    category: '',
    description: ''
  });

  const reportTypes = [
    { 
      value: 'complaint', 
      label: 'Standard Report', 
      icon: <MdReportProblem />, 
      color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      desc: 'Operational issues or non-urgent feedback'
    },
    { 
      value: 'emergency', 
      label: 'Emergency Alert', 
      icon: <FaExclamationTriangle />, 
      color: 'bg-rose-50 border-rose-200 text-rose-600',
      desc: 'Immediate hazards requiring extraction or support'
    }
  ];

  const categories = {
    complaint: [
      'Vehicle Maintenance Issue',
      'Student Behavioral Log',
      'Navigational Barrier',
      'Civilian Interference',
      'Other Systems Issue'
    ],
    emergency: [
      'Traffic Collision',
      'Medical Evacuation Required',
      'Critical System Failure',
      'Safety Violation Level 4',
      'Other Response Required'
    ]
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await driverComplaintAPI.getMyHistory(1, 20);
      setHistory(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('History failed to sync');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description) {
      toast.error('All fields required');
      return;
    }

    const isEmergency = formData.reportType === 'emergency';
    const result = await Swal.fire({
      title: isEmergency ? 'Confirm Emergency Alert?' : 'Submit Report?',
      text: isEmergency 
        ? 'An emergency signal will be sent to administration.' 
        : 'This report will be logged and reviewed by administrators.',
      icon: isEmergency ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isEmergency ? '#e11d48' : '#4f46e5',
      confirmButtonText: isEmergency ? 'Send Alert' : 'Submit',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-8 py-3 font-bold uppercase tracking-wider',
        cancelButton: 'rounded-lg px-8 py-3 font-bold uppercase tracking-wider'
      }
    });

    if (!result.isConfirmed) return;

    try {
      setSubmitting(true);
      await driverComplaintAPI.submit(formData);
      toast.success(isEmergency ? 'Alert Sent' : 'Log Created');
      setShowForm(false);
      setFormData({ reportType: 'complaint', category: '', description: '' });
      fetchHistory();
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const statusMap = {
    'Pending': { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <FaClock /> },
    'In Progress': { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <FaInfoCircle /> },
    'Resolved': { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <FaCheckCircle /> }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center h-screen bg-slate-50">
         <div className="text-center">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-slate-600 font-bold tracking-widest animate-pulse uppercase">Syncing Feed...</p>
         </div>
       </div>
     );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                    Reports & Alerts
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold border border-rose-100">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span> LIVE
                 </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">EMERGENCY REPORTS</h1>
              <p className="text-slate-500 font-medium text-sm">Submit operational issues or emergency alerts to administration.</p>
           </div>
           
           <button 
             onClick={() => setShowForm(!showForm)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-[11px] shadow-sm active:scale-95 transition-all flex items-center gap-2"
           >
              {showForm ? <FaArrowRight className="rotate-90" /> : <MdOutlinePostAdd size={18} />}
              {showForm ? 'Hide Form' : 'New Report'}
           </button>
        </div>
      </div>

      {/* Grid Quick Entry */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-6 duration-500">
          {reportTypes.map(type => (
            <button
              key={type.value}
              onClick={() => {
                setFormData({...formData, reportType: type.value, category: ''});
                setShowForm(true);
              }}
              className={`p-8 rounded-xl border-2 border-dashed transition-all hover:bg-white/50 hover:-translate-y-1 relative overflow-hidden text-left ${type.color}`}
            >
              <div className="relative z-10">
                 <div className="text-4xl mb-4">{type.icon}</div>
                 <h3 className="font-bold text-xl tracking-tight uppercase mb-1">{type.label}</h3>
                 <p className="text-sm font-medium opacity-70 mb-6">{type.desc}</p>
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black/5 w-fit px-3 py-1.5 rounded-lg">
                    Report Now <FaArrowRight size={10} />
                 </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Form Interaction Overlay */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 mb-8">
             <div className={`p-3 rounded-xl text-lg ${formData.reportType === 'emergency' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {formData.reportType === 'emergency' ? <FaExclamationCircle /> : <MdOutlineNotificationImportant />}
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                   {formData.reportType === 'emergency' ? 'EMERGENCY BEACON' : 'OPERATIONAL LOG'}
                </h2>
                <p className="text-sm text-slate-400 font-medium">Capture details for review</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-800 text-sm uppercase tracking-wider cursor-pointer"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories[formData.reportType]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Urgency</label>
                  <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-lg h-[48px] items-center">
                     {reportTypes.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setFormData({...formData, reportType: t.value, category: ''})}
                          className={`flex-1 h-full rounded text-[10px] font-bold uppercase tracking-widest transition-all ${formData.reportType === t.value ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           {t.label}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Report Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Details of the incident or issue..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium text-slate-800 min-h-[120px]"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-[2] py-3 rounded-lg font-bold uppercase tracking-wider text-[11px] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                  formData.reportType === 'emergency'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {submitting ? 'TRANSMITTING...' : 'Submit Report'}
                <FaArrowRight size={12} />
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-lg hover:bg-slate-200 transition-all font-bold uppercase tracking-wider text-[10px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Report History</h2>
           </div>
           <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <FaHistory /> {history.length} Logs
           </span>
        </div>

        <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
          {history.length > 0 ? (
            history.map((report) => (
              <div key={report._id} className="p-6 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-indigo-100 transition-all">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                      report.reportType === 'emergency' 
                        ? 'bg-rose-50 border-rose-100' 
                        : 'bg-indigo-50 border-indigo-100'
                    }`}>
                      {report.reportType === 'emergency' ? '🚨' : '📝'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none mb-1.5">{report.category}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1">
                            <FaClock size={10} />
                            {new Date(report.createdAt).toLocaleDateString()}
                         </span>
                         <span>ID: #{report._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold uppercase tracking-widest text-[9px] ${statusMap[report.status]?.color || 'bg-slate-50'}`}>
                    {report.status}
                  </div>
                </div>

                <div className="md:pl-16 space-y-4">
                   <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{report.description}"
                   </p>
                   
                   {report.resolvedNote && (
                     <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                           <MdVerified className="text-emerald-600 mt-0.5" />
                           <div>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 leading-none">Resolution Note</p>
                              <p className="text-emerald-900 text-sm font-medium">{report.resolvedNote}</p>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-100">
               <p className="text-sm font-medium text-slate-400">No reports found in history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyComplaints;
