"use client";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import CampaignCard from "@/components/campaignProps/CampaignCard";

const MyCampaigns = () => {
  const [campaigns] = useState([
    {
      id: 1,
      title: "Summer Token Swap",
      status: "Active",
      participants: 1234,
      winners: 50,
      daysLeft: 7,
      action: "Sell Digital Product",
      reward: "NFT Drop",
    },
    {
      id: 2,
      title: "Franklyn Test Run",
      status: "Ended",
      participants: 34,
      winners: 50,
      daysLeft: 2,
      action: "Create Poll",
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
  ]);

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FBFBFE] rounded-2xl sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="p-8 mb-8 bg-white shadow-sm bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl">
          <div className="flex items-center justify-between mb-6 ">
            <h1 className="mb-6 text-3xl font-bold text-center text-[#0D0E32] sm:text-base">
              My Campaigns
            </h1>
            <Button
              href={"/dashboard/create-campaign"}
              name="Create Campaign"
            />
          </div>
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div className="cursor-pointer">
                <CampaignCard key={campaign.id} campaign={campaign} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCampaigns;
