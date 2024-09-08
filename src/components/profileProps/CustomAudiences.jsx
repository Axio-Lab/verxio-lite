import React, { useState, useRef } from 'react';
import { Users, Download, Upload } from 'lucide-react';

const CustomAudiences = () => {
  const [customAudiences, setCustomAudiences] = useState([
    { id: 1, name: "Summer Swap Participants", count: 1234 },
    { id: 2, name: "NFT Collectors", count: 567 },
    // Add more custom audiences as needed
  ]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const exportAudienceAsCSV = (audienceId) => {
    // Implement CSV export logic here
    console.log(`Exporting audience ${audienceId} as CSV`);
  };

  const handleImportClick = () => {
    setIsImporting(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implement CSV import logic here
      console.log(`Importing file: ${file.name}`);
      // After import logic, update the customAudiences state
      // setCustomAudiences([...customAudiences, newImportedAudience]);
    }
    setIsImporting(false);
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-800">Custom Audiences</h2>
        <button
          onClick={handleImportClick}
          className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          <Upload size={18} className="mr-2" />
          Import Audience
        </button>
      </div>
      {isImporting && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="mb-2">Select a CSV file to import:</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={handleUpload}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Upload CSV
          </button>
        </div>
      )}
      <div className="space-y-4">
        {customAudiences.map(audience => (
          <div key={audience.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="text-indigo-500 mr-3" size={24} />
              <div>
                <h3 className="font-semibold text-lg">{audience.name}</h3>
                <p className="text-gray-600">{audience.count} participants</p>
              </div>
            </div>
            <button
              onClick={() => exportAudienceAsCSV(audience.id)}
              className="flex items-center px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomAudiences;
