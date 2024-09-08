import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa'; // For Jupiter
import { SiExpertsexchange } from 'react-icons/si'; // For Raydium
import { GiWaveCrest } from 'react-icons/gi'; // For Kamino (using a wave icon as a placeholder)

const platforms = [
  { name: 'Jupiter', icon: <FaExchangeAlt className="text-blue-500" /> },
  { name: 'Raydium', icon: <SiExpertsexchange className="text-purple-500" /> },
  { name: 'Kamino', icon: <GiWaveCrest className="text-green-500" /> },
];

const PlatformSelector = ({ selectedPlatform, onSelectPlatform }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Platform</label>
      <div className="flex space-x-2">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => onSelectPlatform(platform.name)}
            className={`flex items-center p-2 rounded ${
              selectedPlatform === platform.name
                ? 'bg-blue-100 border-blue-500 border-2'
                : 'bg-gray-100 border-gray-300 border'
            }`}
          >
            {platform.icon}
            <span className="ml-2">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
