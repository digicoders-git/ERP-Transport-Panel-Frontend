import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHistory, 
  FaClipboardCheck,
  FaTools,
  FaShieldAlt,
  FaCogs,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdOutlineSecurity, MdVerified, MdSettingsSuggest, MdHistoryToggleOff } from 'react-icons/md';
import { vehicleChecklistAPI } from '../api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const VehicleChecklist = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todaySubmitted, setTodaySubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brakes: true,
    lights: true,
    horn: true,
    fuel: true,
    tyres: true,
    engine: true,
    mirrors: true,
    seatbelts: true,
    firstAid: true,
    fireExtinguisher: true,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchChecklistData();
  }, []);

  const fetchChecklistData = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        vehicleChecklistAPI.getToday(),
        vehicleChecklistAPI.getHistory(1, 20)
      ]);

      setTodaySubmitted(!!todayRes.data?.data);
      setHistory(historyRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast.error('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: 'Confirm Inspection?',
      text: 'Are you sure all vehicle systems have been checked?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Confirm Submission',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-[10px]',
        cancelButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-[10px]'
      }
    });

    if (!result.isConfirmed) return;

    try {
      setSubmitting(true);
      await vehicleChecklistAPI.submit(formData);
      toast.success('Inspection report submitted');
      setShowForm(false);
      setTodaySubmitted(true);
      fetchChecklistData();
    } catch (error) {
      console.error('Error submitting checklist:', error);
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const checklistItems = [
    { key: 'brakes', label: 'Brakes Condition', icon: '🛑' },
    { key: 'lights', label: 'Headlights/Indicators', icon: '💡' },
    { key: 'horn', label: 'Horn Condition', icon: '📢' },
    { key: 'fuel', label: 'Fuel Level Status', icon: '⛽' },
    { key: 'tyres', label: 'Tyre Pressure/Grip', icon: '🛞' },
    { key: 'engine', label: 'Engine Health', icon: '⚙️' },
    { key: 'mirrors', label: 'Mirror Visibility', icon: '🪞' },
    { key: 'seatbelts', label: 'Seatbelt Safety', icon: '🔒' },
    { key: 'firstAid', label: 'First Aid Kit', icon: '🏥' },
    { key: 'fireExtinguisher', label: 'Fire Extinguisher', icon: '🧯' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                    Fleet Maintenance
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-bold border border-emerald-100 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Certified
                 </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase leading-tight">MAINTENANCE CHECKLIST</h1>
              <p className="text-slate-500 font-medium text-sm">Regular inspection of critical vehicle components.</p>
           </div>
           
           <div className="bg-slate-50 rounded-xl px-6 py-4 border border-slate-100 text-right min-w-[200px]">
              <div className="flex items-center justify-end gap-2 text-indigo-400 mb-1">
                 <MdVerified size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Unit Status</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 leading-none">GOOD CONDITION</p>
           </div>
        </div>
      </div>

      {/* Submission Status */}
      <div className={`p-6 rounded-xl border transition-all ${todaySubmitted ? 'bg-white border-slate-200' : 'bg-amber-50 border-amber-100'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${todaySubmitted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {todaySubmitted ? <MdOutlineSecurity /> : <FaExclamationTriangle className="animate-pulse" />}
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">
                  {todaySubmitted ? 'Daily Inspection Logged' : 'New Report Required'}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {todaySubmitted ? 'Your vehicle status has been recorded for today.' : 'Please perform a routine systems check before departure.'}
                </p>
             </div>
          </div>
          {!todaySubmitted && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <FaClipboardCheck size={14} /> START INSPECTION
            </button>
          )}
        </div>
      </div>

      {/* Inspection Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200 animate-in slide-in-from-top-4 duration-500">
          <div className="mb-8 pb-4 border-b border-slate-50">
            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight text-slate-800">System Parameters</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Mark the condition of each component</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {checklistItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleItem(item.key)}
                  className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden ${
                    formData[item.key]
                      ? 'border-emerald-500 bg-emerald-50/10'
                      : 'border-rose-500 bg-rose-50/10'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className="font-bold text-[9px] uppercase tracking-widest text-slate-800 text-center leading-tight">{item.label}</span>
                  <div className={`mt-2 flex items-center gap-1 font-bold text-[8px] uppercase tracking-[0.2em] ${formData[item.key] ? 'text-emerald-600' : 'text-rose-600'}`}>
                     {formData[item.key] ? (
                       <><FaCheckCircle size={10} /> Normal</>
                     ) : (
                       <><FaTimesCircle size={10} /> Faulty</>
                     )}
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Additional Observations</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Declare any malfunctions or specific details here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-slate-800 min-h-[100px] placeholder:text-slate-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <FaCogs className="animate-spin" /> : <MdVerified size={14} />}
                <span>Log Inspection Record</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-3.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Audit Logs */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <MdHistoryToggleOff size={20} />
             </div>
             <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">Recent Inspection History</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item._id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:bg-white hover:border-indigo-100 hover:shadow-sm">
                <div className="flex items-center justify-between mb-3">
                   <div>
                      <p className="text-xs font-bold text-slate-800 tracking-tight">{new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-0.5 ${item.status === 'All Good' ? 'text-emerald-500' : 'text-amber-500'}`}>
                         {item.status === 'All Good' ? 'CLEARED' : 'ISSUE LOGGED'}
                      </p>
                   </div>
                   <div className={`p-2 rounded-lg ${item.status === 'All Good' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.status === 'All Good' ? <FaShieldAlt size={14} /> : <FaTools size={14} />}
                   </div>
                </div>
                {item.notes && (
                  <p className="text-[10px] font-medium text-slate-400 italic line-clamp-2 leading-relaxed">"{item.notes}"</p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No historical data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleChecklist;
