import React from "react";
// import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
// import MdEditor from "react-markdown-editor-lite";
// import { FaExchangeAlt } from "react-icons/fa";
// import { SiExpertsexchange } from "react-icons/si";
// import { GiWaveCrest } from "react-icons/gi";
import { Button } from "@/components/Button";
import {
  Repeat,
  Droplet,
  Coins,
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
import { createCampaign } from "@/store/slices/profileSlice";
// import { setRewards } from "@/store/slices/statesSlice";

// const mdParser = new MarkdownIt();

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
  if (!campaignData) {
    return <div>No campaign data available.</div>;
  }
  
  const dispatch = useDispatch();
  const details = useSelector((state) => state.generalStates.details);
  const rewards = useSelector((state) => state.generalStates.rewards);
  const actionType = useSelector((state) => state.generalStates.actionType);
  const tokenMint = useSelector((state) => state.generalStates.tokenMint);
  const digitalProduct = useSelector(
    (state) => state.generalStates.digitalProduct
  );

  const { title, description, bannerImg, startDate, endDate } = details;
  const { selectedReward, numberOfWinners, solAmount, xpAmount } = rewards;
  const { selectedActionType } = actionType;
  const { productAmount, productQuantity, productFile, isCustomAmount } =
    tokenMint;
  const { tokenMintAmount, tokenMintAddress, tokenURL } = digitalProduct;


  // const formatDate = (dateString) => {
  //   if (!dateString) return "N/A";
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const getCampaignStatus = () => {
    const now = new Date();
    const start = startDate;
    const end = endDate;

    if (now < start) {
      return { status: "Upcoming", color: "bg-blue-100 text-blue-800" };
    } else if (now >= start && now <= end) {
      return { status: "Active", color: "bg-green-100 text-green-800" };
    } else {
      return { status: "Ended", color: "bg-red-100 text-red-800" };
    }
  };

  const { status, color } = getCampaignStatus();


  const createANewCampaign = async (values) => {
    try {
      const response = await dispatch(
        createCampaign({
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            bio: values.bio,
            interests: values.interests,
            socials: values.socials,
          },
          action: selectedActionType,
        })
      );
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        console.log(response);
      } else {
        toast.error(response.payload.message);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2 sm:mb-0">
          Campaign Preview
        </h2>
        <StatusBadge status={status} color={color} />
      </div>

      <div className="space-y-6">
        <PreviewSection title="Campaign Name" content={title || "N/A"} />

        <PreviewSection
          title="Campaign Description"
          content={description || "N/A"}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={Activity}
            title="Campaign Type"
            value={campaignData.type || "N/A"}
            color="bg-blue-100 text-blue-800"
          />
          <StatCard
            icon={Award}
            title="Number of Winners"
            value={numberOfWinners || "N/A"}
            color="bg-green-100 text-green-800"
          />
          <StatCard
            icon={Clock}
            title="Duration"
            value={`${startDate} - ${endDate}`}
            color="bg-amber-50 text-black"
          />
        </div>

        <PreviewSection
          title="Campaign Action"
          content={selectedActionType || "N/A"}
        />

        <PreviewSection
          title="Campaign Reward"
          content={selectedReward || "N/A"}
        />
      </div>

      <div className="mt-8">
        <Button
          onClick={() => console.log(data)}
          name={"Create Campaign"}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
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

// const ActionRewardBadge = ({ text, IconComponent, color }) => (
//   <div
//     className={`inline-flex items-center bg-indigo-100 ${color} rounded-full px-3 py-1`}
//   >
//     <IconComponent size={16} className="mr-2" />
//     <span className="text-sm font-medium">{text}</span>
//   </div>
// );

// const ActionDataCard = ({ action, data }) => {
//   const PlatformIcon = platformIcons[data.platform]?.icon || Coins;
//   const platformColor = platformIcons[data.platform]?.color || "text-gray-500";

//   return (
//     <div className="bg-white rounded-lg p-4 shadow-sm">
//       <div className="flex items-center justify-between mb-3">
//         <h4 className="text-lg font-semibold text-indigo-700">{action}</h4>
//         <div className="flex items-center">
//           <PlatformIcon className={`mr-2 ${platformColor}`} size={20} />
//           <span className={`font-medium ${platformColor}`}>
//             {data.platform}
//           </span>
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         {Object.entries(data).map(
//           ([key, value]) =>
//             key !== "platform" && (
//               <div key={key} className="bg-gray-50 p-2 rounded-md">
//                 <span className="font-medium text-gray-700">{key}: </span>
//                 <span className="text-gray-900">{value}</span>
//               </div>
//             )
//         )}
//       </div>
//     </div>
//   );
// };

const PreviewSection = ({ title, children, content }) => (
  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
    <h3 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h3>
    {content ? <p className="text-lg text-gray-800">{content}</p> : children}
  </div>
);

export default CampaignPreview;
