"use client";
import { useParams } from "next/navigation";
import CampaignInfo from "@/components/CampaignInfo";
import { useEffect, useState } from "react";

const campaignData = [
  {
    id: 1,
    title: "Summer Token Swap",
    description: "This is a description of the Summer Token Swap campaign.",
    status: "Active",
    participants: 1234,
    actionData: {
      action: "Swap tokens",
      platform: "Jupiter",
    },
    winners: 50,
    daysLeft: 7,
    reward: "NFT Drop",
  },
  {
    id: 2,
    title: "Franklyn Test Run",
    description: "This is a description of the Franklyn Test Run campaign.",
    status: "Ended",
    participants: 34,
    actionData: {
      action: "Sell Digital Product",
      platform: "Solana",
    },
    winners: 50,
    daysLeft: 2,
    reward: "Merch Drop",
  },
  {
    id: 3,
    title: "Bonk Token Burn Giveaway 🎉🎊 ",
    status: "Upcoming",
    participants: 3000,
    winners: 100,
    daysLeft: 47,
    action: "Burn Token",
    reward: "Token",
  },
];

const Page = () => {
  const { id } = useParams(); // Get campaign ID from the URL
  const [campaign, setCampaign] = useState(null);

  const NoRecordsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
      <p className="text-gray-600 text-center">We couldn't find any campaign record!</p>
    </div>
  );


  useEffect(() => {
    if (id) {
      // Fetch the campaign based on the ID from the dummy data
      const foundCampaign = campaignData.find((c) => c.id === parseInt(id));
      if (foundCampaign) {
        setCampaign(foundCampaign);
      }
    }
  }, [id]);

  if (!campaign) {
    return <NoRecordsFound />;
  }

  return <CampaignInfo campaign={campaign} />;
};

export default Page;
