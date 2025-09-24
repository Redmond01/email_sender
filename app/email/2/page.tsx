"use client"
//google gemini
import React, { useState } from 'react';

// Define a reusable card component for a clean layout.
const Card = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

// A simple button with icon support for cleaner code.
const IconButton = ({ children, onClick, className = '' }) => (
  <button onClick={onClick} className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${className}`}>
    {children}
  </button>
);

// A standardized input field component.
const InputField = ({ label, type = 'text', value, onChange, placeholder = '' }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    />
  </div>
);

// A standardized select field component.
const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

// A card to display a single statistic.
const StatCard = ({ title, value, isLoading }) => (
  <div className="bg-white rounded-xl shadow-md p-5 flex-1 min-w-[200px]">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className="text-3xl font-bold text-gray-800">
      {isLoading ? (
        <svg className="animate-spin h-7 w-7 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.002 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        value
      )}
    </p>
  </div>
);

// A panel to display logs and status updates.
const LogsPanel = ({ logs }) => (
  <Card title="Activity Log" className="col-span-1 md:col-span-2 lg:col-span-3">
    <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
      {logs.length > 0 ? (
        logs.map((log, index) => (
          <div key={index} className={`flex items-start space-x-2 ${log.type === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
            <span className="font-mono text-xs text-gray-400">{log.timestamp.toLocaleTimeString()}</span>
            <span className="flex-1">{log.message}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 italic">No activity yet.</div>
      )}
    </div>
  </Card>
);

// A mock rich text editor using a simple textarea.
const RichTextEditor = ({ value, onChange }) => (
  <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-colors">
    <textarea
      value={value}
      onChange={onChange}
      className="w-full h-48 p-3 text-gray-700 focus:outline-none"
      placeholder="Start typing your email body here..."
    />
  </div>
);

// The navigation sidebar component.
const Sidebar = ({ activeLink, onNavigate }) => (
  <nav className="p-4 space-y-2 bg-gray-100 rounded-lg shadow-inner">
    {['Dashboard', 'Users', 'SMTP Credentials', 'Logs', 'Settings'].map(link => (
      <button
        key={link}
        onClick={() => onNavigate(link.toLowerCase().replace(' ', '-'))}
        className={`w-full text-left p-3 rounded-lg font-medium transition-colors duration-200 ${
          activeLink === link.toLowerCase().replace(' ', '-') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        {link}
      </button>
    ))}
  </nav>
);

// The main content area component.
const Content = ({ activePage, children }) => (
  <main className="flex-1 p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">{activePage.replace('-', ' ')}</h1>
    {children}
  </main>
);

export default function App() {
  const [totalUsers, setTotalUsers] = useState(null);
  const [unsentUsers, setUnsentUsers] = useState(null);
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterEmailsSent, setFilterEmailsSent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  // Simple log state for a real-time feel.
  const [logs, setLogs] = useState([]);
  const log = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { message, type, timestamp: new Date() }]);
  };

  // Mock API calls with a delay to simulate a real-world application.
  const fetchTotalUsers = () => {
    log('Fetching total number of users...');
    setTotalUsers(null);
    setTimeout(() => {
      const count = Math.floor(Math.random() * 1000) + 500;
      setTotalUsers(count);
      log(`Found a total of ${count} users.`);
    }, 1500);
  };

  const fetchUnsentUsers = () => {
    log('Fetching users who have not received emails...');
    setUnsentUsers(null);
    setTimeout(() => {
      const count = Math.floor(Math.random() * 200) + 50;
      setUnsentUsers(count);
      log(`Found ${count} users who have not yet received emails.`);
    }, 1500);
  };

  const handleSendEmails = (e) => {
    e.preventDefault();
    log('Sending emails...');

    setTimeout(() => {
      const successCount = Math.floor(Math.random() * 10) + 1;
      const failCount = Math.floor(Math.random() * 3);

      log(`Attempting to send ${successCount + failCount} emails...`);
      setTimeout(() => {
        log(`Successfully sent ${successCount} emails.`);
        if (failCount > 0) {
          log(`Failed to send ${failCount} emails.`, 'error');
        }
        log('Email campaign details saved to database (mock).');

        setEmailSubject('');
        setEmailBody('');
        setAttachment(null);
      }, 1500);
    }, 500);
  };

  const handleDeleteCredential = (type) => {
    log(`Attempting to delete credentials (${type})...`);
    setTimeout(() => {
      if (type === 'single' && credentialId) {
        log(`Credential ${credentialId} deleted successfully (mock).`);
        setCredentialId('');
      } else if (type === 'multiple') {
        log('Deleted multiple credentials (mock).');
      } else if (type === 'all') {
        log('Deleted all credentials (mock).');
      } else {
        log('Please provide a credential ID to delete a single credential.', 'error');
      }
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      log(`Attachment selected: ${file.name}`);
      setAttachment(file);
    }
  };
  
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Users" value={totalUsers !== null ? totalUsers : 'N/A'} isLoading={totalUsers === null} />
              <StatCard title="Unsent Emails" value={unsentUsers !== null ? unsentUsers : 'N/A'} isLoading={unsentUsers === null} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="User Data" className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <button onClick={fetchTotalUsers} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                    Fetch Total Users
                  </button>
                  <button onClick={fetchUnsentUsers} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                    Fetch Unsent Users
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">User Filters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField
                    label="Industry"
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    options={[
                      { value: '', label: 'All Industries' },
                      { value: 'tech', label: 'Technology' },
                      { value: 'finance', label: 'Finance' },
                      { value: 'healthcare', label: 'Healthcare' },
                    ]}
                  />
                  <SelectField
                    label="Emails Sent"
                    value={filterEmailsSent}
                    onChange={(e) => setFilterEmailsSent(e.target.value)}
                    options={[
                      { value: '', label: 'Any' },
                      { value: '0', label: '0' },
                      { value: '1-10', label: '1-10' },
                      { value: '10+', label: '10+' },
                    ]}
                  />
                  <SelectField
                    label="User Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: '', label: 'Any Status' },
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>
              </Card>
              <Card title="Send Emails" className="lg:col-span-1">
                <form onSubmit={handleSendEmails}>
                  <InputField
                    label="Email Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g., Your Weekly Newsletter"
                  />
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email Body</label>
                    <RichTextEditor
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1">Attachments</label>
                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    {attachment && <p className="mt-2 text-xs text-gray-500">Selected: {attachment.name}</p>}
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                    Send Emails
                  </button>
                </form>
              </Card>
            </div>
            <div className="mt-8">
              <LogsPanel logs={logs} />
            </div>
          </>
        );
      case 'users':
        return <p className="text-gray-500">Users content will go here.</p>;
      case 'smtp-credentials':
        return (
          <>
            <Card title="Credential Management">
              <InputField
                label="Credential ID"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Enter credential ID to delete"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => handleDeleteCredential('single')} className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                  Delete Single
                </button>
                <button onClick={() => handleDeleteCredential('multiple')} className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                  Delete Multiple
                </button>
                <button onClick={() => handleDeleteCredential('all')} className="bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                  Delete All
                </button>
              </div>
            </Card>
            <div className="mt-8">
              <LogsPanel logs={logs} />
            </div>
          </>
        );
      case 'logs':
        return <LogsPanel logs={logs} />;
      case 'settings':
        return <p className="text-gray-500">Settings content will go here.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased text-gray-900">
      <div className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <Sidebar activeLink={activePage} onNavigate={setActivePage} />
        </div>
        <div className="lg:w-3/4">
          <Content activePage={activePage}>
            {renderPage()}
          </Content>
        </div>
      </div>
    </div>
  );
}
