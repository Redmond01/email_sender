"use client"

//deepseek thinking model

import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface User {
  id: number;
  name: string;
  email: string;
  industry: string;
  noOfEmailSent: number;
  userStatus: 'active' | 'inactive' | 'pending';
  receivedEmail: boolean;
}

interface Credential {
  id: number;
  name: string;
  email: string;
  provider: string;
}

interface EmailLog {
  id: number;
  timestamp: Date;
  status: 'success' | 'error';
  message: string;
}

const EmailCampaignDashboard: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersNotReceived, setUsersNotReceived] = useState<number>(0);
  const [selectedCredentials, setSelectedCredentials] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    industry: '',
    noOfEmailSent: '',
    userStatus: ''
  });
  
  // Email form state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Fetch mock data on component mount
  useEffect(() => {
    // Mock user data
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', industry: 'Technology', noOfEmailSent: 5, userStatus: 'active', receivedEmail: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', industry: 'Finance', noOfEmailSent: 2, userStatus: 'active', receivedEmail: false },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', industry: 'Healthcare', noOfEmailSent: 0, userStatus: 'pending', receivedEmail: false },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', industry: 'Education', noOfEmailSent: 3, userStatus: 'active', receivedEmail: true },
      { id: 5, name: 'Michael Wilson', email: 'michael@example.com', industry: 'Technology', noOfEmailSent: 1, userStatus: 'inactive', receivedEmail: false },
    ];
    
    // Mock credentials
    const mockCredentials: Credential[] = [
      { id: 1, name: 'Primary SMTP', email: 'noreply@company.com', provider: 'Amazon SES' },
      { id: 2, name: 'Backup SMTP', email: 'news@company.com', provider: 'SendGrid' },
    ];
    
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setCredentials(mockCredentials);
    setTotalUsers(mockUsers.length);
    setUsersNotReceived(mockUsers.filter(user => !user.receivedEmail).length);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Apply filters
    let filtered = users;
    if (filters.industry) {
      filtered = filtered.filter(user => user.industry === filters.industry);
    }
    if (filters.noOfEmailSent) {
      const count = parseInt(filters.noOfEmailSent);
      filtered = filtered.filter(user => user.noOfEmailSent === count);
    }
    if (filters.userStatus) {
      filtered = filtered.filter(user => user.userStatus === filters.userStatus);
    }
    
    setFilteredUsers(filtered);
  };

  // Credential management functions
  const deleteCredential = (id: number) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
  };

  const deleteMultipleCredentials = () => {
    setCredentials(prev => prev.filter(cred => !selectedCredentials.includes(cred.id)));
    setSelectedCredentials([]);
  };

  const deleteAllCredentials = () => {
    setCredentials([]);
    setSelectedCredentials([]);
  };

  // Handle credential selection
  const toggleCredentialSelection = (id: number) => {
    if (selectedCredentials.includes(id)) {
      setSelectedCredentials(prev => prev.filter(credId => credId !== id));
    } else {
      setSelectedCredentials(prev => [...prev, id]);
    }
  };

  // Handle email sending
  const handleSendEmails = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate email sending process
    const newLogs: EmailLog[] = [];
    let successCount = 0;
    let errorCount = 0;
    
    filteredUsers.forEach(user => {
      if (Math.random() > 0.2) { // 80% success rate for simulation
        successCount++;
        newLogs.push({
          id: Date.now() + Math.random(),
          timestamp: new Date(),
          status: 'success',
          message: `Email successfully sent to ${user.email}`
        });
      } else {
        errorCount++;
        newLogs.push({
          id: Date.now() + Math.random(),
          timestamp: new Date(),
          status: 'error',
          message: `Failed to send email to ${user.email}`
        });
      }
    });
    
    setEmailLogs(prev => [...newLogs, ...prev]);
    
    // Update user received status
    setUsers(prev => prev.map(user => ({
      ...user,
      receivedEmail: filteredUsers.some(fu => fu.id === user.id) ? true : user.receivedEmail,
      noOfEmailSent: filteredUsers.some(fu => fu.id === user.id) ? user.noOfEmailSent + 1 : user.noOfEmailSent
    })));
    
    // Reset form
    setEmailSubject('');
    setEmailBody('');
    setAttachments([]);
  };

  // Handle file attachment
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-5 text-xl font-semibold text-blue-600">Email Campaign Manager</div>
        <nav className="mt-5">
          <ul>
            {['Dashboard', 'Users', 'SMTP Credentials', 'Logs', 'Settings'].map((item) => (
              <li key={item} className="px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Campaign Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* User Count Cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">User Statistics</h2>
            <div className="flex space-x-4">
              <div className="flex-1 bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <div className="flex-1 bg-orange-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">Users Not Received</p>
                <p className="text-2xl font-bold text-orange-600">{usersNotReceived}</p>
              </div>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select 
                  name="industry"
                  value={filters.industry}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emails Sent</label>
                <select 
                  name="noOfEmailSent"
                  value={filters.noOfEmailSent}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Amount</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Status</label>
                <select 
                  name="userStatus"
                  value={filters.userStatus}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Credential Management */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">SMTP Credentials</h2>
            <div className="mb-4 space-y-2">
              {credentials.map(credential => (
                <div key={credential.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedCredentials.includes(credential.id)}
                      onChange={() => toggleCredentialSelection(credential.id)}
                      className="mr-3 h-4 w-4 text-blue-600 rounded"
                    />
                    <div>
                      <p className="font-medium">{credential.name}</p>
                      <p className="text-sm text-gray-600">{credential.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteCredential(credential.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={deleteMultipleCredentials}
                disabled={selectedCredentials.length === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedCredentials.length === 0 ? 'bg-gray-200 text-gray-500' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
              >
                Delete Selected
              </button>
              <button 
                onClick={deleteAllCredentials}
                disabled={credentials.length === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium ${credentials.length === 0 ? 'bg-gray-200 text-gray-500' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
              >
                Delete All
              </button>
            </div>
          </div>
          
          {/* Email Sending Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Send Emails</h2>
            <form onSubmit={handleSendEmails}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={5}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <input 
                  type="file" 
                  onChange={handleAttachmentChange}
                  className="w-full p-2 border rounded-md"
                  multiple
                />
                <div className="mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-md mb-1">
                      <span>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Emails to {filteredUsers.length} Users
              </button>
            </form>
          </div>
        </div>
        
        {/* Status/Log Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Email Sending Logs</h2>
          <div className="h-64 overflow-y-auto border rounded-md">
            {emailLogs.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No logs yet. Send emails to see logs here.</p>
            ) : (
              <ul className="divide-y">
                {emailLogs.map(log => (
                  <li key={log.id} className={`p-3 text-sm ${log.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    <span className="font-mono">{log.timestamp.toLocaleTimeString()}</span> - {log.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignDashboard;