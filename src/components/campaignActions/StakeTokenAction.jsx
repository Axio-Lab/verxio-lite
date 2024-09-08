import React, { useState } from 'react';
import PlatformSelector from './PlatformSelector';

const StakeTokenAction = ({ onSave }) => {
  const [platform, setPlatform] = useState('');
  const [tokenMint, setTokenMint] = useState('');
  const [minAmount, setMinAmount] = useState('');

  const handleSave = () => {
    onSave({ platform, tokenMint, minAmount });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Stake Token Details</h3>
      <PlatformSelector selectedPlatform={platform} onSelectPlatform={setPlatform} />
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Token mint address"
        value={tokenMint}
        onChange={(e) => setTokenMint(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="number"
        placeholder="Minimum amount in SOL"
        value={minAmount}
        onChange={(e) => setMinAmount(e.target.value)}
      />
      <button
        className="w-full p-2 bg-blue-500 text-white rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default StakeTokenAction;
