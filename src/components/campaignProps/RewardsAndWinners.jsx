import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import {
  Users,
  PlusCircle,
  CheckCircle,
  MinusCircle,
  ImagePlay,
  ShoppingBasket,
  Coins,
} from "lucide-react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";

const availableRewards = [
  { name: "Whitelist Spot", icon: <Users className="text-blue-500" /> },
  { name: "NFT Drop", icon: <ImagePlay className="text-purple-500" /> },
  { name: "Token", icon: <Coins className="text-yellow-500" /> },
  { name: "Airdrop", icon: <PlusCircle className="text-green-500" /> },
  { name: "Merch Drop", icon: <ShoppingBasket className="text-red-500" /> },
  { name: "Verxio XP", icon: <CheckCircle className="text-indigo-500" /> },
];

const RewardsAndWinners = ({ selectedRewards, toggleReward }) => {
  // const [localNumWinners, setLocalNumWinners] = useState(numWinners);
  const [solAmount, setSolAmount] = useState("");
  const [xpAmount, setXpAmount] = useState("");
  const rewards = useSelector((state) => state.generalStates.rewards);

  const initialValues = {
    title: rewards?.avaliableReward || "",
    numberOfWinners: rewards?.localNumWinners || 0,
    winnersCount: rewards?.numWinners || 0,
    solAmount: rewards?.solAmount || 0,
    xpAmount: rewards?.xpAmount || 0,
  };

  // useEffect(() => {
  //   setLocalNumWinners(numWinners);
  // }, [numWinners]);

  const incrementWinners = (setFieldValue) => {
    const newValue = values.localNumWinners + 1;
    setFieldValue("localNumWinners", newValue);
    setFieldValue("numWinners", newValue);
  };

  const decrementWinners = (setFieldValue) => {
    const newValue = Math.max(1, values.localNumWinners - 1);
    setFieldValue("localNumWinners", newValue);
    setFieldValue("numWinners", newValue);
  };

  const handleWinnersChange = (e, setFieldValue) => {
    const value = parseInt(e.target.value, 10);
    const newValue = isNaN(value) ? 1 : Math.max(1, value);
    setFieldValue("localNumWinners", newValue);
    setFieldValue("numWinners", newValue);
  };

  const handleRewardToggle = (rewardName) => {
    toggleReward(rewardName);
    if (rewardName === "Token" && !selectedRewards.includes("Token")) {
      setSolAmount("");
    }
    if (rewardName === "Verxio XP" && !selectedRewards.includes("Verxio XP")) {
      setXpAmount("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-md">
      <Formik
        onSubmit={() => {}}
        // validationSchema={validationSchema}
        initialValues={initialValues}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Available Rewards
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableRewards.map((reward) => (
                  <div
                    key={reward.name}
                    onClick={() => handleRewardToggle(reward.name)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedRewards.includes(reward.name)
                        ? "bg-blue-200 shadow-md transform scale-105"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {reward.icon}
                    <span className="ml-2 font-medium">{reward.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Number of Winners
              </h3>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => decrementWinners(setFieldValue)}
                  className="bg-gray-100 p-3 rounded-l-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <MinusCircle />
                </button>
                <Field
                  type="number"
                  value={values.localNumWinners}
                  onChange={(event) =>
                    handleWinnersChange(event, setFieldValue)
                  }
                  className="w-20 text-center p-2 border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => incrementWinners(setFieldValue)}
                  className="bg-gray-100 p-3 rounded-r-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <PlusCircle />
                </button>
              </div>
            </div>
            {(selectedRewards.includes("Token") ||
              selectedRewards.includes("Verxio XP")) && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Reward Details
                </h3>
                {selectedRewards.includes("Token") && (
                  <div className="mb-4">
                    <label
                      htmlFor="solAmount"
                      className="block mb-2 font-medium text-gray-700"
                    >
                      SOL Amount for Prize Pool:
                    </label>
                    <input
                      type="number"
                      id="solAmount"
                      value={solAmount}
                      onChange={(e) => setSolAmount(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      The SOL amount will be split equally between{" "}
                      {localNumWinners} winner{localNumWinners > 1 ? "s" : ""}.
                    </p>
                  </div>
                )}
                {selectedRewards.includes("Verxio XP") && (
                  <div className="mb-4">
                    <label
                      htmlFor="xpAmount"
                      className="block mb-2 font-medium text-gray-700"
                    >
                      Verxio XP Amount for Prize Pool:
                    </label>
                    <input
                      type="number"
                      id="xpAmount"
                      value={xpAmount}
                      onChange={(e) => setXpAmount(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      min="0"
                      step="1"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      The Verxio XP amount will be split equally between{" "}
                      {localNumWinners} winner{localNumWinners > 1 ? "s" : ""}.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between my-6">
              {/* <Button
                href="/dashboard/create-campaign?route=action"
                name={"Prev"}
              />

              <Button
                href="/dashboard/create-campaign?route=preview"
                name={"Next"}
              /> */}

              <Button
                // href="/dashboard/create-campaign?route=action"
                name={"Continue"}
                onClick={() => console.log(values)}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RewardsAndWinners;
