import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  ChevronLeft,
  Users,
  Coins,
  Gift,
  // Save,
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

const ManageCampaignInfo = ({ campaign }) => {
  const {
    state,
    getAllParticipants,
    getAllWinners,
    payWinners,
    showPaymentModal,
    setShowPaymentModal,
  } = useContext(CampaignContext);
  const participatntsList = state.campaignParticipants;
  const winnersList = state.campaignWinners;
  const isLargeScreen = useMediaQuery("(min-width: 768px)");
  // const [showPaymentModal, setShowPaymentModal] = useState(false);
  const mdParser = useMemo(() => new MarkdownIt({ html: true }), []);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);

  useEffect(() => {
    getAllParticipants(campaign?.id);
    getAllWinners(campaign?.id);
  }, []);

  const handlePickWinners = () => {
    if (campaign?.status !== "Ended") {
      toast.error("Sorry you cannot select winners for an ongoing campaign");
      return;
    }
    setShowWinnerSelection(true);
    getAllParticipants(campaign?.id);
  };

  const handlePayWinners = () => {
    if (campaign?.status !== "Ended") {
      toast.error("Cannot payout winners while campaign has not ended");
      return;
    }
    if (winnersList.length === 0) {
      toast.error("Please select winners");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCopyBlinkUrl = () => {
    if (campaign?.blink) {
      navigator.clipboard
        .writeText(campaign.blink)
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
            className="flex items-center mb-6 text-indigo-600 transition duration-300 hover:text-indigo-800"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to My Campaigns
          </Link>
          <h1 className="mb-6 text-2xl font-bold text-center text-indigo-900 md:text-4xl">
            {campaign?.campaignInfo?.title}
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-8 md:grid-cols-4">
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

          <div className="p-6 mb-8 shadow-md rounded-xl">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Campaign Details
            </h2>

            <div className="mb-4 text-gray-600">
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
          </div>

          <div className="p-6 mb-12 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
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
                    <span className="mt-2 text-sm text-gray-600">
                      {participant.userId.slice(0, 6)}...
                      {participant.userId.slice(-4)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No Participants yet
              </div>
            )}
          </div>
          <WinnersList winners={winnersList} />

          {showWinnerSelection && (
            <WinnerSelection
              campaign={campaign}
              onClose={() => setShowWinnerSelection(false)}
            />
          )}

          {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Streamflow Payout 💰
                  </h2>
                </div>
                <div className="mb-8">
                  <p className="leading-relaxed text-gray-600">
                    Payment will be completed with Streamflow. A payment stream
                    will be created for each winner.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 mr-4 font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <Button
                    name="Continue"
                    className="px-4 py-2 text-sm sm:text-base sm:px-6"
                    onClick={() => payWinners(campaign?.id)}
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
    <h2 className="mb-1 text-lg font-semibold">{title}</h2>
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
