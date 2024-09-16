"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Wallet, Award, BarChart2, LogOut, Bell } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import NotificationSection from "@/components/profileProps/NotificationSection";
import CustomAudiences from "@/components/profileProps/CustomAudiences";
import ApiSection from "@/components/profileProps/ApiKey";
import { createProfile } from "@/store/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, setUserProfile } from "@/store/slices/statesSlice";
import "@solana/wallet-adapter-react-ui/styles.css";

const page = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { publicKey, disconnect } = useWallet();
  const [notifications, setNotifications] = useState([
    { message: "Welcome to the platform!", read: false },
    { message: "New feature available: Custom Audiences", read: true },
    { message: "New feature available: Custom Audiences", read: true },
    { message: "New feature available: Custom Audiences", read: false },
    { message: "New feature available: Custom Audiences", read: true },
    { message: "New feature available: Custom Audiences", read: false },
    { message: "New feature available: Custom Audiences", read: true },
    // Add more notifications as needed
  ]);

  const dispatch = useDispatch();
  let userId = "";

  if (publicKey) {
    userId = publicKey?.toString();
  }

  const userProfile = useSelector((state) => state.generalStates.userProfile);

  const createNewProfile = async () => {
    if (!userId) {
      toast.error("Please connect your wallet!");
      console.log("User id does not exists");
      return;
    }
    try {
      const response = await dispatch(createProfile({ id: userId }));
      console.log(response, "response");
      console.log(userId, "user Id from response!!!");
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        dispatch(setUserId(response.payload.profile.profile._id));
        dispatch(setUserProfile(response.payload.profile));
        console.log(response);
      } else {
        // toast.error(response.payload.message);
        //
        const message =
          response?.payload?.message ||
          "An error occurred while creating the profile";
        toast.error(message);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (userId) {
      createNewProfile();
    }
  }, [userId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateAvatar = (address) => {
    return `https://api.dicebear.com/9.x/micah/svg?seed=${
      address || "placeholder"
    }.svg`;
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] rounded-2xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="relative">
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
              {isClient &&
                (publicKey ? (
                  <button
                    onClick={disconnect}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    <LogOut className="mr-2" size={18} />
                    Logout
                  </button>
                ) : (
                  <WalletMultiButton
                    style={{
                      backgroundColor: "#00ADEF",
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: "16px",
                      fontWeight: "500",
                      "&:hover": {
                        backgroundColor: "#02a1df",
                      },
                    }}
                  >
                    Connect Wallet
                  </WalletMultiButton>
                ))}
            </div>
            <div className="md:flex">
              <div className="md:flex-shrink-0 p-8 bg-[#00ADEF] text-white">
                <div className="relative mb-4">
                  <img
                    className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                    src={generateAvatar(publicKey?.toBase58())}
                    alt="Profile"
                  />
                  {isVerified ? (
                    <div className="absolute -bottom-2 -right-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      Verified
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsVerified(true)}
                      className="absolute -bottom-2 -right-2 bg-[#0D0E32] text-[#dcdded] text-xs font-bold px-2 py-1 rounded-full shadow-md hover:bg-[#00ADEF]  hover:border hover:border-gray transition duration-300"
                    >
                      Verify
                    </button>
                  )}
                </div>
                {publicKey && (
                  <h1 className="text-2xl font-bold text-center mb-2">
                    {`${publicKey.toBase58().slice(0, 6)}...${publicKey
                      .toBase58()
                      .slice(-4)}`}
                  </h1>
                )}
              </div>
              <div className="p-8 md:flex-grow bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                  <StatCard
                    icon={Wallet}
                    title="Earnings"
                    value={`${userProfile?.sol ?? 0}`}
                    unit="SOL"
                  />
                  <StatCard
                    icon={Award}
                    title="Verxio XP"
                    value={`${userProfile?.xp ?? 0}`}
                    unit="XP"
                  />
                  <StatCard
                    icon={BarChart2}
                    title="Campaigns"
                    value="42"
                    unit="Participated"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Section */}
        <NotificationSection
          notifications={notifications}
          clearAllNotifications={clearAllNotifications}
        />

        {/* API Section */}
        <ApiSection />

        {/* Custom Audiences Section */}
        <CustomAudiences />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, unit }) => (
  <div className="bg-white rounded-xl p-6 flex items-center shadow-sm transition duration-300 transform hover:-translate-y-1">
    <Icon className="h-12 w-12 text-[#00ADEF] mr-4" />
    <div>
      <h2 className="text-lg font-semibold text[#0D0E32]">{title}</h2>
      <p className="text-2xl font-bold text[#0D0E32] ">
        {value} <span className="text-sm text[#0D0E32]">{unit}</span>
      </p>
    </div>
  </div>
);

export default page;
