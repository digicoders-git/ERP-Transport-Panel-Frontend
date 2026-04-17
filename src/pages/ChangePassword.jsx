import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { driverAPI } from '../api';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.oldPassword) errs.oldPassword = 'Current password is required';
    if (!formData.newPassword) errs.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm password';
    else if (formData.newPassword !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (formData.oldPassword === formData.newPassword) errs.newPassword = 'New password must be different from current';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);
      await driverAPI.changePassword(formData.oldPassword, formData.newPassword);
      toast.success('Password changed successfully');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password';
      toast.error(msg);
      if (msg.includes('current')) {
        setErrors({ oldPassword: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium ${
    errors[field] ? 'border-red-400' : 'border-slate-200'
  }`;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
              Security
           </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">CHANGE PASSWORD</h1>
        <p className="text-slate-500 font-medium text-sm">Update your account security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Current Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-slate-400" />
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={formData.oldPassword}
                    onChange={(e) => {
                      setFormData({...formData, oldPassword: e.target.value});
                      setErrors({...errors, oldPassword: ''});
                    }}
                    className={inputClass('oldPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                    className="absolute right-3 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1 uppercase tracking-tight">{errors.oldPassword}</p>}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-slate-400" />
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({...formData, newPassword: e.target.value});
                      setErrors({...errors, newPassword: ''});
                    }}
                    className={inputClass('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1 uppercase tracking-tight">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm New Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-slate-400" />
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({...formData, confirmPassword: e.target.value});
                      setErrors({...errors, confirmPassword: ''});
                    }}
                    className={inputClass('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-3 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 pl-1 uppercase tracking-tight">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 transition-all font-bold uppercase tracking-wider text-[11px] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm active:scale-95"
              >
                {loading ? 'Updating Credentials...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Info Area */}
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <FaShieldAlt size={18} />
              </div>
              <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-wider">Security Protocols</h3>
            </div>
            <ul className="text-xs text-indigo-800 space-y-3 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                <span>Use a complex mix of letters, numbers & symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                <span>Minimum length must be at least 6 characters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                <span>Unique passwords prevent account vulnerability.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                <span>Avoid sharing credentials with unauthorized personnel.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
