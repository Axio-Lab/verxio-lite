import React, { useState } from "react";
import { Button } from "@/components/Button";
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
import { useSelector } from "react-redux";

const availableRewards = [
  {
    name: "Whitelist Spot",
    value: "whitelist",
    icon: <Users className="text-blue-500" />,
  },
  {
    name: "NFT Drop",
    value: "nftdrop",
    icon: <ImagePlay className="text-purple-500" />,
  },
  {
    name: "Token",
    value: "token",
    icon: <Coins className="text-yellow-500" />,
  },
  {
    name: "Airdrop",
    value: "airdrop",
    icon: <PlusCircle className="text-green-500" />,
  },
  {
    name: "Merch Drop",
    value: "merchdrop",
    icon: <ShoppingBasket className="text-red-500" />,
  },
  {
    name: "Verxio XP",
    value: "verxioxp",
    icon: <CheckCircle className="text-indigo-500" />,
  },
];

const RewardsAndWinners = () => {
  const rewards = useSelector((state) => state.generalStates.rewards);

  const initialValues = {
    title: rewards?.availableReward || "",
    numberOfWinners: rewards?.localNumWinners || 1,
    winnersCount: rewards?.numWinners || 1,
    solAmount: rewards?.solAmount || 0,
    xpAmount: rewards?.xpAmount || 0,
  };

  const incrementWinners = (setFieldValue, values) => {
    const newValue = values.numberOfWinners + 1;
    setFieldValue("numberOfWinners", newValue);
    setFieldValue("winnersCount", newValue);
  };

  const decrementWinners = (setFieldValue, values) => {
    const newValue = Math.max(1, values.numberOfWinners - 1);
    setFieldValue("numberOfWinners", newValue);
    setFieldValue("winnersCount", newValue);
  };

  const handleWinnersChange = (e, setFieldValue) => {
    const value = parseInt(e.target.value, 10);
    const newValue = isNaN(value) ? 1 : Math.max(1, value);
    setFieldValue("numberOfWinners", newValue);
    setFieldValue("winnersCount", newValue);
  };

  const handleRewardToggle = (rewardValue, setFieldValue) => {
    setFieldValue("title", rewardValue);

    if (rewardValue === "token") {
      setFieldValue("solAmount", 0);
      setFieldValue("xpAmount", 0);
    } else if (rewardValue === "verxioxp") {
      setFieldValue("solAmount", 0);
      setFieldValue("xpAmount", 0);
    } else {
      setFieldValue("solAmount", 0);
      setFieldValue("xpAmount", 0);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-md">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          // Handle form submission here
        }}
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
                    key={reward.value}
                    onClick={() => handleRewardToggle(reward.value, setFieldValue)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      values.title === reward.value
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
                  onClick={() => decrementWinners(setFieldValue, values)}
                  className="bg-gray-100 p-3 rounded-l-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <MinusCircle />
                </button>
                <Field
                  type="number"
                  name="numberOfWinners"
                  value={values.numberOfWinners}
                  onChange={(event) => handleWinnersChange(event, setFieldValue)}
                  className="w-20 text-center p-2 border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => incrementWinners(setFieldValue, values)}
                  className="bg-gray-100 p-3 rounded-r-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <PlusCircle />
                </button>
              </div>
            </div>
            {(values.title === "token" || values.title === "verxioxp") && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Reward Details
                </h3>
                {values.title === "token" && (
                  <div className="mb-4">
                    <label
                      htmlFor="solAmount"
                      className="block mb-2 font-medium text-gray-700"
                    >
                      SOL Amount for Prize Pool:
                    </label>
                    <Field
                      type="number"
                      id="solAmount"
                      name="solAmount"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      The SOL amount will be split equally between{" "}
                      {values.numberOfWinners} winner{values.numberOfWinners > 1 ? "s" : ""}.
                    </p>
                  </div>
                )}
                {values.title === "verxioxp" && (
                  <div className="mb-4">
                    <label
                      htmlFor="xpAmount"
                      className="block mb-2 font-medium text-gray-700"
                    >
                      Verxio XP Amount for Prize Pool:
                    </label>
                    <Field
                      type="number"
                      id="xpAmount"
                      name="xpAmount"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      min="0"
                      step="1"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      The Verxio XP amount will be split equally between{" "}
                      {values.numberOfWinners} winner{values.numberOfWinners > 1 ? "s" : ""}.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between my-6">
              <Button onClick={() => console.log(values)} name={"Previous"} />
              <Button type="submit" name={"Continue"} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RewardsAndWinners;