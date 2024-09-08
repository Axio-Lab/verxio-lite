import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const CampaignDetails = ({ 
  campaignName, 
  setCampaignName, 
  description, 
  setDescription, 
  showDescriptionPreview, 
  setShowDescriptionPreview, 
  renderedDescription,
  mdParser,
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate 
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');

  useEffect(() => {
    setLocalStartDate(startDate || '');
    setLocalEndDate(endDate || '');
  }, [startDate, endDate]);

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleDateChange = (setter, parentSetter) => (e) => {
    const date = e.target.value;
    setter(date);
    if (date && !isNaN(new Date(date).getTime()) && typeof parentSetter === 'function') {
      parentSetter(date);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-4">Campaign Title</h3>
        <input 
          type="text" 
          id="name" 
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter campaign name"
        />
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold mb-4">Campaign Description</h3>
        </div>
        {showDescriptionPreview ? (
          <div className="prose max-w-none border border-gray-300 rounded-md p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: renderedDescription }} />
          </div>
        ) : (
          <MdEditor
            style={{ height: '250px' }}
            renderHTML={(text) => mdParser.render(text)}  
            onChange={handleEditorChange}
            value={description}
            config={{
              view: { menu: true, md: true, html: false },
              canView: { menu: true, md: true, html: false, fullScreen: false, hideMenu: true },
            }}
          />
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-4">Campaign Dates</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={localStartDate}
              onChange={handleDateChange(setLocalStartDate, setStartDate)}
              min={today}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              value={localEndDate}
              onChange={handleDateChange(setLocalEndDate, setEndDate)}
              min={localStartDate || today}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetails;


