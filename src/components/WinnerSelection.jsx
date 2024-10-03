import axios from "axios";
import { Button } from "./Button";
import LoadingSpinner from "./componentLoader";
import React, { useState, useMemo, useContext } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  // Download,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CampaignContext } from "@/context/campaignContext";

const WinnerSelection = ({ campaign, onClose, onWinnersSelected }) => {
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const participantsPerPage = 10;
  const { state } = useContext(CampaignContext);
  const participants = state.campaignParticipants;
  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
  const userApiKey = useSelector(
    (state) => state.generalStates.userProfile.key
  );
  const [loading, setLoading] = useState(false);

  const headers = {
    "X-API-Key": userApiKey,
    "Content-Type": "application/json",
  };

  const totalPages = Math.ceil(participants.length / participantsPerPage);

  const currentPageParticipants = useMemo(() => {
    const indexOfLastParticipant = currentPage * participantsPerPage;
    const indexOfFirstParticipant =
      indexOfLastParticipant - participantsPerPage;
    return participants.slice(indexOfFirstParticipant, indexOfLastParticipant);
  }, [participants, currentPage]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleRandomSelection = () => {
    const shuffledUsers = shuffleArray([...participants]);
    const randomizedUsers = shuffledUsers
      .slice(0, campaign.rewardInfo.noOfPeople)
      .map((user) => user.userId);

    setSelectedWinners(randomizedUsers);
  };

  const handleSelectWinners = (userId) => {
    setSelectedWinners((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleConfirmClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      onWinnersSelected(selectedWinners);
      onClose();
    } else {
      setShowConfirmation(false);
    }
  };

  const isConfirmDisabled =
    selectedWinners.length < campaign.rewardInfo.noOfPeople;

  const handleSubmitWinners = async (formData, campaignId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${apiBaseURL}/winner/${campaignId}`,
        formData,
        { headers }
      );
      console.log(response);
      if (response.data.success === true) {
        setSelectedWinners([]);
        toast.success("Winner Selection successful");
      } else {
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error selecting winners:", error);
      toast.error(error.message);
    }
  };

  const submitForm = () => {
    if (
      selectedWinners.length === 0 ||
      selectedWinners > campaign.rewardInfo.noOfPeople
    ) {
      toast.error(`Please select ${campaign.rewardInfo.noOfPeople} winners`);
      return;
    }
    const newDetails = {
      winners: selectedWinners,
    };

    handleSubmitWinners(newDetails, campaign?.id);
  };
  return (
    <>
      {state?.loading && <LoadingSpinner />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">
            Select Winners
          </h2>
          <p className="mb-4 text-lg">
            Total winners required:{" "}
            <span className="font-semibold">
              {campaign?.rewardInfo?.noOfPeople}
            </span>{" "}
            | Selected Winners:{" "}
            <span className="font-semibold text-green-600">
              {selectedWinners.length}
            </span>
          </p>

          <div className="mb-6 flex space-x-4">
            <button
              onClick={handleRandomSelection}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
            >
              <RefreshCw size={20} className="mr-2" />
              Randomly Pick Winners
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {currentPageParticipants.map((participant) => (
              <div
                key={participant.userId}
                className="bg-gray-50 p-3 rounded-lg flex items-center"
              >
                <input
                  type="checkbox"
                  id={participant.userId}
                  checked={selectedWinners.includes(participant.userId)}
                  onChange={() => handleSelectWinners(participant.userId)}
                  disabled={
                    !selectedWinners.includes(participant.userId) &&
                    selectedWinners.length >= campaign.rewardInfo.noOfPeople
                  }
                  className="mr-3 h-5 w-5"
                />
                <label htmlFor={participant.userId} className="flex-grow">
                  <span className="font-mono text-sm">
                    {participant.userId}
                  </span>
                  {campaign.action?.actionType === "Submit-Url" && (
                    <span className="ml-2 text-blue-500 text-sm">
                      ({participant.submission})
                      <a
                        href={participant.submission}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>

          {participants.length > participantsPerPage && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClick}
              disabled={isConfirmDisabled}
              className={`${
                isConfirmDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white px-6 py-2 rounded-lg transition duration-300`}
            >
              Confirm Winners
            </button>
          </div>

          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-xl max-w-md w-full">
                <div className="flex items-center mb-4 text-yellow-500">
                  <AlertTriangle size={24} className="mr-2" />
                  <h3 className="text-xl font-bold">Confirm Selection</h3>
                </div>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to confirm these{" "}
                  {selectedWinners.length} winners? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleConfirmation(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                  {/* <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"></button> */}

                  <Button
                    onClick={() => submitForm()}
                    name="Confirm"
                    className="w-full"
                    isLoading={loading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WinnerSelection;
