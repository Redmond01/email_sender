"use client"
//grok
import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { myNewApoloClient } from '../../client/lib/graphqlclient';

const EmailCampaignDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [pendingUsers, setPendingUsers] = useState<number | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [sortByEmails, setSortByEmails] = useState<string>('asc');
  const [userStatus, setUserStatus] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [emailsSent, setEmailsSent] = useState<number>(0);
  const [failedEmails, setFailedEmails] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchTotalUsers = async () => {
    const {data} = await myNewApoloClient.query({
      fetchPolicy: 'network-only',
      query: gql`
        query {
           getRecipientLength {
            AllRecipientLength
          }
        }
        `
    })
    console.log(data)
    // Simulate fetch
    setTotalUsers(1500);
  };

  const fetchPendingUsers = () => {
    // Simulate fetch
    setPendingUsers(250);
  };

  const handleSendEmails = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setEmailsSent(120);
    setFailedEmails(5);
    setProgress(100);
    setLogs(prev => [...prev, 'Email campaign sent successfully at ' + new Date().toLocaleTimeString()]);
  };

  const mockUsers = [
    { id: 1, industry: 'Tech', emailsSent: 5, status: 'Active' },
    { id: 2, industry: 'Finance', emailsSent: 2, status: 'Inactive' },
    // Add more mock data as needed
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Sidebar */}
      <nav style={{
        width: '250px',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ padding: '0 20px 20px', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['Dashboard (overview)', 'Users', 'SMTP Credentials', 'Logs', 'Settings'].map((link) => (
            <li key={link}>
              <a href="#" style={{
                display: 'block',
                padding: '12px 20px',
                textDecoration: 'none',
                color: '#666',
                fontSize: '0.95rem',
                borderLeft: '3px solid transparent',
                '&:hover': { backgroundColor: '#f0f0f0', borderLeftColor: '#007bff' },
              }}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Email Campaign Management</h1>
          <p style={{ color: '#666', fontSize: '1rem', margin: '5px 0 0' }}>Overview and controls for your campaigns.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {/* Stats Cards */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#333', margin: '0 0 10px' }}>Total Users</h3>
            <button
              onClick={fetchTotalUsers}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Fetch Total
            </button>
            {totalUsers !== null && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff', margin: '10px 0 0' }}>{totalUsers}</p>}
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#333', margin: '0 0 10px' }}>Pending Users</h3>
            <button
              onClick={fetchPendingUsers}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Fetch Pending
            </button>
            {pendingUsers !== null && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff', margin: '10px 0 0' }}>{pendingUsers}</p>}
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '30px',
        }}>
          <h2 style={{ fontSize: '1.25rem', color: '#333', margin: '0 0 15px' }}>User Filters & Sorting</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="">All Industries</option>
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Sort by Emails Sent</label>
              <select
                value={sortByEmails}
                onChange={(e) => setSortByEmails(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>User Status</label>
              <select
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          {/* Mock Users Table */}
          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Industry</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Emails Sent</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{user.id}</td>
                    <td style={{ padding: '10px' }}>{user.industry}</td>
                    <td style={{ padding: '10px' }}>{user.emailsSent}</td>
                    <td style={{ padding: '10px' }}>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* Credential Management */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#333', margin: '0 0 15px' }}>SMTP Credentials</h2>
            <p style={{ color: '#666', marginBottom: '15px' }}>Manage your credentials securely.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
                Delete Single by ID
              </button>
              <button style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
                Delete Multiple
              </button>
              <button style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
                Delete All
              </button>
            </div>
          </div>

          {/* Send Emails */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#333', margin: '0 0 15px' }}>Send Emails</h2>
            <form onSubmit={handleSendEmails}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Body</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }}
                  placeholder="Rich text editor placeholder..."
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachments(e.target.files)}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                }}
              >
                Send Emails
              </button>
            </form>
          </div>
        </div>

        {/* Status/Log Panel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '1.25rem', color: '#333', margin: '0 0 15px' }}>Campaign Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Sent Successfully</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>{emailsSent}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Failed</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>{failedEmails}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Progress</p>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#28a745', transition: 'width 0.3s' }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0 0' }}>{progress}%</p>
            </div>
          </div>
          <h3 style={{ fontSize: '1rem', color: '#333', margin: '0 0 10px' }}>Logs</h3>
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
            {logs.map((log, index) => (
              <li key={index} style={{ padding: '5px 0', fontSize: '0.85rem', color: '#666', borderBottom: '1px solid #f0f0f0' }}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EmailCampaignDashboard;