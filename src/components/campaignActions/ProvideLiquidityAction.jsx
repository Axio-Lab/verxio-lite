import React, { useState } from 'react';
import PlatformSelector from './PlatformSelector';
import { Droplet } from 'lucide-react';

const ProvideLiquidityAction = ({ onSave }) => {
  const [platform, setPlatform] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [minAmount, setMinAmount] = useState('');

  const handleSave = () => {
    onSave({ platform, poolAddress, minAmount });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Droplet className="mr-2 text-green-500" />
        Provide Liquidity Details</h3>
      <PlatformSelector selectedPlatform={platform} onSelectPlatform={setPlatform} />
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Liquidity pool address"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
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

export default ProvideLiquidityAction;
