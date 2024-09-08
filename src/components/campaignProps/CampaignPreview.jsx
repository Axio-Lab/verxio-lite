import React from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { Repeat, Droplet, Coins, ShoppingCart, Minimize, Maximize, Share, Flame, MessageCircle, UserPlus, ClipboardList, Users, Gift, Trophy, PlusCircle, Calendar, Activity, Award, Zap, Clock } from 'lucide-react';
import { FaExchangeAlt } from 'react-icons/fa';
import { SiExpertsexchange } from 'react-icons/si';
import { GiWaveCrest } from 'react-icons/gi';

const mdParser = new MarkdownIt();

const actionIcons = {
  'Swap token': { icon: Repeat, color: 'text-blue-500' },
  'Sell digital product': { icon: ShoppingCart, color: 'text-purple-500' },
  'Provide liquidity': { icon: Droplet, color: 'text-green-500' },
  'Stake token': { icon: Coins, color: 'text-yellow-500' },
  'Compress token': { icon: Minimize, color: 'text-indigo-500' },
  'Decompress token': { icon: Maximize, color: 'text-pink-500' },
  'Burn token': { icon: Flame, color: 'text-red-500' },
  'Share on Twitter': { icon: Share, color: 'text-blue-400' },
  'Join Discord': { icon: MessageCircle, color: 'text-indigo-500' },
  'Refer a friend': { icon: UserPlus, color: 'text-green-500' },
  'Complete a survey': { icon: ClipboardList, color: 'text-orange-500' }
};

const rewardIcons = {
  'Whitelist spot': { icon: Users, color: 'text-blue-500' },
  'NFT drop': { icon: Gift, color: 'text-purple-500' },
  'Token': { icon: Trophy, color: 'text-yellow-500' },
  'Airdrop': { icon: PlusCircle, color: 'text-green-500' },
  'Merch drop': { icon: Gift, color: 'text-red-500' },
  'Verxio XP': { icon: Coins, color: 'text-indigo-500' }
};

const platformIcons = {
  'Jupiter': { icon: FaExchangeAlt, color: 'text-blue-500' },
  'Raydium': { icon: SiExpertsexchange, color: 'text-purple-500' },
  'Kamino': { icon: GiWaveCrest, color: 'text-green-500' },
};

const CampaignPreview = ({ campaignData }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCampaignStatus = () => {
    const now = new Date();
    const start = new Date(campaignData.startDate);
    const end = new Date(campaignData.endDate);

    if (now < start) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= start && now <= end) {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'Ended', color: 'bg-red-100 text-red-800' };
    }
  };

  const { status, color } = getCampaignStatus();

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-8 rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-indigo-800">
          Campaign Preview
        </h2>
        <StatusBadge status={status} color={color} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Campaign Name</h3>
        <p className="text-xl font-medium text-gray-800">{campaignData.name}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Campaign Description</h3>
        <div className="prose max-w-none">
          <MdEditor
            value={campaignData.description}
            renderHTML={(text) => mdParser.render(text)}
            config={{
              view: { menu: false, md: false, html: true },
              canView: { menu: false, md: false, html: true, fullScreen: false, hideMenu: false },
            }}
            readOnly={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Activity} title="Campaign Type" value={campaignData.type} color="bg-blue-100 text-blue-800" />
        <StatCard icon={Award} title="Number of Winners" value={campaignData.numWinners} color="bg-green-100 text-green-800" />
        <StatCard 
          icon={Clock} 
          title="Duration" 
          value={`${formatDate(campaignData.startDate)} - ${formatDate(campaignData.endDate)}`} 
          color="bg-amber-50 text-black"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Selected Actions</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {campaignData.selectedActions.map((action) => (
            <ActionRewardBadge 
              key={action} 
              text={action} 
              IconComponent={actionIcons[action].icon} 
              color={actionIcons[action].color}
            />
          ))}
        </div>
        <div className="space-y-4 mt-6">
          {campaignData.selectedActions.map((action) => (
            campaignData.actionData[action] && (
              <ActionDataCard 
                key={action}
                action={action}
                data={campaignData.actionData[action]}
              />
            )
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Selected Rewards</h3>
        <div className="flex flex-wrap gap-2">
          {campaignData.selectedRewards.map((reward) => (
            rewardIcons[reward] ? (
              <ActionRewardBadge 
                key={reward} 
                text={reward} 
                IconComponent={rewardIcons[reward].icon} 
                color={rewardIcons[reward].color}
              />
            ) : (
              <span key={reward} className="text-red-500">Unknown reward: {reward}</span>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, color }) => (
  <span className={`${color} px-4 py-2 rounded-full font-semibold text-sm`}>
    {status}
  </span>
);

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className={`${color} p-4 rounded-lg flex flex-col items-center text-center`}>
    <Icon size={24} className="mb-2" />
    <h2 className="text-lg font-semibold mb-1">{title}</h2>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const ActionRewardBadge = ({ text, IconComponent, color }) => (
  <div className={`inline-flex items-center bg-indigo-100 ${color} rounded-full px-3 py-1`}>
    <IconComponent size={16} className="mr-2" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const ActionDataCard = ({ action, data }) => {
  const PlatformIcon = platformIcons[data.platform]?.icon || Coins;
  const platformColor = platformIcons[data.platform]?.color || 'text-gray-500';

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-indigo-700">{action}</h4>
        <div className="flex items-center">
          <PlatformIcon className={`mr-2 ${platformColor}`} size={20} />
          <span className={`font-medium ${platformColor}`}>{data.platform}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data).map(([key, value]) => (
          key !== 'platform' && (
            <div key={key} className="bg-white p-2 rounded-md shadow-sm">
              <span className="font-medium text-gray-700">{key}: </span>
              <span className="text-gray-900">{value}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default CampaignPreview;
