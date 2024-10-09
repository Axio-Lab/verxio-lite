"use client"
import "@dialectlabs/blinks/index.css";
import { useState, useEffect } from 'react';
import { Blink, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const NEXT_PUBLIC_SOLANA_RPC_URL = `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`;

const RenderBlink = ({ campaign }) => {
	const [action, setAction] = useState(null);
	const actionApiUrl = campaign?.blink;
	const { adapter } = useActionSolanaWalletAdapter(NEXT_PUBLIC_SOLANA_RPC_URL);
	const { action: fetchedAction } = useAction({ url: actionApiUrl, adapter });
	const isVerified = useSelector((state) => state.generalStates.userProfile.isVerified);

	useEffect(() => {
		if (fetchedAction) {
			setAction(fetchedAction);
		}
	}, [fetchedAction]);

	useEffect(() => {
		if (!isVerified) {
			toast.error("Please verify your account to participate in this campaign");
		} else if (campaign.status === "Ended") {
			toast.error("Oops!! This campaign has ended");
		} else if (campaign.status === "Upcoming") {
			toast.error("Oops!! This campaign has not started");
		} else if (!action) {
			toast.error("Unable to fetch the action for this campaign. Please try again later.");
		}
	}, [isVerified, campaign.status, action]);

	if (!isVerified || campaign.status === "Ended" || campaign.status === "Upcoming" || !action) {
		return null;
	}

	return action ? (
		<Blink 
			action={action} 
			websiteText={new URL(actionApiUrl).hostname}
			securityLevel="all"
			stylePreset="default"
		/>
	) : null;
};

export default RenderBlink;
