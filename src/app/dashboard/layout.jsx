"use client";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  User,
  Compass,
} from "lucide-react";
import NavButton from "@/components/NavButton";
import { useMemo } from "react";
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

const Layout = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col h-screen bg-gray-100">
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            <nav className="w-full max-w-full overflow-x-auto bg-white border-t border- gray-200">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <NavButton icon={<Compass />} label="Explore" href={"/dashboard"}/>
                  <NavButton icon={<PlusCircle />} label="Create" href={"/dashboard/create-campaign"}/>
                  <NavButton icon={<Briefcase />} label="Campaigns" href={"/dashboard/manage-campaign"}/>
                  <NavButton icon={<LayoutDashboard />} label="Leaderboard" href={"/dashboard/leaderboard"} />
                  <NavButton icon={<User />} label="Profile" href={"/dashboard/profile"} />
                </div>
              </div>
            </nav>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
export default Layout;
