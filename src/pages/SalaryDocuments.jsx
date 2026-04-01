import React, { useState } from 'react';
import { FaMoneyBillWave, FaDownload, FaFileAlt, FaIdCard, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SalaryDocuments = () => {
  const [activeTab, setActiveTab] = useState('salary');
  const driverId = localStorage.getItem('driverId');

  const salaryData = {
    DRV001: {
      monthlySalary: 25000,
      currentMonth: 'January 2024',
      paymentStatus: 'Paid',
      paymentDate: '2024-01-31',
      salaryHistory: [
        { month: 'December 2023', amount: 25000, status: 'Paid', date: '2023-12-31' },
        { month: 'November 2023', amount: 25000, status: 'Paid', date: '2023-11-30' },
        { month: 'October 2023', amount: 24000, status: 'Paid', date: '2023-10-31' }
      ]
    },
    DRV002: {
      monthlySalary: 28000,
      currentMonth: 'January 2024',
      paymentStatus: 'Pending',
      paymentDate: null,
      salaryHistory: [
        { month: 'December 2023', amount: 28000, status: 'Paid', date: '2023-12-31' },
        { month: 'November 2023', amount: 28000, status: 'Paid', date: '2023-11-30' }
      ]
    },
    DRV003: {
      monthlySalary: 26000,
      currentMonth: 'January 2024',
      paymentStatus: 'Paid',
      paymentDate: '2024-01-31',
      salaryHistory: [
        { month: 'December 2023', amount: 26000, status: 'Paid', date: '2023-12-31' },
        { month: 'November 2023', amount: 26000, status: 'Paid', date: '2023-11-30' }
      ]
    }
  };

  const documentsData = {
    DRV001: {
      drivingLicense: {
        number: 'DL-1420110012345',
        expiry: '2025-12-31',
        status: 'Valid'
      },
      medicalCertificate: {
        issueDate: '2023-06-15',
        expiry: '2024-06-15',
        status: 'Valid'
      },
      insurance: {
        policyNumber: 'INS-2023-001234',
        expiry: '2024-03-31',
        status: 'Valid'
      },
      rcBook: {
        number: 'UP14AB1234',
        expiry: '2025-01-15',
        status: 'Valid'
      }
    },
    DRV002: {
      drivingLicense: {
        number: 'DL-1420110012346',
        expiry: '2026-06-30',
        status: 'Valid'
      },
      medicalCertificate: {
        issueDate: '2023-08-20',
        expiry: '2024-08-20',
        status: 'Valid'
      },
      insurance: {
        policyNumber: 'INS-2023-001235',
        expiry: '2024-05-15',
        status: 'Valid'
      },
      rcBook: {
        number: 'UP14CD5678',
        expiry: '2025-03-20',
        status: 'Valid'
      }
    },
    DRV003: {
      drivingLicense: {
        number: 'DL-1420110012347',
        expiry: '2024-09-15',
        status: 'Expiring Soon'
      },
      medicalCertificate: {
        issueDate: '2023-04-10',
        expiry: '2024-04-10',
        status: 'Expiring Soon'
      },
      insurance: {
        policyNumber: 'INS-2023-001236',
        expiry: '2024-07-30',
        status: 'Valid'
      },
      rcBook: {
        number: 'UP14EF9012',
        expiry: '2025-05-25',
        status: 'Valid'
      }
    }
  };

  const salary = salaryData[driverId] || salaryData.DRV001;
  const documents = documentsData[driverId] || documentsData.DRV001;

  const downloadSalarySlip = (month) => {
    toast.success(`Downloading salary slip for ${month}`);
  };

  const downloadDocument = (docType) => {
    toast.success(`Downloading ${docType} document`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#F3F4F4] to-[#5F9598]/10 min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5F9598] to-[#1D546D] p-6 text-white">
            <h1 className="text-2xl font-bold">Salary & Documents</h1>
            <p className="text-green-100">View your salary information and documents</p>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('salary')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'salary'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Salary Information
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'documents'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'salary' && (
              <div>
                {/* Current Salary Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaMoneyBillWave className="text-green-500 text-2xl mr-3" />
                      <span className="font-medium">Monthly Salary</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">₹{salary.monthlySalary.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                      <span className="font-medium">Current Month</span>
                    </div>
                    <p className="text-xl font-semibold text-blue-700">{salary.currentMonth}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center mb-2">
                      {salary.paymentStatus === 'Paid' ? (
                        <FaCheckCircle className="text-green-500 text-2xl mr-3" />
                      ) : (
                        <FaClock className="text-orange-500 text-2xl mr-3" />
                      )}
                      <span className="font-medium">Payment Status</span>
                    </div>
                    <p className={`text-xl font-semibold ${
                      salary.paymentStatus === 'Paid' ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {salary.paymentStatus}
                    </p>
                    {salary.paymentDate && (
                      <p className="text-sm text-gray-600 mt-1">Paid on: {salary.paymentDate}</p>
                    )}
                  </div>
                </div>

                {/* Salary History */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Salary History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {salary.salaryHistory.map((record, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {record.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              ₹{record.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.status === 'Paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {record.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => downloadSalarySlip(record.month)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <FaDownload /> Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-semibold mb-6 text-gray-800">Document Status (View Only)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Driving License */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaIdCard className="text-blue-500 text-xl mr-3" />
                        <h4 className="font-semibold text-gray-800">Driving License</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        documents.drivingLicense.status === 'Valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {documents.drivingLicense.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Number: {documents.drivingLicense.number}</p>
                    <p className="text-sm text-gray-600 mb-3">Expires: {documents.drivingLicense.expiry}</p>
                    <button
                      onClick={() => downloadDocument('Driving License')}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>

                  {/* Medical Certificate */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaFileAlt className="text-green-500 text-xl mr-3" />
                        <h4 className="font-semibold text-gray-800">Medical Certificate</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        documents.medicalCertificate.status === 'Valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {documents.medicalCertificate.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Issued: {documents.medicalCertificate.issueDate}</p>
                    <p className="text-sm text-gray-600 mb-3">Expires: {documents.medicalCertificate.expiry}</p>
                    <button
                      onClick={() => downloadDocument('Medical Certificate')}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>

                  {/* Insurance */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaFileAlt className="text-purple-500 text-xl mr-3" />
                        <h4 className="font-semibold text-gray-800">Vehicle Insurance</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        documents.insurance.status === 'Valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {documents.insurance.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Policy: {documents.insurance.policyNumber}</p>
                    <p className="text-sm text-gray-600 mb-3">Expires: {documents.insurance.expiry}</p>
                    <button
                      onClick={() => downloadDocument('Insurance')}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>

                  {/* RC Book */}
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaIdCard className="text-orange-500 text-xl mr-3" />
                        <h4 className="font-semibold text-gray-800">RC Book</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        documents.rcBook.status === 'Valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {documents.rcBook.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Number: {documents.rcBook.number}</p>
                    <p className="text-sm text-gray-600 mb-3">Expires: {documents.rcBook.expiry}</p>
                    <button
                      onClick={() => downloadDocument('RC Book')}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDocuments;