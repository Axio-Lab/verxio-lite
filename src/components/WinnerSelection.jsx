import axios from "axios";
import { Button } from "./Button";
import LoadingSpinner from "./componentLoader";
import React, { useState, useMemo, useContext } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">Select Winners</h2>
            </div>
            <p className="mb-4 text-sm sm:text-base">
              Total winners required:{" "}
              <span className="font-semibold">
                {campaign?.rewardInfo?.noOfPeople}
              </span>{" "}
              | Selected Winners:{" "}
              <span className="font-semibold text-green-600">
                {selectedWinners.length}
              </span>
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={handleRandomSelection}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
              >
                <RefreshCw size={16} className="mr-2" />
                Randomly Pick Winners
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {currentPageParticipants.map((participant) => (
                <div
                  key={participant.userId}
                  className="bg-gray-50 p-2 sm:p-3 rounded-lg flex items-center text-sm sm:text-base"
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
                    className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <label htmlFor={participant.userId} className="flex-grow">
                    <span className="font-mono text-xs sm:text-sm">
                      {participant.userId}
                    </span>
                    {campaign.action?.actionType === "Submit-Url" && (
                      <span className="ml-2 text-blue-500 text-xs sm:text-sm">
                        ({participant.submission})
                        <a
                          href={participant.submission}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 sm:ml-2"
                        >
                          <ExternalLink size={12} className="sm:size-16" />
                        </a>
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {participants.length > participantsPerPage && (
              <div className="flex justify-center items-center mt-4 sm:mt-8 space-x-2 sm:space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 sm:p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm sm:text-lg font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 sm:p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div className="mt-6 sm:mt-8 flex justify-end space-x-4">
              <button
                    onClick={onClose}
                    className="mr-4 px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
              <Button
                    name="Confirm Winners"
                    onClick={handleConfirmClick}
                    disabled={isConfirmDisabled}
                    className={`${
                      isConfirmDisabled
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white px-4 py-2 rounded-lg transition duration-300 text-sm sm:text-base`}
                  />
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4 text-yellow-500">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg sm:text-xl font-bold">Confirm Selection</h3>
            </div>
            <p className="mb-6 text-gray-600 text-sm sm:text-base">
              Are you sure you want to confirm these {selectedWinners.length} winners? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleConfirmation(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <Button
                onClick={() => submitForm()}
                name="Confirm"
                className="w-full sm:w-auto text-sm sm:text-base"
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WinnerSelection;