import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaCar, FaGasPump, FaLightbulb, FaVolumeUp, FaWrench } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VehicleChecklist = () => {
  const [checklist, setChecklist] = useState({
    brakes: null,
    lights: null,
    horn: null,
    fuel: '',
    tyres: null,
    engine: null,
    mirrors: null,
    seatbelts: null,
    firstAid: null,
    fireExtinguisher: null
  });

  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');

  const handleChecklistChange = (item, value) => {
    setChecklist(prev => ({
      ...prev,
      [item]: value
    }));
  };

  const handleSubmit = () => {
    const allChecked = Object.entries(checklist).every(([key, value]) => {
      if (key === 'fuel') return value !== '';
      return value !== null;
    });

    if (!allChecked) {
      toast.error('Please complete all checklist items');
      return;
    }

    setSubmitted(true);
    toast.success('Daily checklist submitted successfully!');
  };

  const checklistItems = [
    {
      key: 'brakes',
      label: 'Brakes',
      icon: FaCar,
      description: 'Check brake pedal response and brake fluid'
    },
    {
      key: 'lights',
      label: 'Lights',
      icon: FaLightbulb,
      description: 'Headlights, taillights, indicators, hazard lights'
    },
    {
      key: 'horn',
      label: 'Horn',
      icon: FaVolumeUp,
      description: 'Test horn functionality'
    },
    {
      key: 'tyres',
      label: 'Tyres',
      icon: FaCar,
      description: 'Check tyre pressure and condition'
    },
    {
      key: 'engine',
      label: 'Engine',
      icon: FaWrench,
      description: 'Engine oil, coolant, battery'
    },
    {
      key: 'mirrors',
      label: 'Mirrors',
      icon: FaCar,
      description: 'All mirrors clean and properly adjusted'
    },
    {
      key: 'seatbelts',
      label: 'Seatbelts',
      icon: FaCar,
      description: 'Driver and passenger seatbelts working'
    },
    {
      key: 'firstAid',
      label: 'First Aid Kit',
      icon: FaWrench,
      description: 'First aid kit present and stocked'
    },
    {
      key: 'fireExtinguisher',
      label: 'Fire Extinguisher',
      icon: FaWrench,
      description: 'Fire extinguisher present and functional'
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-[#F3F4F4] to-[#5F9598]/10 min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5F9598] to-[#1D546D] p-6 text-white">
            <h1 className="text-2xl font-bold">Daily Vehicle Checklist</h1>
            <p className="text-green-100">Complete your daily safety inspection</p>
            <p className="text-sm text-green-100 mt-2">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Checklist Completed!</h2>
                <p className="text-gray-600">Your daily vehicle inspection has been submitted.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setChecklist({
                      brakes: null,
                      lights: null,
                      horn: null,
                      fuel: '',
                      tyres: null,
                      engine: null,
                      mirrors: null,
                      seatbelts: null,
                      firstAid: null,
                      fireExtinguisher: null
                    });
                    setNotes('');
                  }}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  New Checklist
                </button>
              </div>
            ) : (
              <>
                {/* Fuel Level */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FaGasPump className="text-blue-500 text-xl mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">Fuel Level</h3>
                  </div>
                  <select
                    value={checklist.fuel}
                    onChange={(e) => handleChecklistChange('fuel', e.target.value)}
                    className="w-full p-3 border cursor-pointer border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select fuel level</option>
                    <option value="full">Full (75-100%)</option>
                    <option value="three-quarter">3/4 (50-75%)</option>
                    <option value="half">Half (25-50%)</option>
                    <option value="quarter">1/4 (0-25%)</option>
                    <option value="empty">Empty (Refuel Required)</option>
                  </select>
                </div>

                {/* Checklist Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {checklistItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.key} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-3">
                          <IconComponent className="text-gray-600 text-xl mr-3" />
                          <h3 className="font-semibold text-gray-800">{item.label}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleChecklistChange(item.key, true)}
                            className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition ${
                              checklist[item.key] === true
                                ? 'bg-green-500 text-white cursor-pointer'
                                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                            }`}
                          >
                            <FaCheckCircle className="mr-2" />
                            Good
                          </button>
                          <button
                            onClick={() => handleChecklistChange(item.key, false)}
                            className={`flex cursor-pointer items-center px-4 py-2 rounded-lg transition ${
                              checklist[item.key] === false
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                            }`}
                          >
                            <FaTimesCircle className="mr-2" />
                            Issue
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional observations or issues..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                  >
                    Submit Daily Checklist
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Previous Reports */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Checklist History</h2>
          <div className="space-y-3">
            {[
              { date: '2024-01-15', status: 'All Good', issues: 0 },
              { date: '2024-01-14', status: 'Minor Issues', issues: 1 },
              { date: '2024-01-13', status: 'All Good', issues: 0 }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{report.date}</p>
                  <p className="text-sm text-gray-600">{report.status}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  report.issues === 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.issues === 0 ? 'No Issues' : `${report.issues} Issue(s)`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleChecklist;