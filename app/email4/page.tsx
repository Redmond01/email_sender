"use client"
//qwen coder
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  industry: string;
  noOfEmailSent: number;
  userStatus: 'active' | 'inactive' | 'pending';
}

interface Credential {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

const Dashboard: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([
    { id: '1', name: 'Primary SMTP', type: 'SMTP', lastUsed: '2023-10-15T10:30:00Z' },
    { id: '2', name: 'Backup SMTP', type: 'SMTP', lastUsed: '2023-10-14T16:20:00Z' },
    { id: '3', name: 'Analytics API', type: 'API', lastUsed: '2023-10-15T09:15:00Z' },
  ]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '2023-10-15T10:30:00Z', level: 'success', message: 'Email sent successfully to 120 users' },
    { id: '2', timestamp: '2023-10-15T10:28:00Z', level: 'info', message: 'Campaign started: Weekly Newsletter' },
    { id: '3', timestamp: '2023-10-15T10:27:00Z', level: 'error', message: 'Failed to send email to user@example.com', details: 'Invalid recipient address' },
  ]);
  
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [uncontactedUsers, setUncontactedUsers] = useState<number>(0);
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Simulate fetching data
  useEffect(() => {
    // Mock data
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', industry: 'Technology', noOfEmailSent: 3, userStatus: 'active' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', industry: 'Finance', noOfEmailSent: 0, userStatus: 'active' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', industry: 'Healthcare', noOfEmailSent: 5, userStatus: 'inactive' },
      { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', industry: 'Education', noOfEmailSent: 1, userStatus: 'pending' },
      { id: '5', name: 'Robert Brown', email: 'robert@example.com', industry: 'Retail', noOfEmailSent: 2, userStatus: 'active' },
      { id: '6', name: 'Lisa Davis', email: 'lisa@example.com', industry: 'Technology', noOfEmailSent: 0, userStatus: 'active' },
    ];
    
    setUsers(mockUsers);
    setTotalUsers(mockUsers.length);
    setUncontactedUsers(mockUsers.filter(user => user.noOfEmailSent === 0).length);
  }, []);

  // Handle filtering and sorting
  const filteredAndSortedUsers = users
    .filter(user => selectedIndustry === 'all' || user.industry === selectedIndustry)
    .sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'emails') return a.noOfEmailSent - b.noOfEmailSent;
      if (sortOption === 'status') return a.userStatus.localeCompare(b.userStatus);
      return 0;
    });

  // Handle credential deletion
  const handleDeleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
  };

  const handleDeleteMultipleCredentials = () => {
    if (credentials.length > 0) {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${credentials.length} credentials?`);
      if (confirmDelete) {
        setCredentials([]);
      }
    }
  };

  const handleDeleteAllCredentials = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete ALL credentials? This cannot be undone.');
    if (confirmDelete) {
      setCredentials([]);
    }
  };

  // Handle email sending
  const handleSendEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate sending emails
    setTimeout(() => {
      const successCount = Math.floor(Math.random() * 100) + 50; // Random success count
      const failedCount = Math.floor(Math.random() * 20) + 5; // Random failure count
      
      // Add log entries
      setLogs(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          timestamp: new Date().toISOString(), 
          level: 'success', 
          message: `Successfully sent emails to ${successCount} users` 
        },
        { 
          id: (Date.now() + 1).toString(), 
          timestamp: new Date().toISOString(), 
          level: 'error', 
          message: `Failed to send emails to ${failedCount} users`, 
          details: 'Some recipients had invalid addresses'
        }
      ]);
      
      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      
      setIsSending(false);
    }, 2000);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#" className="active">Dashboard</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">SMTP Credentials</a></li>
            <li><a href="#">Logs</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Email Campaign Management</h1>
          <div className="user-actions">
            <button className="btn btn-secondary">Logout</button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="card stat-card">
            <h3>Total Users</h3>
            <div className="stat-value">{totalUsers}</div>
            <button 
              className="btn btn-primary" 
              onClick={() => console.log('Fetching total users...')}
            >
              Refresh
            </button>
          </div>
          
          <div className="card stat-card">
            <h3>Uncontacted Users</h3>
            <div className="stat-value">{uncontactedUsers}</div>
            <button 
              className="btn btn-primary" 
              onClick={() => console.log('Fetching uncontacted users...')}
            >
              Refresh
            </button>
          </div>
          
          <div className="card stat-card">
            <h3>Emails Sent Today</h3>
            <div className="stat-value">128</div>
            <button 
              className="btn btn-primary" 
              onClick={() => console.log('Fetching today\'s emails...')}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Users Section */}
        <div className="card">
          <h2>Users</h2>
          <div className="user-controls">
            <div className="filter-controls">
              <select 
                value={selectedIndustry} 
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="form-control"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
              </select>
              
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="form-control"
              >
                <option value="name">Sort by Name</option>
                <option value="emails">Sort by Emails Sent</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Industry</th>
                  <th>Emails Sent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.industry}</td>
                    <td>{user.noOfEmailSent}</td>
                    <td>
                      <span className={`status-badge status-${user.userStatus}`}>
                        {user.userStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credential Management */}
        <div className="card">
          <h2>SMTP Credentials</h2>
          <div className="credential-controls">
            <div className="credential-list">
              {credentials.map(credential => (
                <div key={credential.id} className="credential-item">
                  <div className="credential-info">
                    <strong>{credential.name}</strong>
                    <span className="credential-type">{credential.type}</span>
                    <span className="credential-last-used">Last used: {formatDate(credential.lastUsed)}</span>
                  </div>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCredential(credential.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            
            <div className="credential-actions">
              <button 
                className="btn btn-warning"
                onClick={handleDeleteMultipleCredentials}
                disabled={credentials.length === 0}
              >
                Delete Selected
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAllCredentials}
                disabled={credentials.length === 0}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>

        {/* Send Emails Form */}
        <div className="card">
          <h2>Send Email Campaign</h2>
          <form onSubmit={handleSendEmails} className="email-form">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="body">Email Body</label>
              <textarea
                id="body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Enter email content..."
                rows={6}
                className="form-control"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="attachments">Attachments</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  Click to add files or drag and drop here
                </div>
                
                {attachments.length > 0 && (
                  <div className="uploaded-files">
                    {attachments.map((file, index) => (
                      <div key={index} className="uploaded-file">
                        <span>{file.name}</span>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger"
                          onClick={() => removeAttachment(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Emails'}
            </button>
          </form>
        </div>

        {/* Status/Log Panel */}
        <div className="card">
          <h2>Status & Logs</h2>
          <div className="log-panel">
            <div className="log-summary">
              <div className="summary-item">
                <span className="summary-label">Successful:</span>
                <span className="summary-value">128</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Failed:</span>
                <span className="summary-value">5</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Pending:</span>
                <span className="summary-value">0</span>
              </div>
            </div>
            
            <div className="logs-container">
              <div className="logs-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="logs-list">
                {logs.map(log => (
                  <div key={log.id} className={`log-entry log-entry-${log.level}`}>
                    <div className="log-time">{formatDate(log.timestamp)}</div>
                    <div className="log-message">
                      <span className={`log-level log-level-${log.level}`}>{log.level.toUpperCase()}</span>
                      {log.message}
                    </div>
                    {log.details && (
                      <div className="log-details">{log.details}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="toast toast-success">
          <div className="toast-content">
            <span className="toast-icon">✓</span>
            <span>Email campaign sent successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;