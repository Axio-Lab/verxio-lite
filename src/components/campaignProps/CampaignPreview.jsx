import React, { useState, useMemo, useContext } from "react";
import axios from "axios";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

import { VersionedTransaction } from '@solana/web3.js';
import MarkdownIt from "markdown-it";
// import MdEditor from "react-markdown-editor-lite";
// import { PURGE } from "redux-persist";
import "react-markdown-editor-lite/lib/index.css";
// import { FaExchangeAlt } from "react-icons/fa";
// import { SiExpertsexchange } from "react-icons/si";
// import { GiWaveCrest } from "react-icons/gi";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/Button";
import {
  Repeat,
  Droplet,
  Coins,
  CheckCircle,
  ShoppingCart,
  Minimize,
  Maximize,
  Share,
  Flame,
  MessageCircle,
  UserPlus,
  ClipboardList,
  Users,
  Gift,
  Trophy,
  PlusCircle,
  Calendar,
  Activity,
  Award,
  Zap,
  Clock,
  ImagePlay,
  ShoppingBasket,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "@/components/componentLoader";
import { resetCreateCampaignFormData } from "@/store/slices/statesSlice";
import { CampaignContext } from "@/context/campaignContext";


// import { createCampaign } from "@/store/slices/campaignSlice";
// import { FiShield } from "react-icons/fi";
// import { setRewards } from "@/store/slices/statesSlice";

// const actionIcons = {
//   "Swap token": { icon: Repeat, color: "text-blue-500" },
//   "Sell digital product": { icon: ShoppingCart, color: "text-purple-500" },
//   "Provide liquidity": { icon: Droplet, color: "text-green-500" },
//   "Stake token": { icon: Coins, color: "text-yellow-500" },
//   "Compress token": { icon: Minimize, color: "text-indigo-500" },
//   "Decompress token": { icon: Maximize, color: "text-pink-500" },
//   "Burn token": { icon: Flame, color: "text-red-500" },
//   "Share on Twitter": { icon: Share, color: "text-blue-400" },
//   "Join Discord": { icon: MessageCircle, color: "text-indigo-500" },
//   "Refer a friend": { icon: UserPlus, color: "text-green-500" },
//   "Complete a survey": { icon: ClipboardList, color: "text-orange-500" },
// };

// const rewardIcons = {
//   "Whitelist spot": { icon: Users, color: "text-blue-500" },
//   "NFT drop": { icon: ImagePlay, color: "text-purple-500" },
//   Token: { icon: Trophy, color: "text-yellow-500" },
//   Airdrop: { icon: PlusCircle, color: "text-green-500" },
//   "Merch drop": { icon: ShoppingBasket, color: "text-red-500" },
//   "Verxio XP": { icon: Coins, color: "text-indigo-500" },
// };

// const platformIcons = {
//   Jupiter: { icon: FaExchangeAlt, color: "text-blue-500" },
//   Raydium: { icon: SiExpertsexchange, color: "text-purple-500" },
//   Kamino: { icon: GiWaveCrest, color: "text-green-500" },
// };

const CampaignPreview = ({ campaignData }) => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  if (!campaignData) {
    return <div>No campaign data available.</div>;
  }
  const { getAllCampaigns } = useContext(CampaignContext);
  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
  const NEXT_PUBLIC_TREASURY_WALLET_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_WALLET;
  const NEXT_PUBLIC_SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  const NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const mdParser = useMemo(() => new MarkdownIt({ html: true }), []);
  const userApiKey = useSelector(
    (state) => state.generalStates?.userProfile?.key
  );

  const selectedActionType = useSelector(
    (state) => state.generalStates?.actionType?.selectedActionType
  );
  const title = useSelector((state) => state.generalStates?.details?.title);
  const description = useSelector(
    (state) => state.generalStates?.details?.description
  );
  const bannerImg = useSelector(
    (state) => state.generalStates?.details?.bannerImg
  );
  const startDate = useSelector(
    (state) => state.generalStates?.details?.startDate
  );
  const endDate = useSelector((state) => state.generalStates?.details?.endDate);
  const selectedReward = useSelector(
    (state) => state.generalStates?.rewards?.selectedReward
  );
  const numberOfWinners = useSelector(
    (state) => state.generalStates?.rewards?.numberOfWinners
  );
  const solAmount = useSelector(
    (state) => state.generalStates?.rewards?.solAmount
  );
  const xpAmount = useSelector(
    (state) => state.generalStates?.rewards?.xpAmount
  );
  const tokenMintAmount = useSelector(
    (state) => state.generalStates?.tokenMint?.tokenMintAmount
  );
  const tokenMintAddress = useSelector(
    (state) => state.generalStates?.tokenMint?.tokenMintAddress
  );
  const tokenURL = useSelector(
    (state) => state.generalStates?.tokenMint?.tokenURL
  );
  const productAmount = useSelector(
    (state) => state.generalStates?.digitalProduct?.productAmount
  );
  const productQuantity = useSelector(
    (state) => state.generalStates?.digitalProduct?.productQuantity
  );
  const productFile = useSelector(
    (state) => state.generalStates?.digitalProduct?.productFile
  );
  const optionsArray = useSelector(
    (state) => state.generalStates?.pollsOption?.optionsArray
  );
  const pollTitle = useSelector(
    (state) => state.generalStates?.pollsOption?.pollTitle
  );

  // const formatDate = (dateString) => {
  //   if (!dateString) return "N/A";
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };
  function convertToISO8601DateOnly(dateString) {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    return date.toISOString().split('T')[0];
  }
  const getCampaignStatus = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const start = startDate;
    const end = endDate;

    if (formattedDate < start) {
      return { status: "Upcoming", color: "bg-blue-100 text-blue-800" };
    } else if (formattedDate >= start && formattedDate <= end) {
      return { status: "Active", color: "bg-green-100 text-green-800" };
    } else {
      return { status: "Ended", color: "bg-red-100 text-red-800" };
    }
  };

  const { status, color } = getCampaignStatus();

  const createANewCampaign = async () => {
    try {
      setLoading(true);

      if (!userApiKey) {
        toast.error(
          "Please generate an api key on your profile in order to create a campaign"
        );
        setLoading(false);
        return;
      }

      const constructDynamicInputResponse = () => {
        const fields = {};
        switch (selectedActionType) {
          case "Burn-Token":
          case "Compress-Token":
          case "Decompress-Token":
            fields.address = tokenMintAddress;
            fields.minAmount = parseInt(tokenMintAmount);
            if (!fields.address || !fields.minAmount) {
              toast.error(
                "Token address and minimum amount for action cannot be empty"
              );
              return null;
            }
            break;

          case "Poll":
            fields.options = optionsArray;
            fields.title = pollTitle;
            if (fields.options.length === 0) {
              toast.error(
                "Poll options must be a non-empty array for Poll action type."
              );
              return null;
            }
            if (!fields.title) {
              toast.error("Poll title cannot be empty");
            }
            break;

          case "Submit-Url":
            return { fields: {}, action: {} };

          case "Sell-Product":
            fields.product = productFile;
            fields.amount = parseInt(productAmount);
            fields.quantity = parseInt(productQuantity);
            if (!fields.product) {
              toast.error(
                "Product must be a non-empty string for Sell-Product action type."
              );
              return null;
            }
            if (isNaN(fields.amount) || isNaN(fields.quantity)) {
              toast.error(
                "Amount and quantity must be numbers for Sell-Product action type."
              );
              return null;
            }
            if (!fields.amount || !fields.quantity) {
              toast.error(
                "Product Amount and quantity cannot be empty for Sell-Product action type."
              );
              return null;
            }
            break;

          default:
            toast.error("Invalid action type.");
            return null;
        }
        return fields;
      };

      const fields = constructDynamicInputResponse();
      if (!fields) {
        setLoading(false);
        return; // Early exit if validation fails
      }
      const rewardInfo = {
        type: selectedReward,
        noOfPeople: numberOfWinners,
      };

      if (selectedReward === "Token") {
        rewardInfo.amount = parseInt(solAmount, 10);
        if (isNaN(rewardInfo.amount)) {
          toast.error("Amount must be a number for the selected reward type.");
          return;
        }
      } else if (selectedReward === "Verxio-XP") {
        rewardInfo.amount = parseInt(xpAmount, 10);
        if (isNaN(rewardInfo.amount)) {
          toast.error("Amount must be a number for the selected reward type.");
          return;
        }
      }
      if (!rewardInfo) {
        setLoading(false);
        return; // Early exit if validation fails
      }

      const requestBody = {campaignData: {
        campaignInfo: {
          title: title,
          start: convertToISO8601DateOnly(startDate),
          end: convertToISO8601DateOnly(endDate),
          description: description,
          banner: bannerImg,
        },
        rewardInfo,
      }};
          
      // Only add the action field if it's not a Submit-Url action type
      if (selectedActionType !== "Submit-Url") {
        requestBody.campaignData.action = { fields };
      }

      console.log(requestBody, userApiKey, "data here!!");
      const url = `${apiBaseURL}/campaign?campaignType=${selectedActionType}`;
      const prepareURL = `${apiBaseURL}/campaign/prepare?campaignType=${selectedActionType}`;

      // Set up the headers
      const headers = {
        "X-API-Key": userApiKey,
        "Content-Type": "application/json",
      };

      // Make the API call using Axios
      if (selectedReward === "Token") {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      const { amount } = requestBody.campaignData.rewardInfo;
      const treasuryAddress = new PublicKey(NEXT_PUBLIC_TREASURY_WALLET_ADDRESS);
      const RPC_URL = `${NEXT_PUBLIC_SOLANA_RPC_URL}/?api-key=${NEXT_PUBLIC_API_KEY}`;
      const connection = new Connection(RPC_URL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryAddress,
          lamports: amount * 1e9 // Convert SOL to lamports
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
  
      // // Send the signed transaction to the network
      const signature = await sendTransaction(signedTransaction, connection);
      // Wait for the transaction to be confirmed
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed. Signature:', signature);
    
      // // Now create the campaign
      const response = await axios.post(url, {
        signedTransaction: signedTransaction,
        campaignData: requestBody.campaignData
      }, { headers });

      if (response.data.success) {
        setLoading(false);
        toast.success(response.data.message);
        dispatch(resetCreateCampaignFormData());
        getAllCampaigns();
      } else {
        throw new Error(response.data.message);
      }

      } else {
        // For non-token campaigns, directly call the create endpoint
        const response = await axios.post(url, requestBody, { headers });
  
        if (response.data.success === true) {
        setLoading(false);
        toast.success(response.data.message);
        dispatch(resetCreateCampaignFormData());
        getAllCampaigns()
      } else {
        toast.error(response.data.message);
      }
    }

      setLoading(false);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-800 mb-2 sm:mb-0">
            Campaign Preview
          </h2>
          <StatusBadge status={status} color={color} />
        </div>

        <div className="space-y-6">
          <PreviewSection title="Campaign Name" content={title || "N/A"} />

          <PreviewSection title="Campaign Description">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: mdParser.render(description || "N/A"),
              }}
            />
          </PreviewSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Activity}
              title="Campaign Type"
              value={campaignData.type || "N/A"}
              color="bg-blue-100 text-blue-800"
            />
            <StatCard
              icon={
                selectedReward === "Token" ? Coins :
                selectedReward === "Verxio-XP" ? CheckCircle :
                selectedReward === "Airdrop" ? PlusCircle :
                selectedReward === "NFT-Drop" ? ImagePlay :
                selectedReward === "Whitelist-Spot" ? Users :
                selectedReward === "Merch-Drop" ? ShoppingBasket :
                Award
              }
              title="Reward"
              value={
                selectedReward === "Token"
                  ? `${solAmount ? solAmount.toFixed(1) : "0"} SOL`
                  : selectedReward === "Verxio-XP"
                  ? `${xpAmount ? xpAmount : "0"} XP`
                  : selectedReward || "N/A"
              }
              color="bg-purple-200 text-purple-800"
            />
            <StatCard
              icon={Trophy}
              title="Number of Winners"
              value={numberOfWinners || "N/A"}
              color="bg-green-100 text-green-800"
            />
            <StatCard
              icon={Clock}
              title="Duration"
              value={`${startDate ? startDate : "Start Date"} - ${
                endDate ? endDate : "End Date"
              }`}
              color="bg-amber-50 text-black"
            />
          </div>

          <PreviewSection
            title="Campaign Action"
            content={selectedActionType || "N/A"}
          />
          {/* 
          <PreviewSection
            title="Campaign Reward"
            content={selectedReward || "N/A"}
          /> */}
        </div>

        <div className="mt-8">
          <Button
            onClick={() => createANewCampaign()}
            name={"Create Campaign"}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      {loading && <LoadingSpinner />}
    </>
  );
};

const StatusBadge = ({ status, color }) => (
  <span className={`${color} px-3 py-1 rounded-full font-semibold text-sm`}>
    {status}
  </span>
);

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div
    className={`${color} p-4 rounded-lg flex flex-col items-center text-center`}
  >
    <Icon size={24} className="mb-2" />
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const ActionRewardBadge = ({ text, IconComponent, color }) => (
  <div
    className={`inline-flex items-center bg-indigo-100 ${color} rounded-full px-3 py-1`}
  >
    <IconComponent size={16} className="mr-2" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const ActionDataCard = ({ action, data }) => {
  const PlatformIcon = platformIcons[data.platform]?.icon || Coins;
  const platformColor = platformIcons[data.platform]?.color || "text-gray-500";

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-indigo-700">{action}</h4>
        <div className="flex items-center">
          <PlatformIcon className={`mr-2 ${platformColor}`} size={20} />
          <span className={`font-medium ${platformColor}`}>
            {data.platform}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data).map(
          ([key, value]) =>
            key !== "platform" && (
              <div key={key} className="bg-gray-50 p-2 rounded-md">
                <span className="font-medium text-gray-700">{key}: </span>
                <span className="text-gray-900">{value}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
};

const PreviewSection = ({ title, children, content }) => (
  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
    <h3 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h3>
    {content ? <p className="text-lg text-gray-800">{content}</p> : children}
  </div>
);

export default CampaignPreview;
