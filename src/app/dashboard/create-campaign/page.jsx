"use client";
import TabButton from "@/components/TabButton";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import CampaignDetails from "@/components/campaignProps/CampaignDetails";
import CampaignPreview from "@/components/campaignProps/CampaignPreview";
import RewardsAndWinners from "@/components/campaignProps/RewardsAndWinners";
import CampaignTypeAndActions from "@/components/campaignProps/CampaignTypeAndActions";

const CreateCampaign = () => {
  const searchParams = useSearchParams();
  const route = searchParams.get("route") || "details";

  const [campaignData, setCampaignData] = useState({
    type: "Onchain",
    selectedActions: [],
    selectedRewards: [],
    numWinners: 1,
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

  const toggleReward = (reward) => {
    setCampaignData((prev) => ({
      ...prev,
      selectedRewards: prev.selectedRewards.includes(reward)
        ? prev.selectedRewards.filter((r) => r !== reward)
        : [...prev.selectedRewards, reward],
    }));
  };

  const setNumWinners = (value) => {
    setCampaignData((prev) => ({ ...prev, numWinners: value }));
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
    <>
      <div className="flex gap-10 items-center shadow-sm mb-3 overflow-y-auto max-w-full w-full">
        <TabButton
          name="1. Details"
          href="/dashboard/create-campaign?route=details"
          isActive={route === "details"}
        />
        <TabButton
          name="2. Action"
          href="/dashboard/create-campaign?route=action"
          isActive={route === "action"}
        />
        <TabButton
          name="3. Rewards"
          href="/dashboard/create-campaign?route=rewards"
          isActive={route === "rewards"}
        />
        <TabButton
          name="4. Preview"
          href="/dashboard/create-campaign?route=preview"
          isActive={route === "preview"}
        />
      </div>

      {route === "details" && <CampaignDetails />}
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
      {route === "rewards" && (
        <RewardsAndWinners
          selectedRewards={campaignData.selectedRewards}
          toggleReward={toggleReward}
          numWinners={campaignData.numWinners}
          setNumWinners={setNumWinners}
        />
      )}
      {route === "preview" && (
        <CampaignPreview
          campaignData={campaignData}
        />
      )}
    </>
  );
};

export default CreateCampaign;