import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

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
      const response = await axios.get("http://localhost:5000/profile", {
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
      const response = await axios.get("http://localhost:5000/reports", {
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
      await axios.post("http://localhost:5000/reports", {
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
    <div className="max-w-7xl mx-auto mt-10 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-slate-700">Reports</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-all duration-300"
        >
          <Plus size={20} />
          New Report
        </button>
      </div>

      <div className="overflow-x-auto bg-white/90 rounded-xl shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Details</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600">{formatDate(report.timestamp)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{report.type}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{report.details}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-700">Create New Report</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400"
                >
                  <option value="review">Review</option>
                  <option value="profile-report">Profile Report</option>
                  <option value="chat-report">Chat Report</option>
                </select>
              </div>

              {formData.type === 'profile-report' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pseudoname of the user</label>
                  <input
                    type="text"
                    value={formData.profileId}
                    onChange={(e) => setFormData({ ...formData, profileId: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400"
                    required
                  />
                </div>
              )}

              {formData.type === 'chat-report' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chat ID</label>
                  <input
                    type="text"
                    value={formData.chatId}
                    onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Details</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sage-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-all duration-300"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
