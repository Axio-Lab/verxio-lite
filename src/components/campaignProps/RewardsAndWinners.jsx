import React, { useState, useEffect } from 'react';
import { Users, Gift, Trophy, PlusCircle, CheckCircle, MinusCircle } from 'lucide-react';

const availableRewards = [
  { name: 'Whitelist spots', icon: <Users className="text-blue-500" /> },
  { name: 'NFT drops', icon: <Gift className="text-purple-500" /> },
  { name: 'Tokens', icon: <Trophy className="text-yellow-500" /> },
  { name: 'Airdrops', icon: <PlusCircle className="text-green-500" /> },
  { name: 'Merch drop', icon: <Gift className="text-red-500" /> },
  { name: 'Verxio credit', icon: <CheckCircle className="text-indigo-500" /> }
];

const RewardsAndWinners = ({ selectedRewards, toggleReward, numWinners, setNumWinners }) => {
  const [localNumWinners, setLocalNumWinners] = useState(numWinners);

  useEffect(() => {
    setLocalNumWinners(numWinners);
  }, [numWinners]);

  const incrementWinners = () => {
    const newValue = localNumWinners + 1;
    setLocalNumWinners(newValue);
    setNumWinners(newValue);
  };

  const decrementWinners = () => {
    const newValue = Math.max(1, localNumWinners - 1);
    setLocalNumWinners(newValue);
    setNumWinners(newValue);
  };

  const handleWinnersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const newValue = isNaN(value) ? 1 : Math.max(1, value);
    setLocalNumWinners(newValue);
    setNumWinners(newValue);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Available Rewards</h3>
        <div className="grid grid-cols-3 gap-4">
          {availableRewards.map((reward) => (
            <div 
              key={reward.name} 
              onClick={() => toggleReward(reward.name)}
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                selectedRewards.includes(reward.name) ? 'bg-blue-200' : 'bg-gray-200'
              }`}
            >
              {reward.icon}
              <span className="ml-2">{reward.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Number of Winners</h3>
        <div className="flex items-center">
          <button 
            type="button" 
            onClick={decrementWinners}
            className="bg-gray-200 p-2 rounded-l"
          >
            <MinusCircle />
          </button>
          <input 
            type="number" 
            value={localNumWinners} 
            onChange={handleWinnersChange}
            className="w-20 text-center p-2 border-t border-b border-gray-300"
            min="1"
          />
          <button 
            type="button" 
            onClick={incrementWinners}
            className="bg-gray-200 p-2 rounded-r"
          >
            <PlusCircle />
          </button>
        </div>
      </div>
    </>
  );
};

export default RewardsAndWinners;
