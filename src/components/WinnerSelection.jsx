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
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { CampaignContext } from "@/context/campaignContext";

const WinnerSelection = ({ campaign, onClose, onWinnersSelected }) => {
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const participantsPerPage = 10;
  const { state, getAllWinners } = useContext(CampaignContext);
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
        getAllWinners()
        setLoading(false);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl font-bold text-indigo-700 sm:text-2xl">Select Winners</h2>
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

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={handleRandomSelection}
                className="flex items-center px-3 py-2 text-sm text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600 sm:text-base"
              >
                <RefreshCw size={16} className="mr-2" />
                Randomly Pick Winners
              </button>
            </div>

            <div className="mb-6 space-y-2">
              {currentPageParticipants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center p-2 text-sm rounded-lg bg-gray-50 sm:p-3 sm:text-base"
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
                    className="w-4 h-4 mr-2 sm:mr-3 sm:h-5 sm:w-5"
                  />
                  <label htmlFor={participant.userId} className="flex-grow">
                    <span className="font-mono text-xs sm:text-sm">
                      {participant.userId}
                    </span>
                    {campaign.action?.actionType === "Submit-Url" && (
                      <span className="ml-2 text-xs text-blue-500 sm:text-sm">
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
              <div className="flex items-center justify-center mt-4 space-x-2 sm:mt-8 sm:space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 sm:p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-semibold sm:text-lg">
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

            <div className="flex justify-end mt-6 space-x-4 sm:mt-8">
              <button
                    onClick={onClose}
                    className="px-4 py-2 mr-4 font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-800"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-4 bg-white shadow-xl sm:p-6 rounded-xl">
            <div className="flex items-center mb-4 text-yellow-500">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-bold sm:text-xl">Confirm Selection</h3>
            </div>
            <p className="mb-6 text-sm text-gray-600 sm:text-base">
              Are you sure you want to confirm these {selectedWinners.length} winners? This action cannot be undone.
            </p>
            <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 text-sm text-gray-800 transition duration-300 bg-gray-300 rounded-lg hover:bg-gray-400 sm:text-base"
              >
                Cancel
              </button>
              <Button
                onClick={() => submitForm()}
                name="Confirm"
                className="w-full text-sm sm:w-auto sm:text-base"
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