import React from "react";
import Link from "next/link";
import {
  Users,
  Award,
  Calendar,
  ChevronRight,
  Gift,
  Clock,
  ImagePlay,
  PlusCircle,
  Minimize,
  Maximize,
  BarChart2,
  Flame,
  ShoppingCart,
  Share,
  ShoppingBasket,
  CheckCircle,
  Coins,
} from "lucide-react";

const availableRewards = [
  {
    name: "Whitelist Spot",
    value: "Whitelist-Spot",
    icon: <Users className="text-blue-500" />,
  },
  {
    name: "NFT Drop",
    value: "NFT-Drop",
    icon: <ImagePlay className="text-purple-500" />,
  },
  {
    name: "Token",
    value: "Token",
    icon: <Coins className="text-yellow-500" />,
  },
  {
    name: "Airdrop",
    value: "Airdrop",
    icon: <PlusCircle className="text-green-500" />,
  },
  {
    name: "Merch Drop",
    value: "Merch-Drop",
    icon: <ShoppingBasket className="text-red-500" />,
  },
  {
    name: "Verxio XP",
    value: "Verxio-XP",
    icon: <CheckCircle className="text-indigo-500" />,
  },
];

const actions = [
  {
    name: "Burn Token",
    value: "Burn-Token",
    icon: <Flame className="text-red-500" />,
  },
  {
    name: "Compress Token",
    value: "Compress-Token",
    icon: <Minimize className="text-indigo-500" />,
  },
  {
    name: "Decompress Token",
    value: "Decompress-Token",
    icon: <Maximize className="text-pink-500" />,
  },
  {
    name: "Create Poll",
    value: "Poll",
    icon: <BarChart2 className="text-green-500" />,
  },
  {
    name: "Sell Digital Product",
    value: "Sell-Product",
    icon: <ShoppingCart className="text-purple-500" />,
  },
  {
    name: "Submit Url",
    value: "Submit-Url",
    icon: <Share className="text-yellow-400" />,
  },
];

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon}
    <div className="ml-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  </div>
);

const ExploreCampaignCard = ({ campaign }) => {
  const rewardIcon = availableRewards.find(
    (reward) => reward.value === campaign?.rewardInfo?.type
  )?.icon || <Gift className="text-gray-500" />;

  const actionIcon = actions.find(
    (action) => action.value === campaign?.action?.actionType
  )?.icon || <Clock className="text-gray-500" />;

  return (
    <Link href={`/dashboard/explore/${campaign._id}`}>
      <div className="bg-[#FBFBFE] rounded-lg shadow hover:shadow-sm transition-all duration-300 p-6 mb-4 relative overflow-hidden border border-[#DCE0EF]">
        <div className="flex flex-col items-start justify-start gap-3 mb-4 md:flex-row md:justify-between md:items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {campaign?.campaignInfo?.title}
          </h2>
          <span
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              campaign.status === "Active"
                ? "bg-green-100 text-green-800"
                : campaign.status === "Upcoming"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {campaign?.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-5">
          <Stat
            icon={<Users className="text-indigo-500" />}
            label="Participants"
            value={`${campaign?.submission ?? 0}`}
          />
          <Stat
            icon={<Award className="text-yellow-500" />}
            label="Winners"
            value={`${campaign.rewardInfo.noOfPeople}`}
          />
          <Stat
            icon={<Calendar className="text-green-500" />}
            label="Days Left"
            value={`${campaign.daysLeft} Days`}
          />
          <Stat
            icon={actionIcon}
            label="Action"
            value={campaign.action?.actionType}
          />
          <Stat
            icon={rewardIcon}
            label="Reward Pool"
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
        <div className="flex items-center justify-end text-sm text-gray-600">
          <ChevronRight className="text-gray-400" />
        </div>
      </div>
    </Link>
  );
};

export default ExploreCampaignCard;
