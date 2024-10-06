"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
// import { Toaster } from "react-hot-toast";
import React, { useState, useMemo, useContext } from "react";
import ExploreCampaignCard from "@/components/campaignProps/ExploreCampaignCard";
import VerxioLogo from "../../../components/assets/images/VerxioLogo.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/componentLoader";
import { CampaignContext } from "@/context/campaignContext";

const Explore = () => {
  const router = useRouter();
  const { state } = useContext(CampaignContext);
  const campaigns = state.allCampaigns || []; 
  const campaignsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ reward: "", action: "", status: "" });
  console.log(campaigns, "Campaigns!!")

  const filteredCampaigns = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return []; 

    return campaigns
      .filter((campaign) => {
        return (
          (filter.reward === "" || campaign.reward === filter.reward) &&
          (filter.action === "" || campaign.action === filter.action) &&
          (filter.status === "" || campaign.status === filter.status)
        );
      })
      .reverse();
  }, [campaigns, filter]);

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const currentCampaigns = useMemo(() => {
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    return filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  }, [filteredCampaigns, currentPage]);

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
        We couldn't find any campaigns matching your current filters. Try
        adjusting your search criteria.
      </p>
    </div>
  );

  return (
    <>
      {/* <Toaster position="top-right" /> */}
      {state?.loading && <LoadingSpinner />}
      <div className="min-h-screen px-4 py-8 bg-[#FBFBFE] rounded-2xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-row items-center justify-between mb-6">
            <Link href="/" passHref>
              <Image
                src={VerxioLogo}
                alt="Verxio Logo"
                className="h-8 cursor-pointer sm:h-14"
              />
            </Link>

            <Button
              name="Create Campaign"
              className="px-2 py-1 text-sm sm:text-base sm:px-4 sm:py-2"
              onClick={() =>
                router.push("/dashboard/create-campaign?route=detail")
              }
            />
          </div>
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-bold">Filter Campaigns</h2>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <select
                value={filter.reward}
                onChange={(e) => {
                  setFilter({ ...filter, reward: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full p-2 border rounded sm:w-auto"
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
                className="w-full p-2 border rounded sm:w-auto"
              >
                <option value="">Actions</option>
                <option value="Swap Token">Swap Token</option>
                <option value="Burn Token">Burn Token</option>
                <option value="Sell Digital Product">
                  Sell Digital Product
                </option>
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
                className="w-full p-2 border rounded sm:w-auto"
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
                <div key={campaign._id} className="cursor-pointer">
                  <ExploreCampaignCard campaign={campaign} />
                </div>
              ))
            ) : (
              <NoRecordsFound />
            )}
          </div>
          {filteredCampaigns.length > campaignsPerPage && (
            <div className="flex items-center justify-center mt-8 space-x-4">
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
    </>
  );
};

export default Explore;
