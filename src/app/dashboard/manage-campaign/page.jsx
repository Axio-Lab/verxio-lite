"use client";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/componentLoader";
import { CampaignContext } from "@/context/campaignContext";
import React, { useState, useMemo, useContext, useEffect } from "react";
import ManageCampaignCard from "@/components/campaignProps/ManageCampaignCard";

const MyCampaigns = () => {
  const { state, getMyCampaigns } = useContext(CampaignContext);

  const campaigns = state.myCampaigns;
  const campaignsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ reward: "", action: "", status: "" });

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      return (
        (filter.reward === "" || campaign.reward === filter.reward) &&
        (filter.action === "" || campaign.action === filter.action) &&
        (filter.status === "" || campaign.status === filter.status)
      );
    }).reverse();
  }, [campaigns, filter]);

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const currentCampaigns = useMemo(() => {
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    return filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  }, [filteredCampaigns, currentPage]);

  const NoRecordsFound = ({ description }) => (
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
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );

  const userApiKey = useSelector(
    (state) => state.generalStates?.userProfile?.key
  );

  if (!userApiKey) {
    return (
      <NoRecordsFound description="We couldn't find any campaigns. Please connect your wallet." />
    );
  }

  useEffect(() => {
    if (userApiKey) {
      getMyCampaigns();
    }
  }, [userApiKey]);

  return (
    <>
      {state?.loading && <LoadingSpinner />}
      <Toaster position="top-right" />
      <div className="min-h-screen px-4 py-8 bg-[#FBFBFE] rounded-2xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="p-4 sm:p-8 mb-8 bg-white shadow-sm bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl">
            <div className="flex flex-row items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0D0E32]">
                My Campaigns
              </h1>
              <Button
                href={"/dashboard/create-campaign?route=detail"}
                name="Create Campaign"
                className="text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
              />
            </div>
            <div className="space-y-6">
              {currentCampaigns.length > 0 ? (
                currentCampaigns.map((campaign) => (
                  <div key={campaign._id} className="cursor-pointer">
                    <ManageCampaignCard campaign={campaign} />
                  </div>
                ))
              ) : (
                <NoRecordsFound
                  description={`We couldn't find any campaigns matching your current filters. Try
                  adjusting your search criteria.`}
                />
              )}
            </div>
            {filteredCampaigns.length > campaignsPerPage && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-lg font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCampaigns;
