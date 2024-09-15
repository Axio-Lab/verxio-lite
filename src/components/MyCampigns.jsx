import React, { useState, useMemo } from "react";
import CampaignCard from "./campaignProps/CampaignCard";
import CampaignPage from "./CampaignPage";
import Button from "@/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MyCampaigns = () => {
  const [campaigns] = useState([
    {
      id: 1,
      title: "Summer Token Swap",
      status: "Active",
      participants: 1234,
      winners: 50,
      daysLeft: 7,
      action: "Swap Token",
      reward: "NFT Drop",
    },
    {
      id: 2,
      title: "Franklyn Test Run",
      status: "Ended",
      participants: 34,
      winners: 50,
      daysLeft: 2,
      action: "Swap Token",
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
      reward: "Token"
    },
    {
      id: 4,
      title: "Verxio x Breakpoint Extravaganza 🎊",
      status: "Active",
      participants: 700,
      winners: 20,
      daysLeft: 50,
      action: "Share on Twitter",
      reward: "Merch Drop"
    },
    // Add more campaign objects here to test pagination
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 10;

  const currentCampaigns = useMemo(() => {
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    return campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  }, [campaigns, currentPage]);

  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);

  if (selectedCampaign) {
    return <CampaignPage campaign={selectedCampaign} />;
  }

  const NoCampaignsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
      <p className="text-gray-600 text-center">You haven't created any campaigns yet. Click 'Create Campaign' to get started!</p>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FBFBFE] rounded-2xl sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="p-8 mb-8 bg-white shadow-sm bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl">
          <div className="flex items-center justify-between mb-6 ">
            <h1 className="mb-6 text-3xl font-bold text-center text-[#0D0E32] sm:text-base">
              My Campaigns
            </h1>
            <Button href={"/campaigns/create"} name=" Create Campaign" />
          </div>
          {currentCampaigns.length > 0 ? (
            <div className="space-y-6">
              {currentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          ) : (
            <NoCampaignsFound />
          )}
          {campaigns.length > campaignsPerPage && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
  );
};

export default MyCampaigns;