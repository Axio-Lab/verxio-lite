import React from "react";
import Link from "next/link";
import {
  Users,
  Award,
  Calendar,
  ChevronRight,
  Gift,
  Clock,
  Trophy,
  PlusCircle,
  Droplet,
  Coins,
  Flame,
  ShoppingCart,
  Share,
  MessageCircle,
  UserPlus,
  ClipboardList,
  CheckCircle,
  Repeat,
  PackageOpen
} from "lucide-react";

const availableRewards = [
  { name: "Whitelist Spot", icon: <Users className="text-blue-500" /> },
  { name: "NFT Drop", icon: <Gift className="text-purple-500" /> },
  { name: "Token", icon: <Trophy className="text-yellow-500" /> },
  { name: "Airdrop", icon: <PlusCircle className="text-green-500" /> },
  { name: "Merch Drop", icon: <PackageOpen className="text-red-500" /> },
  { name: "Verxio Credit", icon: <CheckCircle className="text-indigo-500" /> },
];

const actions = {
  Onchain: [
    { name: "Swap Token", icon: <Repeat className="text-blue-500" /> },
    { name: "Provide Liquidity", icon: <Droplet className="text-green-500" /> },
    { name: "Stake Token", icon: <Coins className="text-yellow-500" /> },
    { name: "Burn Token", icon: <Flame className="text-red-500" /> },
    {
      name: "Sell Digital Product",
      icon: <ShoppingCart className="text-purple-500" />,
    },
  ],
  Offchain: [
    { name: "Share on Twitter", icon: <Share className="text-blue-400" /> },
    {
      name: "Join Discord",
      icon: <MessageCircle className="text-indigo-500" />,
    },
    { name: "Refer a friend", icon: <UserPlus className="text-green-500" /> },
    {
      name: "Complete a survey",
      icon: <ClipboardList className="text-orange-500" />,
    },
  ],
};

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon}
    <div className="ml-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  </div>
);

const CampaignCard = ({ campaign }) => {
  const rewardIcon = availableRewards.find(
    (reward) => reward.name === campaign.reward
  )?.icon || <Gift className="text-gray-500" />;
  const actionIcon = [...actions.Onchain, ...actions.Offchain].find(
    (action) => action.name === campaign.action
  )?.icon || <Clock className="text-gray-500" />;

  return (
    <Link href={`/`}>
      <div className="bg-[#FBFBFE] rounded-lg shadow hover:shadow-sm transition-all duration-300 p-6 mb-4 relative overflow-hidden border border-[##DCE0EF]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{campaign.title}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              campaign.status === "Active"
                ? "bg-green-100 text-green-800"
                : campaign.status === "Upcoming"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {campaign.status}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
          <Stat
            icon={<Users className="text-indigo-500" />}
            label="Participants"
            value={campaign.participants}
          />
          <Stat
            icon={<Award className="text-yellow-500" />}
            label="Winners"
            value={campaign.winners}
          />
          <Stat
            icon={<Calendar className="text-green-500" />}
            label="Days Left"
            value={campaign.daysLeft}
          />
          <Stat icon={actionIcon} label="Action" value={campaign.action} />
          <Stat icon={rewardIcon} label="Reward" value={campaign.reward} />
        </div>
        <div className="flex justify-end items-center text-sm text-gray-600">
          <ChevronRight className="text-gray-400" />
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
