"use client";
import React, { useState } from "react";
import { TabButton } from "@/components/TabButton";
import { useSearchParams } from "next/navigation";
import CampaignDetails from "@/components/campaignProps/CampaignDetails";
import CampaignPreview from "@/components/campaignProps/CampaignPreview";
import RewardsAndWinners from "@/components/campaignProps/RewardsAndWinners";
import CampaignTypeAndActions from "@/components/campaignProps/CampaignTypeAndActions";
import { useSelector } from "react-redux";

const Page = () => {
  const searchParams = useSearchParams();
  const route = searchParams.get("route") || "detail";

  const [campaignData, setCampaignData] = useState({
    type: "Onchain",
    selectedActions: [],
    actionData: {},
  });

  const updateCampaignData = (field, value) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAction = (action) => {
    setCampaignData((prev) => ({
      ...prev,
      selectedActions: prev.selectedActions.includes(action)
        ? prev.selectedActions.filter((a) => a !== action)
        : [...prev.selectedActions, action],
    }));
  };

  const updateActionData = (actionName, data) => {
    setCampaignData((prev) => ({
      ...prev,
      actionData: {
        ...prev.actionData,
        [actionName]: data,
      },
    }));
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8 px-4 sm:px-6 lg:px-8">
    <div className="min-h-screen bg-[#FBFBFE] rounded-2xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-6 text-center">
          Create Your Campaign
        </h1>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="flex flex-wrap justify-center gap-2 p-4 bg-indigo-50">
            <TabButton
              name="1. Detail"
              href="/dashboard/create-campaign?route=detail"
              isActive={route === "detail"}
            />
            <TabButton
              name="2. Action"
              href="/dashboard/create-campaign?route=action"
              isActive={route === "action"}
            />
            <TabButton
              name="3. Reward"
              href="/dashboard/create-campaign?route=reward"
              isActive={route === "reward"}
            />
            <TabButton
              name="4. Preview"
              href="/dashboard/create-campaign?route=preview"
              isActive={route === "preview"}
            />
          </div>

          <div className="p-6">
            {route === "detail" && <CampaignDetails />}
            {route === "action" && (
              <CampaignTypeAndActions
                campaignType={campaignData.type}
                setCampaignType={(type) => updateCampaignData("type", type)}
                selectedActions={campaignData.selectedActions}
                toggleAction={toggleAction}
                updateActionData={updateActionData}
                actionData={campaignData.actionData}
              />
            )}
            {route === "reward" && <RewardsAndWinners />}
            {route === "preview" && (
              <CampaignPreview campaignData={campaignData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
