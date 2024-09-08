 "use client"
import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, Briefcase, User, Compass } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';
import CreateCampaign from '@/components/CreateCampaign';
import MyCampaigns from './MyCampigns';
import Profile from '@/components/Profile';
import ExploreCampaigns from '@/components/ExploreCampaigns';
import NavButton from '@/components/NavButton';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';


const Dashboard = () => {

  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );


  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreCampaigns />;
        case 'myCampaigns':
          return <MyCampaigns />;
      case 'create':
        return <CreateCampaign />;
      case 'profile':
        return <Profile />;
        case 'leaderboard':
          return <Leaderboard />;
      default:
        return null;
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </main>
      <nav className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <NavButton icon={<Compass />} label="Explore" onClick={() => setActiveTab('explore')} active={activeTab === 'explore'} />
            <NavButton icon={<Briefcase />} label="My Campaigns" onClick={() => setActiveTab('myCampaigns')} active={activeTab === 'myCampaigns'} />
            <NavButton icon={<PlusCircle />} label="Create" onClick={() => setActiveTab('create')} active={activeTab === 'create'} />
            <NavButton icon={<User />} label="Profile" onClick={() => setActiveTab('profile')} active={activeTab === 'profile'} />
            <NavButton icon={<LayoutDashboard />} label="Leaderboard" onClick={() => setActiveTab('leaderboard')} active={activeTab === 'leaderboard'} />
          </div>
        </div>
      </nav>
    </div>
    </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Dashboard;
