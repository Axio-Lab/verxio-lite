import React, { useState } from 'react';
import CampaignCard from './campaignProps/CampaignCard';
import Link from 'next/link';
import CampaignPage from './CampaignPage';

const MyCampaigns = () => {
  const [campaigns] = useState([
    {
      id: 1,
      title: "Summer Token Swap",
      status: "Active",
      participants: 1234,
      winners: 50,
      daysLeft: 7,
      action: "Swap tokens",
      reward: "NFT drop"
    },
    {
      id: 2,
      title: "Bonk Token Burn Giveaway 🎉🎊 ",
      status: "Upcoming",
      participants: 3000,
      winners: 100,
      daysLeft: 47,
      action: "Burn tokens",
      reward: "Token"
    },
    {
      id: 3,
      title: "Verxio x Breakpoint Extravaganza 🎊",
      status: "Active",
      participants: 700,
      winners: 20,
      daysLeft: 50,
      action: "Share on Twitter",
      reward: "Merch drop"
    },
    // Add more campaign objects here
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  if (selectedCampaign) {
    return <CampaignPage campaign={selectedCampaign} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-900">My Campaigns</h1>
            <Link href="/campaigns/create">
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300">
                Create Campaign
              </button>
            </Link>
          </div>
          <div className="space-y-6">
            {campaigns.map(campaign => (
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCampaigns;