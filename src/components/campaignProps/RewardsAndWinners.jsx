// import React, { useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
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
import { setRewards } from "@/store/slices/statesSlice";

const availableRewards = [
  {
    name: "Whitelist Spot",
    value: "Whitelist-Spot",
    icon: <Users className="text-blue-500" />,
  },
  {
    name: "NFT Drop",
    value: "NFT-Drop",
    icon: <ImagePlay className="text-purple-500" />,
  },
  {
    name: "Token",
    value: "Token",
    icon: <Coins className="text-yellow-500" />,
  },
  {
    name: "Airdrop",
    value: "Airdrop",
    icon: <PlusCircle className="text-green-500" />,
  },
  {
    name: "Merch Drop",
    value: "Merch-Drop",
    icon: <ShoppingBasket className="text-red-500" />,
  },
  {
    name: "Verxio XP",
    value: "Verxio-XP",
    icon: <CheckCircle className="text-indigo-500" />,
  },
];

const RewardsAndWinners = () => {
  const dispatch = useDispatch();
  const rewards = useSelector((state) => state.generalStates.rewards);

  const initialValues = {
    selectedReward: rewards?.selectedReward || "",
    numberOfWinners: rewards?.numberOfWinners || 1,
    solAmount: rewards?.solAmount || "",
    xpAmount: rewards?.xpAmount || 0,
  };

  const validationSchema = Yup.object().shape({
    selectedReward: Yup.string().required("Please select a reward type."),
    numberOfWinners: Yup.number()
      .min(1, "Number of winners must be at least 1.")
      .required("Please enter the number of winners."),
    solAmount: Yup.number()
      .typeError("Must be a number")
      .min(0, "SOL amount must be non-negative.")
      .test('is-decimal', 'Invalid decimal', value =>
        value === undefined || value === '' || (value + "").match(/^\d*\.?\d{0,9}$/)
      ),
    xpAmount: Yup.number()
      .min(0, "XP amount must be non-negative.")
      .integer("XP amount must be an integer."),
  });

  const handleRewardToggle = (rewardValue, setFieldValue) => {
    setFieldValue("selectedReward", rewardValue);

    if (rewardValue === "Token") {
      setFieldValue("solAmount", 0);
    } else if (rewardValue === "Verxio-XP") {
      setFieldValue("xpAmount", 0);
    }
  };

  const incrementWinners = (setFieldValue, values) => {
    const newWinners = values.numberOfWinners + 1;
    setFieldValue("numberOfWinners", newWinners);
  };

  const decrementWinners = (setFieldValue, values) => {
    const newWinners = Math.max(1, values.numberOfWinners - 1);
    setFieldValue("numberOfWinners", newWinners);
  };

  const handleWinnersChange = (event, setFieldValue) => {
    const { value } = event.target;
    const newValue = Math.max(1, Number(value));
    setFieldValue("numberOfWinners", newValue);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const processedValues = {
            ...values,
            solAmount: values.solAmount ? parseFloat(values.solAmount) : 0,
          };
          console.log('Form submitted with values:', processedValues);
          dispatch(setRewards(processedValues));
        }}
      >
        {({ values, errors, touched, setFieldValue, isValid }) => (
          <Form className="space-y-6 sm:space-y-8">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Available Rewards
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {availableRewards.map((reward) => (
                  <div
                    key={reward.value}
                    onClick={() =>
                      handleRewardToggle(reward.value, setFieldValue)
                    }
                    className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      values.selectedReward === reward.value
                        ? "bg-blue-200 shadow-md transform scale-105"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {reward.icon}
                    <span className="ml-2 font-medium text-sm sm:text-base">
                      {reward.name}
                    </span>
                  </div>
                ))}
              </div>
              {errors.selectedReward && touched.selectedReward ? (
                <div className="text-sm text-red-500 text-normal">
                  {errors.selectedReward}
                </div>
              ) : null}
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Number of Winners
              </h3>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => decrementWinners(setFieldValue, values)}
                  className="bg-gray-100 p-2 sm:p-3 rounded-l-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <MinusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <Field
                  type="number"
                  name="numberOfWinners"
                  value={values.numberOfWinners}
                  onChange={(event) =>
                    handleWinnersChange(event, setFieldValue)
                  }
                  className="w-16 sm:w-20 text-center p-2 border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => incrementWinners(setFieldValue, values)}
                  className="bg-gray-100 p-2 sm:p-3 rounded-r-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {errors.numberOfWinners && touched.numberOfWinners ? (
                <div className="text-sm text-red-500 text-normal">
                  {errors.numberOfWinners}
                </div>
              ) : null}
            </div>
            {values.selectedReward === "Token" && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Reward Details
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="solAmount"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Total SOL Amount to be Shared:
                  </label>
                  <Field
                    type="text"
                    id="solAmount"
                    name="solAmount"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter total SOL amount"
                  />
                  {errors.solAmount && touched.solAmount && (
                    <div className="text-sm text-red-500 mt-1">
                      {errors.solAmount}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    The total SOL amount of {values.solAmount || 0} will be split equally between{" "}
                    {values.numberOfWinners} winner{values.numberOfWinners > 1 ? "s" : ""}.
                  </p>
                  {values.solAmount && values.numberOfWinners > 0 && (
                    <p className="text-sm font-semibold text-blue-600 mt-2">
                      Each winner will receive approximately {(parseFloat(values.solAmount) / values.numberOfWinners).toFixed(1)} SOL.
                    </p>
                  )}
                </div>
              </div>
            )}
            {values.selectedReward === "Verxio-XP" && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Reward Details
                </h3>
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
                    placeholder="Enter Verxio XP"
                  />
                  {errors.xpAmount && touched.xpAmount && (
                    <div className="text-sm text-red-500 mt-1">
                      {errors.xpAmount}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    The Verxio XP amount will be split equally between{" "}
                    {values.numberOfWinners} winner
                    {values.numberOfWinners > 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <Button
                name={"Previous"}
                className="w-[48%]"
                href="/dashboard/create-campaign?route=action"
              />
              <Button
                type="submit"
                name={"Continue"}
                href="/dashboard/create-campaign?route=preview"
                onClick={() => {
                  const processedValues = {
                    ...values,
                    solAmount: values.solAmount ? parseFloat(values.solAmount) : 0,
                  };
                  console.log('Continue button clicked. Current values:', processedValues);
                  dispatch(setRewards(processedValues));
                }}
                className="w-[48%]"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RewardsAndWinners;