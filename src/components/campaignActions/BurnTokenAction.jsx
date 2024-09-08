import React, { useState } from 'react';

const BurnTokenAction = ({ onSave }) => {
  const [tokenMint, setTokenMint] = useState('');
  const [minBurnAmount, setMinBurnAmount] = useState('');

  const handleSave = () => {
    onSave({ tokenMint, minBurnAmount });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Burn Token Details</h3>
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Token mint address"
        value={tokenMint}
        onChange={(e) => setTokenMint(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="number"
        placeholder="Minimum burn amount"
        value={minBurnAmount}
        onChange={(e) => setMinBurnAmount(e.target.value)}
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

export default BurnTokenAction;
