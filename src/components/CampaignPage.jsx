import CampaignInfo from "./ExploreCampaignInfo";

export default function CampaignPage() {
  // You would typically fetch the campaign data here based on the id
  // For now, we'll use dummy data
  const campaign = {
    id: 1,
    title: "Bonk Token Burn Giveaway 🎉🎊",
    description:
      "This is a description of the Bonk Token Burn Giveaway campaign",
    status: "Active",
    participants: 1234,
    actionData: {
      action: "Burn Token",
      platform: "Jupiter",
    },
    winners: 50,
    daysLeft: 7,
    action: "Swap Token",
    reward: "NFT Drop",
  };

  return <CampaignInfo campaign={campaign} />;
}
