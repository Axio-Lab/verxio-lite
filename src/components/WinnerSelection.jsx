import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Download, ExternalLink, AlertTriangle } from 'lucide-react';

const generateRandomAddress = () => '0x' + Array(40).fill(0).map(() => Math.random().toString(16)[2]).join('');

const generateRandomParticipants = (count, includeUrl) => {
  return Array(count).fill(0).map(() => ({
    address: generateRandomAddress(),
    ...(includeUrl && { url: `https://example.com/${Math.random().toString(36).substring(7)}` })
  }));
};

const WinnerSelection = ({ campaign, onClose, onWinnersSelected }) => {
  const [participants, setParticipants] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const participantsPerPage = 10;

  useEffect(() => {
    const randomParticipants = generateRandomParticipants(100, campaign.action === 'Submit Url');
    setParticipants(randomParticipants);
  }, [campaign.action]);

  const totalPages = Math.ceil(participants.length / participantsPerPage);

  const currentPageParticipants = useMemo(() => {
    const indexOfLastParticipant = currentPage * participantsPerPage;
    const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
    return participants.slice(indexOfFirstParticipant, indexOfLastParticipant);
  }, [participants, currentPage]);

  const toggleWinner = (address) => {
    setSelectedWinners(prev =>
      prev.includes(address)
        ? prev.filter(winner => winner !== address)
        : prev.length < campaign.winners
          ? [...prev, address]
          : prev
    );
  };

  const randomlyPickWinners = () => {
    const remainingWinners = campaign.winners - selectedWinners.length;
    if (remainingWinners <= 0) return;

    const availableParticipants = participants.filter(p => !selectedWinners.includes(p.address));
    const shuffled = availableParticipants.sort(() => 0.5 - Math.random());
    const newWinners = shuffled.slice(0, remainingWinners).map(p => p.address);

    setSelectedWinners(prev => [...prev, ...newWinners]);
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

  const isConfirmDisabled = selectedWinners.length !== campaign.winners;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Select Winners</h2>
        <p className="mb-4 text-lg">
          Total winners required: <span className="font-semibold">{campaign.winners}</span> | 
          Selected: <span className="font-semibold text-green-600">{selectedWinners.length}</span>
        </p>
        
        <div className="mb-6 flex space-x-4">
          <button
            onClick={randomlyPickWinners}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
          >
            <RefreshCw size={20} className="mr-2" />
            Randomly Pick Winners
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {currentPageParticipants.map(participant => (
            <div key={participant.address} className="bg-gray-50 p-3 rounded-lg flex items-center">
              <input
                type="checkbox"
                id={participant.address}
                checked={selectedWinners.includes(participant.address)}
                onChange={() => toggleWinner(participant.address)}
                disabled={!selectedWinners.includes(participant.address) && selectedWinners.length >= campaign.winners}
                className="mr-3 h-5 w-5"
              />
              <label htmlFor={participant.address} className="flex-grow">
                <span className="font-mono text-sm">{participant.address}</span>
                {campaign.action === 'Submit Url' && (
                  <span className="ml-2 text-blue-500 text-sm">
                    ({participant.url})
                    <a href={participant.url} target="_blank" rel="noopener noreferrer" className="ml-2">
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
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
                Are you sure you want to confirm these {selectedWinners.length} winners? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleConfirmation(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmation(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerSelection;
