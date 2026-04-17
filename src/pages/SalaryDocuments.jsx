import React, { useEffect, useState } from 'react';
import { 
  FaFileDownload, 
  FaMoneyBillWave, 
  FaCalendar, 
  FaFileAlt, 
  FaCheckCircle,
  FaShieldAlt,
  FaArrowRight,
  FaHistory,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { MdAccountBalanceWallet, MdDescription, MdVerified, MdInfoOutline } from 'react-icons/md';
import { driverSalaryAPI } from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SalaryDocuments = () => {
  const [activeTab, setActiveTab] = useState('salary');
  
  const [salaryData, setSalaryData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compute Year to date
  const computeYTD = () => salaryData.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);
  const computeBonus = () => salaryData.reduce((acc, curr) => acc + (curr.allowances || 0), 0);
  const computeCurrent = () => salaryData.length > 0 ? salaryData[0].netSalary : 0;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salaryResponse, docsResponse] = await Promise.all([
        driverSalaryAPI.getSalary().catch(() => ({ data: { data: [] } })),
        driverSalaryAPI.getDocuments().catch(() => ({ data: { data: [] } }))
      ]);
      setSalaryData(salaryResponse.data?.data?.salaryHistory || []);
      setDocuments(docsResponse.data?.data?.documents || []);
    } catch (error) {
       toast.error('Failed to sync financial data');
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5002';

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                 Finance & Records
              </span>
           </div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">SALARY & DOCUMENTS</h1>
           <p className="text-slate-500 font-medium text-sm">Review your payroll history and compliance documentation.</p>
        </div>
      </div>

      {/* Simplified Tabs */}
      <div className="flex p-1 bg-white rounded-lg shadow-sm border border-slate-200 max-w-xs">
        <button
          onClick={() => setActiveTab('salary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold uppercase tracking-wider text-[10px] transition-all ${
            activeTab === 'salary'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FaMoneyBillWave /> PAYROLL
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold uppercase tracking-wider text-[10px] transition-all ${
            activeTab === 'documents'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MdDescription /> ARCHIVES
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'salary' ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Current Earnings', val: `₹${computeCurrent().toLocaleString()}`, icon: MdAccountBalanceWallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Year To Date', val: `₹${computeYTD().toLocaleString()}`, icon: FaHistory, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Asset Bonus', val: `₹${computeBonus().toLocaleString()}`, icon: MdVerified, color: 'text-blue-600', bg: 'bg-blue-50' }
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

          {/* Salary Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-50 bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {salaryData.length > 0 ? salaryData.map((salary) => (
                    <tr key={salary._id || salary.month} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 font-bold text-slate-800">{salary.month}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">₹{salary.netSalary?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 ${salary.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit`}>
                          <MdVerified size={12} /> {salary.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a href={salary.slipUrl ? `${API_URL}${salary.slipUrl}` : '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex items-center justify-center transition-all">
                          <FaFileDownload size={16} />
                        </a>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center py-20 bg-slate-50 border-t border-slate-50 text-slate-400 uppercase tracking-widest text-[10px] font-bold">No Pay Slips recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.length > 0 ? documents.map((doc) => (
              <div key={doc._id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 group transition-all hover:border-indigo-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                     <FaFileInvoiceDollar size={20} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    doc.status === 'Valid' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">{doc.documentName}</h3>
                <p className="text-slate-400 text-xs font-medium mb-6">{doc.documentType}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                     <span className="text-slate-400 uppercase tracking-wider">Uploaded</span>
                     <span className="text-slate-700 font-bold">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium">
                     <span className="text-slate-400 uppercase tracking-wider">Expiry</span>
                     <span className={`${doc.status === 'Valid' ? 'text-slate-700' : 'text-rose-600'} font-bold`}>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <a href={`${API_URL}${doc.fileUrl}`} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg transition-all font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 active:scale-95">
                  <FaFileDownload size={14} /> Download
                </a>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm text-slate-400 tracking-widest text-[10px] font-bold uppercase">
                No Archive Documents Attached.
              </div>
            )}
          </div>

          {/* Compliance Alerts */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
               <MdInfoOutline size={24} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-amber-900 tracking-tight mb-1">Compliance & Alerts</h3>
               <p className="text-amber-800 font-medium text-sm mb-4">
                  Insurance Protocol expires on 2024-08-20. Please update your documentation soon.
               </p>
               <button className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider hover:translate-x-1 transition-all">
                  Update Documentation <FaArrowRight size={10} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryDocuments;
