import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/Button";
import * as Yup from "yup";

import {
  Flame,
  ShoppingCart,
  Share,
  // MessageCircle,
  // UserPlus,
  // ClipboardList,
  Minimize,
  Maximize,
  BarChart2,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form } from "formik";

// Import your existing action components
import BurnTokenAction from "../campaignActions/BurnTokenAction";
import SellDigitalProductAction from "../campaignActions/SellDigitalProductAction";
import CompressTokenAction from "../campaignActions/CompressTokenAction";
import DecompressTokenAction from "../campaignActions/DecompressTokenAction";
import SubmitTokenUrlAction from "../campaignActions/SubmitUrlAction";
import PollAction from "../campaignActions/CreatePoll";
import { setActionType } from "@/store/slices/statesSlice";

const actions = {
  Onchain: [
    {
      name: "Burn Token",
      value: "Burn-Token",
      icon: <Flame className="text-red-500" />,
      component: BurnTokenAction,
    },
    {
      name: "Compress Token",
      value: "Compress-Token",
      icon: <Minimize className="text-indigo-500" />,
      component: CompressTokenAction,
    },
    {
      name: "Decompress Token",
      value: "Decompress-Token",
      icon: <Maximize className="text-pink-500" />,
      component: DecompressTokenAction,
    },
    {
      name: "Create Poll",
      value: "Poll",
      icon: <BarChart2 className="text-green-500" />,
      component: PollAction,
    },
    {
      name: "Sell Digital Product",
      value: "Sell-Product",
      icon: <ShoppingCart className="text-purple-500" />,
      component: SellDigitalProductAction,
    },
    {
      name: "Submit Url",
      value: "Submit-Url",
      icon: <Share className="text-yellow-400" />,
      component: SubmitTokenUrlAction,
    },
  ],
};

const CampaignTypeAndActions = ({
  campaignType,
  selectedActions,
  toggleAction,
  updateActionData, 
  actionData,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const dispatch = useDispatch();
  const actionType = useSelector((state) => state.generalStates.actionType);

  const handleActionToggle = (action, setFieldValue) => {
    if (selectedActions.includes(action.name)) {
      toggleAction(action.name);
      toast.success(`${action.name} deselected`);
      setFieldValue("selectedActionType", "");
    } else if (selectedActions.length > 0) {
      toast.error("An action is already selected. Please deselect it first.");
    } else {
      toggleAction(action.name);
      toast.success(`${action.name} selected`);
      setFieldValue("selectedActionType", action.value);
      if (campaignType === "Onchain" && action.name !== "Submit Url") {
        openModal(action);
      }
    }
  };

  const openModal = (action) => {
    setCurrentAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentAction(null);
  };

  const handleSave = (data) => {
    console.log("Saving action data:", data);
    updateActionData(currentAction.name, data);
    closeModal();
    toast.success("Action data saved successfully!");
  };

  const initialValues = {
    selectedActionType: actionType?.selectedActionType || "",
  };

  const validationSchema = Yup.object().shape({
    selectedcampaignType: Yup.string().required(
      "Please select an action type."
    ),
  });

  return (
    <>
      <Toaster position="top-right" />
      <Formik initialValues={initialValues} validationSchema={validationSchema}>
        {({ values, setFieldValue }) => (
          <Form className="space-y-6 sm:space-y-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Campaign Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {actions[campaignType].map((action) => (
                  <div
                    key={action.name}
                    onClick={() => handleActionToggle(action, setFieldValue)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedActions.includes(action.name)
                        ? "bg-green-200 hover:bg-green-300"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {action.icon}
                    <span className="mt-2 text-center text-sm sm:text-base">
                      {action.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between my-6">
              <Button
                href="/dashboard/create-campaign?route=detail"
                name={"Previous"}
              />
              <Button
                href="/dashboard/create-campaign?route=reward"
                onClick={() => dispatch(setActionType(values))}
                name={"Continue"}
              />
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Action Modal"
        className="Modal"
        overlayClassName="Overlay"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
          },
        }}
      >
        {currentAction && (
          <div className="p-4">
            {currentAction.component &&
              React.createElement(currentAction.component, {
                onSave: handleSave,
                initialData: actionData[currentAction.name],
              })}

            {/* <Button
              name={"Close"}
              onClick={closeModal}
              shade={"border border-red-600"}
              className={"bg-red-600 border border-red-600 text-white max-w-[100px] mt-4"}
            /> */}
            <Button
              name={"Close"}
              onClick={closeModal}
              shade={"border border-red-600"}
              className={
                "bg-white border border-red-600 text-red-600 max-w-[100px] mt-4"
              }
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default CampaignTypeAndActions;
