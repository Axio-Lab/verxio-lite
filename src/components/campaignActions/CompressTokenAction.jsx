import React, { useState } from 'react';
import { Minimize } from 'lucide-react';

const CompressTokenAction = ({ onSave }) => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    onSave({ tokenMint, amount });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Minimize className="mr-2 text-indigo-500" />
        Compress Token Details
      </h3>
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Token mint address"
        value={tokenMint}
        onChange={(e) => setTokenMint(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="number"
        placeholder="Minimum amount to compress"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
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

export default CompressTokenAction;
