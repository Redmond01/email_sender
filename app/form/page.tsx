"use client"
import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';


interface BusinessFormData {
  firstname: string;
  lastname: string;
  email: string;
  companyName: string;
  noOfEmailSent: string;
  industry: string;
}

interface CSVData {
  [key: string]: any;
}

type ViewMode = 'selection' | 'single' | 'multiple';

const BusinessForm: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [formData, setFormData] = useState<BusinessFormData>({
    firstname: '',
    lastname: '',
    email: '',
    companyName: '',
    noOfEmailSent: '',
    industry: ''
  });

  // CSV related state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [securityChecked, setSecurityChecked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSingleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Single form submitted:', formData);
    alert('Single credentials submitted successfully!');
  };

  // CSV File Security Check
  const performSecurityCheck = (file: File): boolean => {
    // Basic security checks
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      alert('Invalid file type. Please upload a CSV file.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return false;
    }

    // Check for suspicious file names
    const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.pif'];
    if (suspiciousPatterns.some(pattern => file.name.toLowerCase().includes(pattern))) {
      alert('Suspicious file detected. Security check failed.');
      return false;
    }

    return true;
  };

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (performSecurityCheck(file)) {
        setCsvFile(file);
        setSecurityChecked(true);
        setUploadStatus('idle');
      } else {
        setCsvFile(null);
        setSecurityChecked(false);
        e.target.value = '';
      }
    }
  };

  const handleCSVSubmit = async () => {
    if (!csvFile || !securityChecked) {
      alert('Please select a valid CSV file first.');
      return;
    }

    setIsProcessing(true);

    try {
      // Parse CSV using Papa Parse
      Papa.parse(csvFile, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        dynamicTyping: true,

        complete: async (results): Promise<{ [key: string]: string } | undefined> => {
          if (results.errors.length > 0) {
            console.error('CSV parsing errors:', results.errors);
            alert('Error parsing CSV file. Please check the file format.');
            setIsProcessing(false);
            return;
          }

          const jsonData = results.data as CSVData[];

          setCsvData(jsonData);

          // console.log('Converted CSV to JSON:', jsonData);

          // Send to API endpoint
          try {
            const response = await axios('http://localhost:5000/api/createuser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              data: JSON.stringify({
                data: jsonData,
                filename: csvFile.name,
                timestamp: new Date().toISOString()
              })
            });

            if (response.statusText === 'OK') {
              setUploadStatus('success');
              alert('CSV data successfully sent to API!');
            } else {
              throw new Error('API request failed');
            }
          } catch (apiError) {
            console.error('API Error:', apiError);
            setUploadStatus('error');
            alert('Failed to send data to API. Please try again.');
          }

          setIsProcessing(false);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          alert('Error parsing CSV file.');
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('File processing error:', error);
      alert('Error processing file.');
      setIsProcessing(false);
    }
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Marketing',
    'Other'
  ];

  // Selection View
  if (viewMode === 'selection') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200 ">
        <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">Choose Input Method</h2>
        <div className="space-y-4">
          <button
            onClick={() => setViewMode('single')}
            className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <span className="font-medium text-gray-700">Single Credentials</span>
          </button>
          <button
            onClick={() => setViewMode('multiple')}
            className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <span className="font-medium text-gray-700">Multiple CSV</span>
          </button>
        </div>
      </div>
    );
  }

  // Single Credentials View
  if (viewMode === 'single') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-900">Single Credentials</h2>
          <button
            onClick={() => setViewMode('selection')}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back to Selection
          </button>
        </div>

        <div className="space-y-8">
          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Number of Emails Sent
                </label>
                <input
                  type="number"
                  name="noOfEmailSent"
                  value={formData.noOfEmailSent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  min="0"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end ">
            <button
              onClick={handleSingleSubmit}
              className="cursor-pointer px-6 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multiple CSV View
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-900">Multiple CSV Upload</h2>
        <button
          onClick={() => setViewMode('selection')}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
        >
          Back to Selection
        </button>
      </div>

      <div className="space-y-6">
        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Upload CSV File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".csv,text/csv,application/vnd.ms-excel"
              onChange={handleCSVFileChange}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          {csvFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {/* Security Check Section */}
        {csvFile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-700">🛡️ Security Check</span>
              {securityChecked && <span className="text-green-500">✅</span>}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>File Type:</span>
                <span className="text-green-600">✓ Valid CSV</span>
              </div>
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-green-600">✓ Within limits</span>
              </div>
              <div className="flex justify-between">
                <span>File Name:</span>
                <span className="text-green-600">✓ Safe</span>
              </div>
            </div>
          </div>
        )}

        {/* Data Preview */}
        {csvData.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Data Preview</h4>
            <div className="text-sm text-gray-600">
              <p>Records found: {csvData.length}</p>
              <p>Columns: {Object.keys(csvData[0] || {}).join(', ')}</p>
            </div>
            <div className="mt-3 max-h-32 overflow-y-auto">
              <pre className="text-xs text-gray-500 bg-white p-2 rounded border">
                {JSON.stringify(csvData.slice(0, 2), null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-700 font-medium">✅ Successfully uploaded and processed!</span>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-700 font-medium">❌ Upload failed. Please try again.</span>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCSVSubmit}
            disabled={!csvFile || !securityChecked || isProcessing}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${!csvFile || !securityChecked || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-400 text-white hover:bg-green-500 focus:ring-green-400'
              }`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Save'
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h4 className="font-medium text-blue-800 mb-2">CSV Format Requirements:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• File must be in CSV format (.csv)</li>
            <li>• Maximum file size: 5MB</li>
            <li>• First row should contain column headers</li>
            <li>• Ensure proper encoding (UTF-8 recommended)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;