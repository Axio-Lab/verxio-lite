"use client";
import { useParams } from "next/navigation";
import ExploreCampaignInfo from "@/components/ExploreCampaignInfo";
import { CampaignContext } from "@/context/campaignContext";
import React, { useState, useContext, useEffect } from "react";
import LoadingSpinner from "@/components/componentLoader"; 

const Page = () => {
  const { state } = useContext(CampaignContext);
  const campaigns = state.allCampaigns;
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && campaigns && Array.isArray(campaigns)) {
      const selectedCampaign = campaigns.find(
        (singleCampaign) => singleCampaign._id === id
      );
      if (selectedCampaign) {
        setCampaign(selectedCampaign);
      }
    }
    setLoading(false);
  }, [id, campaigns]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!campaign) {
    return <NoRecordsFound />;
  }

  return <ExploreCampaignInfo campaign={campaign} />;
};

const NoRecordsFound = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
    <svg
      className="w-16 h-16 mb-4 text-gray-400"
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
    <h3 className="mb-2 text-xl font-semibold text-gray-900">
      No Campaigns Found
    </h3>
    <p className="text-center text-gray-600">
      We couldn't find any campaign record!
    </p>
  </div>
);

export default Page;
