import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import API_URL from '../config/api';

interface Report {
  _id: string;
  timestamp: string;
  type: string;
  details: string;
  status: string;
}

const Report = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'review',
    details: '',
    profileId: '',
    chatId: ''
  });

  const fetchUserEmail = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserEmail(response.data.user.email);
    } catch (error) {
      console.error('Failed to fetch user email');
    }
  };

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    let enhancedDetails = formData.details;
    if (formData.type === 'profile-report' && formData.profileId) {
      enhancedDetails = `Profile: ${formData.profileId}\n${formData.details}`;
    } else if (formData.type === 'chat-report' && formData.chatId) {
      enhancedDetails = `Chat ID: ${formData.chatId}\n${formData.details}`;
    }
  
    try {
      await axios.post(`${API_URL}/reports`, {
        type: formData.type,
        details: enhancedDetails,
        userEmail: userEmail
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchReports();
      setFormData({ type: 'review', details: '', profileId: '', chatId: '' });
    } catch (error) {
      console.error('Failed to submit report');
    }
  };

  useEffect(() => {
    fetchReports();
    fetchUserEmail();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Reports & Feedback</h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Submit reports, provide feedback, and track your submissions to help improve our community
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-secondary-900">Your Reports</h2>
            <p className="text-secondary-600">Manage and track your submitted reports</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus size={20} />
            New Report
          </button>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 overflow-hidden">
          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">No reports yet</h3>
              <p className="text-secondary-600 mb-6">Start by creating your first report to track issues or provide feedback</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus size={18} />
                Create First Report
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-secondary-50 to-primary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Submitted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-secondary-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-secondary-700">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(report.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          report.type === 'review' 
                            ? 'bg-success-100 text-success-700'
                            : report.type === 'profile-report'
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-error-100 text-error-700'
                        }`}>
                          {report.type === 'profile-report' ? 'Profile Report' : 
                           report.type === 'chat-report' ? 'Chat Report' : 'Review'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-700 max-w-xs">
                        <div className="truncate" title={report.details}>
                          {report.details}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'resolved' 
                            ? 'bg-success-100 text-success-700'
                            : report.status === 'in-progress'
                            ? 'bg-accent-100 text-accent-700'
                            : 'bg-secondary-100 text-secondary-700'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            report.status === 'resolved' 
                              ? 'bg-success-400'
                              : report.status === 'in-progress'
                              ? 'bg-accent-400'
                              : 'bg-secondary-400'
                          }`}></div>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Report</h2>
                  <p className="text-primary-100 text-sm mt-1">Help us improve the community</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-3">Report Type</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'review', label: 'General Review', desc: 'Share feedback about your experience', icon: '⭐' },
                      { value: 'profile-report', label: 'Profile Report', desc: 'Report inappropriate profile content', icon: '👤' },
                      { value: 'chat-report', label: 'Chat Report', desc: 'Report inappropriate chat behavior', icon: '💬' }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.type === option.value
                            ? 'border-primary-600 bg-primary-50 text-primary-900'
                            : 'border-secondary-200 bg-secondary-50 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportType"
                          value={option.value}
                          checked={formData.type === option.value}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex items-start gap-3 w-full">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-secondary-900">{option.label}</div>
                            <div className="text-sm text-secondary-600 mt-1">{option.desc}</div>
                          </div>
                          {formData.type === option.value && (
                            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.type === 'profile-report' && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">User Pseudoname</label>
                    <input
                      type="text"
                      value={formData.profileId}
                      onChange={(e) => setFormData({ ...formData, profileId: e.target.value })}
                      placeholder="Enter the username or pseudoname"
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                )}

                {formData.type === 'chat-report' && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">Chat ID or Reference</label>
                    <input
                      type="text"
                      value={formData.chatId}
                      onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                      placeholder="Enter chat ID or reference"
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    {formData.type === 'review' ? 'Your Feedback' : 'Report Details'}
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={4}
                    placeholder={
                      formData.type === 'review' 
                        ? 'Share your thoughts and suggestions...'
                        : 'Please provide specific details about the issue...'
                    }
                    className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-vertical"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;