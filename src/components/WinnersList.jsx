import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import WinnerAvatar from './WinnerAvatar';

const WinnersList = ({ winners, campaign }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const winnersPerPage = 50;

  const totalPages = Math.ceil(winners.length / winnersPerPage);

  const currentPageWinners = useMemo(() => {
    const indexOfLastWinner = currentPage * winnersPerPage;
    const indexOfFirstWinner = indexOfLastWinner - winnersPerPage;
    return winners.slice(indexOfFirstWinner, indexOfLastWinner);
  }, [winners, currentPage]);

  const exportWinners = () => {
    const winnerData = winners.join('\n');
    const blob = new Blob([winnerData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'winners.csv';
    a.click();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Campaign Winners</h2>
      {winners.length > 0 ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-lg">Total winners 🏆: <span className="font-semibold">{winners.length}</span></p>
            <button
              onClick={exportWinners}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-300"
            >
              <Download size={20} className="mr-2" />
              Export Winners
            </button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-4 mb-6">
            {currentPageWinners.map(address => (
              <WinnerAvatar key={address} address={address} />
            ))}
          </div>

          {winners.length > winnersPerPage && (
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
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No winners selected yet
        </div>
      )}
    </div>
  );
};

export default WinnersList;
