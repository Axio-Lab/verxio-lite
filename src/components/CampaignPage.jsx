
import CampaignInfo from '../components/CampaignInfo';

export default function CampaignPage() {

  // You would typically fetch the campaign data here based on the id
  // For now, we'll use dummy data
  const campaign = {
    id: 1,
    title: "Campaign " ,
    description: "This is a description of the campaign",
    status: "Active",
    participants: 1234,
    actionData: {
        action: "Swap tokens",
        platform: "Jupiter",
    },
    winners: 50,
    daysLeft: 7,
    action: "Swap tokens",
    reward: "NFT drops"
  };

  return <CampaignInfo campaign={campaign} />;
}
