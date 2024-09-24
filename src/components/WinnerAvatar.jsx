import React, { useState } from 'react';
import Image from 'next/image';

const WinnerAvatar = ({ address }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const avatarUrl = `https://api.dicebear.com/6.x/micah/svg?seed=${address || 'placeholder'}.svg`;

  return (
    <div className="relative group">
      <Image
        src={avatarUrl}
        alt={`Winner ${shortenedAddress}`}
        width={50}
        height={50}
        className="rounded-full cursor-pointer"
        onClick={() => setShowFullAddress(!showFullAddress)}
      />
      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {shortenedAddress}
      </span>
      {showFullAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="font-mono text-lg mb-4">{address}</p>
            <button
              onClick={() => setShowFullAddress(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerAvatar;
