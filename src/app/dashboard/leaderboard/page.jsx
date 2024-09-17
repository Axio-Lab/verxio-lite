"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import campaignBanner from "@/components/assets/images/campaign_header_null.svg";
import Button from "@/components/Button";
import goldTag from "@/components/assets/images/goldTag.svg";
import silverTag from "@/components/assets/images/silverTag.svg";
import bronzeTag from "@/components/assets/images/bronzeTag.svg";
import {
  // Trophy,
  // Medal,
  // Award,
  ChevronLeft,
  ChevronRight,
  Gift,
  Coins,
  Shield,
} from "lucide-react";

const page = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("xp");
  const [leaderboardType, setLeaderboardType] = useState("global");
  const { publicKey } = useWallet();

  const usersPerPage = 5;

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      // In a real application, replace this with actual API calls
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        address: `User${i + 1}`,
        campaigns: Math.floor(Math.random() * 50) + 1,
        earnings: (Math.random() * 1000).toFixed(2),
        xp: Math.floor(Math.random() * 10000) + 1,
        rewardTypes: [
          { type: "NFT", count: Math.floor(Math.random() * 5) },
          { type: "Token", count: Math.floor(Math.random() * 100) },
          { type: "Badge", count: Math.floor(Math.random() * 10) },
        ],
      }));
      setUsers(mockUsers);
    };

    fetchLeaderboardData();
  }, [leaderboardType, publicKey]);

  const sortedUsers = [...users].sort((a, b) => b[sortBy] - a[sortBy]);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRankIcon = (overallRank) => {
    switch (overallRank) {
      case 1:
        return <Image src={goldTag} height={24} width={24} alt={"trophy"} />;
      case 2:
        return <Image src={silverTag} height={24} width={24} alt={"trophy"} />;
      case 3:
        return <Image src={bronzeTag} height={24} width={24} alt={"trophy"} />;
      default:
        return null;
    }
  };

  const getRowStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-50";
      case 1:
        return "bg-gray-50";
      case 2:
        return "bg-amber-50";
      default:
        return "bg-white";
    }
  };

  const getRewardIcon = (type) => {
    switch (type) {
      case "NFT":
        return <Gift className="w-4 h-4 mr-1 text-[#00ADEF]" />;
      case "Token":
        return <Coins className="w-4 h-4 mr-1 text-yellow-500" />;
      case "Badge":
        return <Shield className="w-4 h-4 mr-1 text-[#00ADEF]" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] rounded-2xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            style={{
              backgroundImage: `url(${campaignBanner.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="p-6 bg-gradient-to-b from-indigo-500 to-purple-600 text-white"
          >
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-gray-300">Top performers in our community</p>
          </div>

          <div className="p-6">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {["xp", "campaigns", "earnings"].map((sort) => (
                <Button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  name={`Sort by ${
                    sort.charAt(0).toUpperCase() + sort.slice(1)
                  }`}
                  shade={"border border-[#00ADEF]"}
                  className={twMerge(
                    `text-sm font-bold transition-all duration-200 border border-[#00ADEF]`,
                    sortBy === sort
                      ? "bg-[#00ADEF] text-white shadow-md"
                      : "bg-[#fff] text-gray-700 hover:bg-[#00ADEF] hover:text-[#fff]"
                  )}
                />
              ))}
            </div>

            {publicKey && (
              <div className="mb-6 flex flex-wrap justify-center gap-3">
                {["global", "participated", "launched"].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setLeaderboardType(type)}
                    name={type.charAt(0).toUpperCase() + type.slice(1)}
                    className={twMerge(
                      `text-sm font-bold transition-all duration-200 border border-[#00ADEF]`,
                      leaderboardType === type
                        ? "bg-[#00ADEF] text-white shadow-md"
                        : "bg-[#fff] text-gray-700 hover:bg-[#00ADEF] hover:text-[#fff]"
                    )}
                  />
                ))}
              </div>
            )}

            <div className="overflow-x-auto my-6 md:my-14">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#0D0E32] uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#0D0E32] uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#0D0E32] uppercase tracking-wider">
                      Campaigns
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#0D0E32] uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#0D0E32] uppercase tracking-wider">
                      XP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#0D0E32] uppercase tracking-wider">
                      Rewards
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user, index) => {
                    const overallRank = indexOfFirstUser + index + 1;
                    return (
                      <motion.tr
                        key={user.address}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`${getRowStyle(
                          index
                        )} transition-all duration-300`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            {overallRank <= 3 ? (
                              getRankIcon(overallRank)
                            ) : (
                              <span className="text-lg font-bold text-gray-600">
                                {overallRank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text[#0D0E32]">
                            {user.campaigns}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#00ADEF]">
                            {user.earnings} SOL
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#0D0E32]">
                            {user.xp}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            {user.rewardTypes.map((reward, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {getRewardIcon(reward.type)}
                                {reward.type}: {reward.count}
                              </span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-[#0D0E32] bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-[#0D0E32]">
                Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastUser >= users.length}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-[#0D0E32] bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
