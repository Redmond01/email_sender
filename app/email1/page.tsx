"use client"
//claude
import React, { useState, useRef } from 'react';
import { 
  Users, 
  Mail, 
  Database, 
  Trash2, 
  Send, 
  BarChart3, 
  Settings, 
  FileText, 
  Server,
  Filter,
  SortAsc,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const EmailCampaignDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalUsers, setTotalUsers] = useState(null);
  const [usersWithoutEmails, setUsersWithoutEmails] = useState(null);
  const [loading, setLoading] = useState({});
  const [emailForm, setEmailForm] = useState({
    subject: '',
    body: '',
    attachments: []
  });
  const [filters, setFilters] = useState({
    industry: '',
    emailsSent: '',
    userStatus: ''
  });
  const [logs, setLogs] = useState([
    { id: 1, type: 'success', message: '150 emails sent successfully', time: '10:30 AM' },
    { id: 2, type: 'error', message: '5 emails failed to send', time: '10:25 AM' },
    { id: 3, type: 'info', message: 'Campaign "Spring Sale" started', time: '10:20 AM' }
  ]);
  const fileInputRef = useRef(null);

  const handleFetchUsers = async (type) => {
    setLoading({ ...loading, [type]: true });
    // Simulate API call
    setTimeout(() => {
      if (type === 'total') {
        setTotalUsers(Math.floor(Math.random() * 1000) + 500);
      } else {
        setUsersWithoutEmails(Math.floor(Math.random() * 200) + 50);
      }
      setLoading({ ...loading, [type]: false });
    }, 1000);
  };

  const handleDeleteCredentials = (type, id = null) => {
    const messages = {
      single: `Credential ${id} deleted successfully`,
      multiple: '5 credentials deleted successfully', 
      all: 'All credentials deleted successfully'
    };
    setLogs(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: messages[type],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSendEmails = () => {
    if (!emailForm.subject || !emailForm.body) return;
    
    setLogs(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: 'Email campaign started...',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: `${Math.floor(Math.random() * 100) + 50} emails sent successfully`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setEmailForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'credentials', label: 'SMTP Credentials', icon: Server },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Email Campaign</h1>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Manage your email campaigns and monitor performance</p>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                  <Users className="text-blue-500" size={24} />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleFetchUsers('total')}
                    disabled={loading.total}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading.total ? <Loader className="animate-spin" size={16} /> : <Database size={16} />}
                    <span>Fetch Users</span>
                  </button>
                  {totalUsers && (
                    <div className="text-2xl font-bold text-blue-600">{totalUsers.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Users Without Emails</h3>
                  <Mail className="text-orange-500" size={24} />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleFetchUsers('without')}
                    disabled={loading.without}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading.without ? <Loader className="animate-spin" size={16} /> : <Mail size={16} />}
                    <span>Check Users</span>
                  </button>
                  {usersWithoutEmails && (
                    <div className="text-2xl font-bold text-orange-600">{usersWithoutEmails.toLocaleString()}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Filtering Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter size={20} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Filter & Sort Users</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters({...filters, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Industries</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emails Sent</label>
                  <select
                    value={filters.emailsSent}
                    onChange={(e) => setFilters({...filters, emailsSent: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any Amount</option>
                    <option value="0">0 emails</option>
                    <option value="1-5">1-5 emails</option>
                    <option value="6-10">6-10 emails</option>
                    <option value="10+">10+ emails</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Status</label>
                  <select
                    value={filters.userStatus}
                    onChange={(e) => setFilters({...filters, userStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Credential Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Server size={20} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Credential Management</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDeleteCredentials('single', '12345')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete Single</span>
                </button>
                <button
                  onClick={() => handleDeleteCredentials('multiple')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete Multiple</span>
                </button>
                <button
                  onClick={() => handleDeleteCredentials('all')}
                  className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete All</span>
                </button>
              </div>
            </div>

            {/* Send Emails Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <Send size={20} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Send Email Campaign</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    placeholder="Enter email subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
                  <textarea
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                    placeholder="Enter email body content..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                    >
                      <Upload size={16} />
                      <span>Add Files</span>
                    </button>
                    {emailForm.attachments.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {emailForm.attachments.length} file(s) selected
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSendEmails}
                  disabled={!emailForm.subject || !emailForm.body}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                >
                  <Send size={18} />
                  <span>Send Email Campaign</span>
                </button>
              </div>
            </div>

            {/* Status/Log Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText size={20} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    {log.type === 'success' && <CheckCircle className="text-green-500 mt-0.5" size={16} />}
                    {log.type === 'error' && <AlertCircle className="text-red-500 mt-0.5" size={16} />}
                    {log.type === 'info' && <AlertCircle className="text-blue-500 mt-0.5" size={16} />}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              {activeTab === 'users' && <Users size={48} className="mx-auto mb-4" />}
              {activeTab === 'credentials' && <Server size={48} className="mx-auto mb-4" />}
              {activeTab === 'logs' && <FileText size={48} className="mx-auto mb-4" />}
              {activeTab === 'settings' && <Settings size={48} className="mx-auto mb-4" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaignDashboard;