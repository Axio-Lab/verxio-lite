"use client";
import TabButton from "@/components/TabButton";
import { useSearchParams } from "next/navigation";
import CampaignDetails from '@/components/campaignProps/CampaignDetails';  
import CampaignTypeAndActions from '@/components/campaignProps/CampaignTypeAndActions';
import RewardsAndWinners from '@/components/campaignProps/RewardsAndWinners';
import CampaignPreview from '@/components/campaignProps/CampaignPreview';

const CreateCampaign = () => {
  const searchParams = useSearchParams();
  const route = searchParams.get("route") || "details";
  return (
    <>
      <div className="flex gap-10 items-center shadow-sm mb-3 overflow-y-auto max-w-full w-full">
        <TabButton
          name="1. Campaign Details"
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
      {route === "action" && <CampaignTypeAndActions />}
      {route === "rewards" && <RewardsAndWinners />}
      {route === "preview" && <CampaignPreview />}
    </>
  );
};

export default CreateCampaign;
