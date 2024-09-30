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
    return <div>no campaigns...</div>;
  }

  return <CampaignInfo campaign={campaign} />;
};

export default Page;
