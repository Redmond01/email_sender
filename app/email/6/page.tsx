"use client"

import React, { useState } from 'react';
import { ApolloClient, gql } from '@apollo/client';
import { myNewApoloClient } from '../../client/lib/graphqlclient';
import Link from 'next/link';

const DashboardOverview: React.FC = () => {
    const [totalUsers, setTotalUsers] = useState<number | null>(null);

    const fetchTotalUsers = async () => {

        // const response = await myNewApoloClient.query({
        const response: ApolloClient.QueryResult<{ getRecipientLength: { AllRecipientLength: number } }> = await myNewApoloClient.query({
            // fetchPolicy: 'network-only',
            query: gql`
            query {
               getRecipientLength {
                AllRecipientLength
              }
            }
            `
        })
        // Simulate fetch
        const totalNumberOfRecepients = response.data?.getRecipientLength?.AllRecipientLength
        if (!totalNumberOfRecepients) {
            return { msg: 'data not found' }
        }
        setTotalUsers(totalNumberOfRecepients);
    };






    return (
        <div className="p-4 md:p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Email Campaign Management</h2>
            <p className="text-sm text-gray-500">Overview and controls for your campaigns.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                    <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer" onClick={fetchTotalUsers}>
                        Fetch Total
                    </button>
                    {totalUsers !== null && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff', margin: '10px 0 0' }}>{totalUsers}</p>}
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-700">Pending Users</h3>
                    <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        Fetch Pending
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Filters & Sorting</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Industry</label>
                        <select className="w-full border border-gray-300 rounded-md p-2 text-gray-700">
                            <option>All Industries</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Sort by Emails Sent</label>
                        <select className="w-full border border-gray-300 rounded-md p-2 text-gray-700">
                            <option>Ascending</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">User Status</label>
                        <select className="w-full border border-gray-300 rounded-md p-2 text-gray-700">
                            <option>All Statuses</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emails Sent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tech</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Active</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Finance</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Inactive</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Users: React.FC = () => {
    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Users Management</h2>
            <p className="text-sm text-gray-500 mb-6">Manage and view all users in the system.</p>
            {/* Placeholder for users list or form */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Sample rows */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">john@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Active</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Link href={'/form'} className='hover:cursor-pointer'>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ">
                        Add New User
                    </button>
                </Link>
            </div>
        </div>
    );
};

const SMTPCredentials: React.FC = () => {
    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">SMTP Credentials</h2>
            <p className="text-sm text-gray-500 mb-6">Configure your SMTP settings for email campaigns.</p>
            {/* Placeholder for SMTP form */}
            <form className="bg-white rounded-lg shadow p-4 space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">SMTP Host</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="smtp.example.com" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">SMTP Port</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2" placeholder="587" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Username</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="username" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Password</label>
                    <input type="password" className="w-full border border-gray-300 rounded-md p-2" placeholder="password" />
                </div>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Save Credentials
                </button>
            </form>
        </div>
    );
};

const Logs: React.FC = () => {
    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Logs</h2>
            <p className="text-sm text-gray-500 mb-6">View system and campaign logs.</p>
            {/* Placeholder for logs */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Logs</h3>
                <ul className="space-y-2">
                    <li className="text-sm text-gray-700">2025-09-23: Email sent to user 1 successfully.</li>
                    <li className="text-sm text-gray-700">2025-09-22: SMTP connection established.</li>
                </ul>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Clear Logs
                </button>
            </div>
        </div>
    );
};

const Settings: React.FC = () => {
    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-sm text-gray-500 mb-6">Configure application settings.</p>
            {/* Placeholder for settings */}
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Theme</label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                        <option>Light</option>
                        <option>Dark</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Notifications</label>
                    <input type="checkbox" className="mr-2" /> Enable email notifications
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Save Settings
                </button>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'users':
                return <Users />;
            case 'smtp':
                return <SMTPCredentials />;
            case 'logs':
                return <Logs />;
            case 'settings':
                return <Settings />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 md:p-6">
                <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>
                <nav className="space-y-2">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'dashboard' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        Dashboard (overview)
                    </button>
                    <button
                        onClick={() => setCurrentView('users')}
                        className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'users' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setCurrentView('smtp')}
                        className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'smtp' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        SMTP Credentials
                    </button>
                    <button
                        onClick={() => setCurrentView('logs')}
                        className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'logs' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        Logs
                    </button>
                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'settings' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        Settings
                    </button>
                </nav>
            </aside>
            <main className="flex-1">
                {renderView()}
            </main>
        </div>
    );
};

export default App;