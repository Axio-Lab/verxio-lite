import React, { useState } from 'react';
import { Maximize } from 'lucide-react';

const DecompressTokenAction = ({ onSave }) => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    onSave({ tokenMint, amount });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Maximize className="mr-2 text-pink-500" />
        Decompress Token Details
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
        placeholder="Minimum amount to decompress"
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

export default DecompressTokenAction;
