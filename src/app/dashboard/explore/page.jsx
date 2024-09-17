"use client"
import Image from 'next/image';
import React, { useState, useMemo } from "react";
import CampaignPage from "@/components/CampaignPage";
import CampaignCard from "@/components/campaignProps/CampaignCard";
import Button from "@/components/Button";
import VerxioLogo from "../../../components/assets/images/VerxioLogo.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Explore = () => {
  const [campaigns] = useState([
    {
      id: 1,
      title: "Summer Token Swap",
      status: "Active",
      participants: 1234,
      winners: 50,
      daysLeft: 7,
      action: "Compress Token",
      reward: "NFT Drop",
    },
    {
      id: 2,
      title: "Franklyn Test Run",
      status: "Ended",
      participants: 34,
      winners: 50,
      daysLeft: 2,
      action: "Sell Digital Product",
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
    {
      id: 4,
      title: "Verxio x Breakpoint Extravaganza 🎊",
      status: "Active",
      participants: 700,
      winners: 20,
      action: "Share URL",
      reward: "Merch Drop",
    },
    // Add more campaign objects here
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filter, setFilter] = useState({ reward: "", action: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 10;

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      return (
        (filter.reward === "" || campaign.reward === filter.reward) &&
        (filter.action === "" || campaign.action === filter.action) &&
        (filter.status === "" || campaign.status === filter.status)
      );
    });
  }, [campaigns, filter]);

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const currentCampaigns = useMemo(() => {
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    return filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  }, [filteredCampaigns, currentPage]);

  const NoRecordsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
      <p className="text-gray-600 text-center">We couldn't find any campaigns matching your current filters. Try adjusting your search criteria.</p>
    </div>
  );

  if (selectedCampaign) {
    return <CampaignPage campaign={selectedCampaign} />;
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FBFBFE] rounded-2xl sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
        <Image src={VerxioLogo} alt="Verxio Logo" className="h-13"  />

          <Button href={"/dashboard/create-campaign"} name="Create Campaign" />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Filter Campaigns</h2>
          <div className="flex space-x-4">
            <select
              value={filter.reward}
              onChange={(e) => {
                setFilter({ ...filter, reward: e.target.value });
                setCurrentPage(1);
              }}
              className="border rounded p-2"
            >
              <option value="">Rewards</option>
              <option value="NFT Drop">NFT Drop</option>
              <option value="Merch Drop">Merch Drop</option>
              <option value="Token">Token</option>
              <option value="Whitelist Spot">Whitelist Spot</option>
              <option value="Airdrop">Airdrop</option>
            </select>
            <select
              value={filter.action}
              onChange={(e) => {
                setFilter({ ...filter, action: e.target.value });
                setCurrentPage(1);
              }}
              className="border rounded p-2"
            >
              <option value="">Actions</option>
              <option value="Swap Token">Swap Token</option>
              <option value="Burn Token">Burn Token</option>
              <option value="Sell Digital Product">Sell Digital Product</option>
              <option value="Compress Token">Compress Token</option>
              <option value="Create Poll">Create Poll</option>
              <option value="Decompress Token">Decompress Token</option>
              <option value="Share URL">Share URL</option>
            </select>
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter({ ...filter, status: e.target.value });
                setCurrentPage(1);
              }}
              className="border rounded p-2"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Ended">Ended</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>
        <div className="space-y-6">
          {currentCampaigns.length > 0 ? (
            currentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))
          ) : (
            <NoRecordsFound />
          )}
        </div>
        {filteredCampaigns.length > campaignsPerPage && (
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
  );
};

export default Explore;