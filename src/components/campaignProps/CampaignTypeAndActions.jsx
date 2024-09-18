import React, { useState } from "react";
import Modal from "react-modal";
import Button  from "@/components/Button";
import {
  Flame,
  ShoppingCart,
  Share,
  MessageCircle,
  UserPlus,
  ClipboardList,
  Minimize,
  Maximize,
  BarChart2,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Import your existing action components
import BurnTokenAction from "../campaignActions/BurnTokenAction";
import SellDigitalProductAction from "../campaignActions/SellDigitalProductAction";
import CompressTokenAction from "../campaignActions/CompressTokenAction";
import DecompressTokenAction from "../campaignActions/DecompressTokenAction";
import PollAction from "../campaignActions/CreatePoll";

const actions = {
  Onchain: [
    {
      name: "Burn Token",
      icon: <Flame className="text-red-500" />,
      component: BurnTokenAction,
    },
    {
      name: "Sell Digital Product",
      icon: <ShoppingCart className="text-purple-500" />,
      component: SellDigitalProductAction,
    },
    {
      name: "Compress Token",
      icon: <Minimize className="text-indigo-500" />,
      component: CompressTokenAction,
    },
    {
      name: "Decompress Token",
      icon: <Maximize className="text-pink-500" />,
      component: DecompressTokenAction,
    },
    {
      name: "Create Poll",
      icon: <BarChart2 className="text-green-500" />,
      component: PollAction,
    }, 
    { name: "Submit Url", icon: <Share className="text-yellow-400" /> },
  ],
};

const CampaignTypeAndActions = ({
  campaignType,
  setCampaignType,
  selectedActions,
  toggleAction,
  updateActionData,
  actionData,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  const handleActionToggle = (action) => {
    if (selectedActions.includes(action.name)) {
      toggleAction(action.name);
      toast.success(`${action.name} deselected`);
    } else if (selectedActions.length > 0) {
      toast.error("An action is already selected. Please deselect it first.");
    } else {
      toggleAction(action.name);
      toast.success(`${action.name} selected`);
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
    updateActionData(currentAction.name, data); // Update this line
    closeModal();
    toast.success("Action data saved successfully!");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Campaign Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {actions[campaignType].map((action) => (
            <div
              key={action.name}
              onClick={() => handleActionToggle(action)}
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                selectedActions.includes(action.name)
                  ? "bg-green-200"
                  : "bg-gray-200"
              }`}
            >
              {action.icon}
              <span className="ml-2">{action.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between my-6">
        <Button onClick={() => console.log(values)} name={"Previous"} />

        <Button onClick={() => console.log(values)} name={"Continue"} />
      </div>

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
            {/* <h2 className="text-2xl font-bold mb-4">{currentAction.name}</h2> */}
            {currentAction.component &&
              React.createElement(currentAction.component, {
                onSave: handleSave,
                initialData: actionData[currentAction.name], // Add this line
              })}
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CampaignTypeAndActions;
