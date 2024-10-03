import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  ChevronLeft,
  Users,
  Coins,
  Gift,
  Save,
  ExternalLink,
  Award,
  Calendar,
  Activity,
  Zap,
  TrophyIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WinnerSelection from "./WinnerSelection";
import WinnersList from "./WinnersList";
import { Toaster } from "react-hot-toast";
import { CampaignContext } from "@/context/campaignContext";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const ManageCampaignInfo = ({ campaign }) => {
  const mdParser = useMemo(() => new MarkdownIt({ html: true }), []);
  // const [winners, setWinners] = useState([]);
  const { state, getAllParticipants, getAllWinners } = useContext(CampaignContext);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const participatntsList = state.campaignParticipants;
  const winnersList = state.campaignWinners;

  useEffect(() => {
    getAllParticipants(campaign?.id);
    getAllWinners(campaign?.id);
  }, []);

  const handlePickWinners = () => {
    setShowWinnerSelection(true);
    getAllParticipants(campaign?.id);
  };

  // const handleWinnersSelected = (selectedWinners) => {
  //   setWinners(selectedWinners);
  // };

  const generateAvatar = (address) => {
    return `https://api.dicebear.com/9.x/micah/svg?seed=${
      address || "placeholder"
    }.svg`;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#FBFBFE] rounded-2xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <Link
            href="/dashboard/manage-campaign"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 mb-6"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to My Campaigns
          </Link>
          <h1 className="text-4xl font-bold text-indigo-900 mb-6 text-center">
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

          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md">
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

          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Action Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailCard
                title="Platform"
                value="Jupiter"
                icon={ExternalLink}
                color="bg-indigo-50 text-indigo-800"
              />
              <DetailCard
                title="Token to Swap"
                value="SOL"
                icon={ExternalLink}
                color="bg-purple-50 text-purple-800"
              />
              <DetailCard
                title="Min Amount"
                value="0.1 SOL"
                icon={ExternalLink}
                color="bg-pink-50 text-pink-800"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {/* <ActionButton
            onClick={handleParticipate}
            icon={ExternalLink}
            text="Participate Now"
            color="bg-indigo-600 hover:bg-indigo-700"
          /> */}
            <ActionButton
              onClick={handlePickWinners}
              icon={Award}
              text="Pick Winners"
              color="bg-yellow-600 hover:bg-yellow-700"
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
  <div className={`${color} p-3 rounded-lg flex items-center`}>
    <Icon size={20} className="mr-2" />
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ onClick, icon: Icon, text, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center ${color} text-white px-6 py-3 rounded-lg transition duration-300`}
  >
    <Icon size={20} className="mr-2" />
    {text}
  </button>
);

export default ManageCampaignInfo;
