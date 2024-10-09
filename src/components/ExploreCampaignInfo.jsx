import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Users,
  Gift,
  Coins,
  // Save,
  // ExternalLink,
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
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import useMediaQuery from "@/hooks/useMediaQuery";
import { CampaignContext } from "@/context/campaignContext";
import { Toaster } from "react-hot-toast";
import ParticipateNow from "@/components/ParticipateNow";
import RenderBlink from "@/components/RenderBlink";

const ExploreCampaignInfo = ({ campaign }) => {
  const [winners, setWinners] = useState([]);
  const mdParser = useMemo(() => new MarkdownIt({ html: true }), []);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const { state, getAllParticipants } = useContext(CampaignContext);
  const participatntsList = state.campaignParticipants;
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    getAllParticipants(campaign?.id);
  }, []);

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
            href="/dashboard/explore"
            className="flex items-center mb-6 text-indigo-600 transition duration-300 hover:text-indigo-800"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to All Campaigns
          </Link>
          <h1 className="mb-6 text-2xl font-bold text-center text-indigo-900 md:text-4xl">
            {campaign?.campaignInfo?.title}
          </h1>

          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
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
              color="bg-green-100 text-green-800"
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

          <RenderBlink campaign={campaign} />

          <div className="p-6 mb-12 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Recent Participants
            </h2>
            {participatntsList.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {participatntsList.map((participant, index) => (
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

          <WinnersList winners={winners} campaign={campaign} />

          {showWinnerSelection && (
            <WinnerSelection
              campaign={campaign}
              onClose={() => setShowWinnerSelection(false)}
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
export default ExploreCampaignInfo;
