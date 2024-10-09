"use client"
import "@dialectlabs/blinks/index.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
// import { Action, ActionsRegistry } from "@dialectlabs/blinks";
import { Blink, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter  } from "@dialectlabs/blinks/hooks/solana";
import { ExternalLink } from "lucide-react";

const NEXT_PUBLIC_SOLANA_RPC_URL = `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`;

const ParticipateNow = ({ campaign }) => {
    const actionApiUrl = campaign?.blink;
    const { adapter } = useActionSolanaWalletAdapter(`${NEXT_PUBLIC_SOLANA_RPC_URL}`);
    const { action: fetchedAction } = useAction({ url: actionApiUrl, adapter });
    const isVerified = useSelector((state) => state.generalStates.userProfile.isVerified);

  const handleParticipate = () => {
    if (!isVerified) {
      toast.error(
        "Please verify your account to enable you participate in this campaign"
      );
      return;
    }
    if (campaign.status === "Ended") {
      toast.error("Oops!! This campaign has ended");
      return;
    }
    if (campaign.status === "Upcoming") {
      toast.error("Oops!! This campaign has not started");
      return;
    }

    if (fetchedAction) {
      console.log("required action:", fetchedAction);
      return (
        <Blink
          securityLevel="all"
          action={fetchedAction}
          websiteText={new URL(actionApiUrl).hostname}
          stylePreset="default"
        />
      );
    } else {
      toast.error(
        "Unable to fetch the action for this campaign. Please try again later."
      );
      return null;
    }
  };

  return (
    <ActionButton
      onClick={handleParticipate}
      icon={ExternalLink}
      text={`Participate Now`}
      color="bg-indigo-600 hover:bg-indigo-700"
    />
  );
};

const ActionButton = ({ onClick, icon: Icon, text, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center ${color} text-white px-6 py-3 rounded-lg transition duration-300`}
  >
    <Icon size={20} className="mr-2" />
    {text}
  </button>
);

export default ParticipateNow;
