import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  ChevronLeft,
  Users,
  Coins,
  Gift,
  Save,
  BadgeDollarSign,
  Award,
  Calendar,
  Activity,
  Zap,
  TrophyIcon,
  Copy,
} from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import WinnerSelection from "./WinnerSelection";
import WinnersList from "./WinnersList";
import { Toaster, toast } from "react-hot-toast";
import { CampaignContext } from "@/context/campaignContext";
import MarkdownIt from "markdown-it";
import useMediaQuery from "@/hooks/useMediaQuery";
import "react-markdown-editor-lite/lib/index.css";
import axios from 'axios';
import { useSelector } from "react-redux";

const ManageCampaignInfo = ({ campaign }) => {
  const mdParser = useMemo(() => new MarkdownIt({ html: true }), []);
  const [winners, setWinners] = useState([]);
  const { state, getAllParticipants, getAllWinners } =
    useContext(CampaignContext);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
  const isVerified = useSelector(
    (state) => state.generalStates.userProfile.isVerified
  );
  const userApiKey = useSelector(
    (state) => state.generalStates?.userProfile?.key
  );
  const participatntsList = state.campaignParticipants;
  const winnersList = state.campaignWinners;
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    getAllParticipants(campaign?.id);
    getAllWinners(campaign?.id);
  }, []);

  const handlePickWinners = () => {
    setShowWinnerSelection(true);
    getAllParticipants(campaign?.id);
  };

  const handleWinnersSelected = (selectedWinners) => {
    setWinners(selectedWinners);
  };

  const handlePayWinners = () => {
    setShowPaymentModal(true);
  };

  const handleCopyBlinkUrl = () => {
    if (campaign?.blink) {
      navigator.clipboard.writeText(campaign.blink)
        .then(() => {
          toast.success("Blink URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          toast.error("Failed to copy Blink URL");
        });
    } else {
      toast.error("No Blink URL available");
    }
  };

        // Set up the headers
    const headers = {
        "X-API-Key": userApiKey,
        "Content-Type": "application/json",
    };

  const handleConfirmPayment = async () => {
    try {
      const response = await axios.post(`${apiBaseURL}/campaign/pay/${campaign.id}`, {headers});
      console.log('Payment response:', response.data);
      // Handle successful payment (e.g., show success message, update UI)
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error paying winners:', error);
      // Handle error (e.g., show error message)
    }
  };

  const generateAvatar = (address) => {
    return `https://api.dicebear.com/9.x/micah/svg?seed=${
      address || "placeholder"
    }.svg`;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#FBFBFE] rounded-2xl py-8 px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-4xl mx-auto ${
            isLargeScreen ? "bg-white rounded-xl shadow-md p-8" : "p-4"
          }`}
        >
          <Link
            href="/dashboard/manage-campaign"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 mb-6"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to My Campaigns
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-indigo-900 mb-6 text-center">
            {campaign?.campaignInfo?.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Activity}
              title="Status"
              value={campaign.status}
              color="bg-blue-100 text-blue-800"
            />
            <StatCard
              icon={Calendar}
              title="Days Left"
              value={`${campaign?.daysLeft} Days`}
              color="bg-amber-100 text-green-800"
            />
            <StatCard
              icon={Users}
              title="Participants"
              value={campaign?.submission}
              color="bg-green-100 text-purple-800"
            />
            <StatCard
              icon={TrophyIcon}
              title="Number of Winners"
              value={`${campaign.rewardInfo.noOfPeople}`}
              color="bg-yellow-100 text-yellow-800"
            />
          </div>

          <div className="mb-8 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Campaign Details
            </h2>

            <div className="text-gray-600 mb-4">
              <p
                dangerouslySetInnerHTML={{
                  __html: mdParser.render(
                    campaign?.campaignInfo?.description ||
                      "No description available."
                  ),
                }}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <DetailCard
                title="Action"
                value={campaign.action?.actionType}
                icon={Zap}
                color="bg-blue-50 text-blue-800"
              />
              <DetailCard
                title="Reward"
                icon={(() => {
                  switch (campaign.rewardInfo.type) {
                    case "Token":
                      return Coins;
                    case "Verxio-XP":
                      return Award;
                    default:
                      return Gift;
                  }
                })()}
                color="bg-purple-200 text-purple-800"
                value={(() => {
                  const { type, amount } = campaign.rewardInfo;
                  const formattedAmount = (n) => {
                    const parsed = parseFloat(n);
                    return isNaN(parsed)
                      ? "0"
                      : new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 1,
                        }).format(parsed);
                  };

                  switch (type) {
                    case "Token":
                      return `${formattedAmount(amount)} SOL`;
                    case "Verxio-XP":
                      return `${formattedAmount(amount)} vCredit`;
                    default:
                      return (
                        type.charAt(0).toUpperCase() +
                        type
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()
                      );
                  }
                })()}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
              <ActionButton
              onClick={handleCopyBlinkUrl}
              icon={Copy}
              text="Copy Blink URL"
              color="bg-blue-600 hover:bg-blue-700"
            />
            <ActionButton
              onClick={handlePickWinners}
              icon={Award}
              text="Pick Winners"
              color="bg-yellow-600 hover:bg-yellow-700"
            />
            <ActionButton
              onClick={handlePayWinners}
              icon={BadgeDollarSign}
              text="SOL Payout"
              color="bg-green-600 hover:bg-green-700"
            />
            {/* <ActionButton
            onClick={handleSaveAudience}
            icon={Save}
            text="Save Audience"
            color="bg-blue-600 hover:bg-blue-700"
          /> */}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Participants
            </h2>
            {participatntsList.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {participatntsList.slice(0, 6).map((participant, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Image
                      src={generateAvatar(participant._id)}
                      alt={`Participant ${index + 1}`}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-600 mt-2">
                      {participant.userId.slice(0, 6)}...
                      {participant.userId.slice(-4)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No Participants yet
              </div>
            )}
          </div>
          <WinnersList winners={winnersList} />

          {showWinnerSelection && (
            <WinnerSelection
              campaign={campaign}
              onClose={() => setShowWinnerSelection(false)}
              onWinnersSelected={handleWinnersSelected}
            />
          )}

          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Confirm Payment</h2>
                </div>
                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed">
                    Payment will be completed with Streamflow. A payment stream will be created for each winner.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="mr-4 px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                  <Button
                    name="Continue"
                    className="text-sm sm:text-base px-4 sm:px-6 py-2"
                      onClick={handleConfirmPayment}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div
    className={`${color} p-4 rounded-lg flex flex-col items-center text-center`}
  >
    <Icon size={24} className="mb-2" />
    <h2 className="text-lg font-semibold mb-1">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const DetailCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`${color} p-3 rounded-lg flex flex-col items-center gap-2 w-full md:w-[230px]`}
  >
    <Icon size={20} className="mr-2" />
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const ActionButton = ({ onClick, icon: Icon, text, color }) => (
  <Button
    name={text}
    className={`flex items-center ${color} text-white px-6 py-3 rounded-lg transition duration-300`}
    onClick={onClick}
  >
    <Icon size={20} className="mr-2" />
    {text}
  </Button>
);

export default ManageCampaignInfo;