"use client";
import { useParams } from "next/navigation";
import ManageCampaignInfo from "@/components/ManageCampaignInfo";
import { useEffect } from "react";
import { CampaignContext } from "@/context/campaignContext";
import React, { useState, useContext } from "react";

const Page = () => {
  const { state } = useContext(CampaignContext);
  const campaigns = state.allCampaigns;

  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  const NoRecordsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Campaigns Found
      </h3>
      <p className="text-gray-600 text-center">
        We couldn't find any campaign record!
      </p>
    </div>
  );

  useEffect(() => {
    if (id) {
      const selectedCampaign = campaigns.find(
        (singleCampaign) => singleCampaign._id === id
      );
      if (selectedCampaign) {
        setCampaign(selectedCampaign);
      }
    }
  }, [id, campaigns]);

  if (!campaign) {
    return <NoRecordsFound />;
  }

  return <ManageCampaignInfo campaign={campaign} />;
};

export default Page;
