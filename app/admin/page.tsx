"use client"

import React, { useState } from 'react';
import { validateObject } from '../helper/checkValue'
import axios from 'axios'
import { autoRefreshRequest } from '../utils/axios';

// Main App component
const App: React.FC = () => {

    type Credentials = {
        username: string,
        password: string,
        uniqueCode: string
    }


    // State for UI feedback
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<Credentials>({ password: "", uniqueCode: "", username: "" })


    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setMessageType('');
        const newData = validateObject(data)

        try {

            if (!newData.validation) {
                setMessage('An unexpected error occurred. Please try again.');
                setMessageType('error');
                return
            }

            const response = await axios(`${process.env.NEXT_PUBLIC_LOGINROUTE}/api/signup`, {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(newData.message),
            });

            console.log(response)
            if (response.status === 200) {
                setMessage('Sign up successful!');
                setMessageType('success');
            } else if (response.status === 400) {
                const errorData = await response.data;
                setMessage(`Error: ${errorData.message || 'Invalid input.'}`);
                setMessageType('error');
            } else {
                setMessage('An unexpected error occurred. Please try again.');
                setMessageType('error');
            }


        } catch (error) {
            console.error('API call failed:', error);
            setMessage('Network error. Please check your connection and try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>

                {message && (
                    <div className={`p-3 mb-4 text-center rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                <div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={data?.username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setData((old) => ({ ...old, username: e.target.value }))
                            }}
                            required
                            className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={data?.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setData((old) => ({ ...old, password: e.target.value }))
                            }}
                            required
                            className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="uniquecode" className="block text-sm font-medium text-gray-700 mb-1">
                            Unique Code
                        </label>
                        <input
                            type="text"
                            id="uniquecode"
                            name="uniquecode"
                            placeholder="Enter your unique code"
                            value={data?.uniqueCode}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setData((old) => ({ ...old, uniqueCode: e.target.value }))
                            }}
                            required
                            className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full px-4 py-2 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
