"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LoginFormData {
  username: string;
  password: string;
}

interface DomainName{
  host:string
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [domainHostName, setDomainHostName] = useState<DomainName>({host:''})

  useEffect(()=>{
    console.log(window.location)
    setDomainHostName((old):DomainName => {
      return {...old, host:window.location.host}
    })
    console.log(domainHostName)
  },[])

  const [showForm, setShowForm] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    await axios({
      url: "http://localhost:5000",
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData)
    })
    // console.log('Login submitted:', formData);
    // console.log(e)
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600 text-center">Form closed</p>
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Open Login Form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 ">
      {/* Header - Following template2 pattern */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">User Login</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
          >
            ✕ Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 text-sm text-black bg-green-500 cursor-pointer hover:bg-green-600 border border-gray-300 rounded"
          >
            Login
          </button>
        </div>
      </div>

      {/* Form Content - Following template2 section structure */}
      <div className="p-6">
        {/* Authentication Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Authentication Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Options - Following template2 sidebar pattern */}

      </div>
    </div>
  );
};

export default LoginForm;