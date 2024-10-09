// "use client"
// import "@dialectlabs/blinks/index.css";
// import { useState, useEffect } from 'react';
// import { Blink, useAction } from "@dialectlabs/blinks";
// import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
// import { useSelector } from "react-redux";
// import { toast } from "react-hot-toast";

// const NEXT_PUBLIC_SOLANA_RPC_URL = `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`;

// const RenderBlink = ({ campaign }) => {
// 	const [action, setAction] = useState(null);
// 	const actionApiUrl = campaign?.blink;
// 	const { adapter } = useActionSolanaWalletAdapter(NEXT_PUBLIC_SOLANA_RPC_URL);
// 	const { action: fetchedAction } = useAction({ url: actionApiUrl, adapter });
// 	const isVerified = useSelector((state) => state.generalStates.userProfile.isVerified);

// 	useEffect(() => {
// 		if (fetchedAction) {
// 			setAction(fetchedAction);
// 		}
// 	}, [fetchedAction]);

// 	useEffect(() => {
// 		if (!isVerified) {
// 			toast.error("Please verify your account to participate in this campaign");
// 		} else if (campaign.status === "Ended") {
// 			toast.error("Oops!! This campaign has ended");
// 		} else if (campaign.status === "Upcoming") {
// 			toast.error("Oops!! This campaign has not started");
// 		} else if (!action) {
// 			toast.error("Unable to fetch the action for this campaign. Please try again later.");
// 		}
// 	}, [isVerified, campaign.status, action]);

// 	if (!isVerified || campaign.status === "Ended" || campaign.status === "Upcoming" || !action) {
// 		return null;
// 	}

// 	return action ? (
// 		<Blink
// 			action={action}
// 			websiteText={new URL(actionApiUrl).hostname}
// 			securityLevel="all"
// 			stylePreset="default"
// 		/>
// 	) : null;
// };

// export default RenderBlink;

"use client";
import "@dialectlabs/blinks/index.css";
import { useState, useEffect } from "react";
import { Blink, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ExternalLink } from "lucide-react";

const NEXT_PUBLIC_SOLANA_RPC_URL = `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`;

const RenderBlink = ({ campaign }) => {
  const [action, setAction] = useState(null);
  const [showBlink, setShowBlink] = useState(false);
  const actionApiUrl = campaign?.blink;
  const { adapter } = useActionSolanaWalletAdapter(NEXT_PUBLIC_SOLANA_RPC_URL);
  const { action: fetchedAction } = useAction({ url: actionApiUrl, adapter });
  const isVerified = useSelector(
    (state) => state.generalStates.userProfile.isVerified
  );

  useEffect(() => {
    if (fetchedAction) {
      setAction(fetchedAction);
    }
  }, [fetchedAction]);

  const handleButtonClick = () => {
    if (!isVerified) {
      toast.error("Please verify your account to participate in this campaign");
    } else if (campaign.status === "Ended") {
      toast.error("Oops!! This campaign has ended");
    } else if (campaign.status === "Upcoming") {
      toast.error("Oops!! This campaign has not started");
    } else if (!action) {
      toast.error(
        "Unable to fetch the action for this campaign. Please try again later."
      );
    } else {
      setShowBlink(true);
    }
  };

  return (
    <div className="outline-none shadow-sm my-4">
      {!showBlink && (
        <ActionButton
          onClick={handleButtonClick}
          icon={ExternalLink}
          text={`Participate Now`}
          color="bg-indigo-600 hover:bg-indigo-700"
        />
      )}

      {showBlink && action && (
        <Blink
          action={action}
          websiteText={new URL(actionApiUrl).hostname}
          securityLevel="all"
          stylePreset="default"
        />
      )}
    </div>
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

export default RenderBlink;
