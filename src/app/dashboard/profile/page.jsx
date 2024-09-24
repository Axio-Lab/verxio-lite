"use client";
import { toast, Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Wallet, Award, BarChart2, LogOut, Bell } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import NotificationSection from "@/components/profileProps/NotificationSection";
import CustomAudiences from "@/components/profileProps/CustomAudiences";
import ApiSection from "@/components/profileProps/ApiKey";
import { createProfile } from "@/store/slices/profileSlice";
import { verifyUser } from "@/store/slices/apiKeySlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, setUserProfile } from "@/store/slices/statesSlice";
import "@solana/wallet-adapter-react-ui/styles.css";
import { VerifyAUser } from "@/components/modals/verifyUser";
import LoadingSpinner from "@/components/componentLoader";
import useMediaQuery from "@/hooks/useMediaQuery";
const NoWalletConnected = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#FBFBFE]">
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-lg w-full">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Wallet Connected
      </h3>
      <p className="text-gray-600 text-center mb-4">
        Please connect your wallet to view your profile and campaigns.
      </p>
      <WalletMultiButton
        style={{
          backgroundColor: "#00ADEF",
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        Connect Wallet
      </WalletMultiButton>
    </div>
  </div>
);

const Page = () => {
  const userProfile = useSelector((state) => state.generalStates.userProfile);
  const { publicKey, disconnect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");
  const [activateVerification, setActivateVerification] = useState(false);
  const [notifications, setNotifications] = useState([
    { message: "Welcome to the Verxio!", read: true },
    { message: "Verify your account to get started", read: false },
    {
      message:
        "Verify your account and particpate to earn upto 500 Verxio XP credits and SOl rewards.",
      read: false,
    },
  ]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const dispatch = useDispatch();
  let userId = "";

  if (publicKey) {
    userId = publicKey?.toString();
  }

  const createNewProfile = async () => {
    try {
      const response = await dispatch(createProfile({ id: userId }));
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        dispatch(setUserId(response.payload.profile._id));
        dispatch(setUserProfile(response.payload.profile));
      } else {
        toast.error(response.payload.message);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const VerifyNewUser = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        verifyUser({ data: { userId: userProfile._id } })
      );
      if (response.payload) {
        setRequestUrl(response.payload.requestUrl);
        setActivateVerification(true);
        setLoading(false);
      } else {
        toast.error(response.payload.message);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
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

  if (!isClient) {
    return null; // or a loading spinner
  }

  if (!publicKey) {
    return <NoWalletConnected />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#FBFBFE] rounded-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
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
              </div>
              <div className="md:flex">
                <div className="md:flex-shrink-0 p-8 bg-[#00ADEF] text-white">
                  {isSmallScreen ? (
                    // verify button on small screens
                    <div className="relative mb-4">
                      <img
                        className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                        src={generateAvatar(publicKey.toBase58())}
                        alt="Profile"
                      />
                      {userProfile.isVerified === true ? (
                        <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md" style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                            Verified
                          </div>
                      ) : (
                        <button
                          onClick={() => VerifyNewUser()}
                          className="absolute -bottom-2 -right-2 bg-[#0D0E32] text-[#dcdded] text-xs font-bold px-2 py-1 rounded-full shadow-md hover:bg-[#00ADEF] hover:border hover:border-gray transition duration-300"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  ) : (
                    // Verify Button on Big screens
                    <div className="relative mb-4">
                      <img
                        className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                        src={generateAvatar(publicKey.toBase58())}
                        alt="Profile"
                      />
                      {userProfile.isVerified === true ? (
                        <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md" style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                          Verified
                        </div>
                      ) : (
                        <button
                          onClick={() => VerifyNewUser()}
                          className="absolute -bottom-2 -right-2 bg-[#0D0E32] text-[#dcdded] text-xs font-bold px-2 py-1 rounded-full shadow-md hover:bg-[#00ADEF] hover:border hover:border-gray transition duration-300"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-center mb-2">
                    {`${publicKey.toBase58().slice(0, 6)}...${publicKey
                      .toBase58()
                      .slice(-4)}`}
                  </h1>
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
                      value={`${userProfile?.campaigns?? 0}`}
                      unit="Participated"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NotificationSection
            notifications={notifications}
            clearAllNotifications={clearAllNotifications}
          />

          <ApiSection />

          <CustomAudiences />
        </div>
      </div>
      {activateVerification && (
        <VerifyAUser
          requestUrl={requestUrl}
          closeModal={setActivateVerification}
        />
      )}
      {loading && <LoadingSpinner />}
    </>
  );
};

const StatCard = ({ icon: Icon, title, value, unit }) => (
  <div className="bg-white rounded-xl p-6 flex items-center shadow-sm transition duration-300 transform hover:-translate-y-1">
    <Icon className="h-12 w-12 text-[#00ADEF] mr-4" />
    <div>
      <h2 className="text-lg font-semibold text-[#0D0E32]">{title}</h2>
      <p className="text-2xl font-bold text-[#0D0E32]">
        {value} <span className="text-sm text-[#0D0E32]">{unit}</span>
      </p>
    </div>
  </div>
);
export default Page;
