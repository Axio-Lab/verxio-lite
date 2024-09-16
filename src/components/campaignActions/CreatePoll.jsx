import React, { useState, useEffect } from 'react';

const PollAction = ({ onSave, initialData }) => {
  const [options, setOptions] = useState(initialData?.options || ['', '']);
  const [question, setQuestion] = useState(initialData?.question || '');

  useEffect(() => {
    if (options.length < 2) {
      setOptions(prev => [...prev, '']);
    }
  }, [options]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSave = () => {
    const filteredOptions = options.filter(option => option.trim() !== '');
    if (filteredOptions.length < 2) {
      alert('Please provide at least two non-empty options.');
      return;
    }
    if (question.trim() === '') {
      alert('Please provide a question for the poll.');
      return;
    }
    onSave({ question, options: filteredOptions });
  };

  return (
    <div className="space-y-4">
      {/* <h3 className="text-xl font-semibold mb-4">Create Poll</h3>
      <div>
        <label htmlFor="question" className="block mb-2">Poll Question:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your poll question"
        />
      </div> */}
      <div>
        <label className="block mb-2">Poll Options:</label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-grow p-2 border rounded mr-2"
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {options.length < 5 && (
          <button
            onClick={addOption}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Option
          </button>
        )}
      </div>
      <button 
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Poll
      </button>
    </div>
  );
};

export default PollAction;
