"use client";
import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  User,
  Compass,
} from "lucide-react";
import NavButton from "@/components/NavButton";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { usePathname } from "next/navigation";
import { CampaignProvider } from "@/context/campaignContext";

const Layout = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState(pathname);

  const navItems = [
    {
      icon: <Compass />,
      label: "Explore",
      href: "/dashboard/explore",
    },
    {
      icon: <PlusCircle />,
      label: "Create",
      href: "/dashboard/create-campaign?route=detail",
    },
    {
      icon: <Briefcase />,
      label: "Campaigns",
      href: "/dashboard/manage-campaign",
    },
    {
      icon: <User />,
      label: "Profile",
      href: "/dashboard/profile",
    },
    // {
    //   icon: <LayoutDashboard />,
    //   label: "Leaderboard",
    //   href: "/dashboard/leaderboard",
    // },
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CampaignProvider>
            <div className="flex flex-col h-screen bg-[#dde9ed]-100">
              <main className="flex-1 p-4 mb-12 overflow-y-auto">
                {children}
              </main>
              <nav className="w-full max-w-full overflow-x-auto bg-white fixed bottom-0 left-0 right-0 border-t border-gray-200 z-[999]">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    {navItems.map((item, index) => (
                      <NavButton
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        isActive={activeButton === item.href}
                        onClick={() => setActiveButton(item.href)}
                      />
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </CampaignProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Layout;
