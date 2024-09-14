import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkdownIt from "markdown-it";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import CampaignDetails from "../components/campaignProps/CampaignDetails";
import RewardsAndWinners from "../components/campaignProps/RewardsAndWinners";
import CampaignPreview from "../components/campaignProps/CampaignPreview";
import CampaignTypeAndActions from "../components/campaignProps/CampaignTypeAndActions";

const mdParser = new MarkdownIt();

const CreateCampaign = () => {
  const details = useSelector((state) => state.generalStates.details);

  const [step, setStep] = useState(1);

  const initialValues = {
    title: details?.title || "",
    type: details?.type || "",
    description:
      details?.description ||
      "# New Campaign\n\nDescribe your campaign here...",
    selectedActions: [],
    selectedRewards: [],
    numWinners: 1,
    actionData: {},
    startDate: new Date().toISOString().split("T")[0], // Set default to today
    endDate: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0], // Set default to 30 days from today
  };

  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);

  const updateCampaignData = (field, value) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAction = (action) => {
    setCampaignData((prev) => ({
      ...prev,
      selectedActions: prev.selectedActions.includes(action)
        ? prev.selectedActions.filter((a) => a !== action)
        : [...prev.selectedActions, action],
    }));
  };

  const toggleReward = (reward) => {
    setCampaignData((prev) => ({
      ...prev,
      selectedRewards: prev.selectedRewards.includes(reward)
        ? prev.selectedRewards.filter((r) => r !== reward)
        : [...prev.selectedRewards, reward],
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const setNumWinners = (value) => {
    setCampaignData((prev) => ({ ...prev, numWinners: value }));
  };

  const updateActionData = (actionName, data) => {
    setCampaignData((prev) => ({
      ...prev,
      actionData: {
        ...prev.actionData,
        [actionName]: data,
      },
    }));
  };

  const renderedDescription = useMemo(
    () => mdParser.render(campaignData.description),
    [campaignData.description]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Campaign name is required"),
    startDate: Yup.date().required("Start date is required").nullable(),
    endDate: Yup.date().required("End date is required").nullable(),
  });

  const renderStepContent = (formik) => {
    switch (step) {
      case 1:
        return (
          <CampaignDetails
            campaignTitle={formik.values.name}
            setCampaignName={formik.handleChange}
            description={formik.values.description}
            setDescription={(description) =>
              formik.setFieldValue("description", description)
            }
            showDescriptionPreview={formik.values.showDescriptionPreview}
            setShowDescriptionPreview={(value) =>
              formik.setFieldValue("showDescriptionPreview", value)
            }
            renderedDescription={mdParser.render(formik.values.description)}
            mdParser={mdParser}
            startDate={formik.values.startDate}
            setStartDate={(date) => formik.setFieldValue("startDate", date)}
            endDate={formik.values.endDate}
            setEndDate={(date) => formik.setFieldValue("endDate", date)}
          />
        );
      case 2:
        return (
          <CampaignTypeAndActions
            campaignType={formik.values.type}
            setCampaignType={formik.handleChange}
            selectedActions={formik.values.selectedActions}
            toggleAction={(action) =>
              formik.setFieldValue(
                "selectedActions",
                toggleArrayItem(formik.values.selectedActions, action)
              )
            }
            updateActionData={(actionName, data) =>
              formik.setFieldValue("actionData", {
                ...formik.values.actionData,
                [actionName]: data,
              })
            }
            actionData={formik.values.actionData}
          />
        );
      case 3:
        return (
          <RewardsAndWinners
            selectedRewards={formik.values.selectedRewards}
            toggleReward={(reward) =>
              formik.setFieldValue(
                "selectedRewards",
                toggleArrayItem(formik.values.selectedRewards, reward)
              )
            }
            numWinners={formik.values.numWinners}
            setNumWinners={(numWinners) =>
              formik.setFieldValue("numWinners", numWinners)
            }
          />
        );
      case 4:
        return (
          <CampaignPreview
            campaignData={formik.values}
            renderedDescription={mdParser.render(formik.values.description)}
          />
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const steps = ["Details", "Type & Actions", "Rewards", "Preview"];
    return (
      <div className="px-2 mb-8">
        <div className="relative flex justify-between">
          {steps.map((stepName, index) => (
            <div key={stepName} className="flex flex-col items-center w-1/4">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 z-10 ${
                  step > index + 1
                    ? "bg-indigo-600 text-white"
                    : step === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step > index + 1 ? (
                  <Check size={12} />
                ) : (
                  <span className="text-[10px]">{index + 1}</span>
                )}
              </div>
              <div
                className={`text-[10px] text-center ${
                  step >= index + 1
                    ? "text-indigo-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {stepName}
              </div>
            </div>
          ))}
          <div className="absolute top-[9px] left-0 w-full h-0.5 bg-gray-300">
            <div
              className="h-full transition-all duration-300 ease-in-out bg-indigo-600"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-100 to-purple-100 sm:p-8">
      <div className="max-w-4xl p-4 mx-auto bg-white shadow-2xl rounded-xl sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-center text-indigo-900 sm:text-3xl">
          Create Your Campaign
        </h2>
        {renderProgressBar()}
        <Formik
          onSubmit={() => {}}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-8">
              <div className="mb-8">{renderStepContent()}</div>
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 text-white transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <ChevronLeft size={20} className="mr-2" />
                    Previous
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 ml-auto text-white transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Next
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 ml-auto text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Create Campaign
                    <Check size={20} className="ml-2" />
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateCampaign;
