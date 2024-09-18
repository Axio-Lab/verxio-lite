import React, { useState, useRef, useMemo } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/Button";

const CustomAudiences = () => {
  const [customAudiences, setCustomAudiences] = useState([    
    { id: 1, name: "Summer Swap Participants", count: 1234 },
    { id: 2, name: "NFT Collectors", count: 567 },
    { id: 3, name: "DeFi Enthusiasts", count: 890 },
    { id: 4, name: "Crypto Traders", count: 2345 },
    { id: 5, name: "Metaverse Explorers", count: 678 },
    { id: 6, name: "Token Holders", count: 1567 },
    { id: 7, name: "Blockchain Developers", count: 456 },
  ]);

  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const audiencesPerPage = 5;

  const exportAudienceAsCSV = (audienceId) => {
    console.log(`Exporting audience ${audienceId} as CSV`);
  };

  const handleImportClick = () => {
    setIsImporting(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Importing file: ${file.name}`);
      const newImportedAudience = { id: Date.now(), name: file.name.replace('.csv', ''), count: Math.floor(Math.random() * 1000) + 1 };
      setCustomAudiences([...customAudiences, newImportedAudience]);
    }
    setIsImporting(false);
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const NoAudiencesFound = () => (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-gray-50 rounded-lg">
      <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Audiences Found</h3>
      <p className="text-gray-600 text-center text-sm sm:text-base">You haven't created or imported any custom audience yet.</p>
    </div>
  );

  const totalPages = Math.ceil(customAudiences.length / audiencesPerPage);

  const currentAudiences = useMemo(() => {
    const indexOfLastAudience = currentPage * audiencesPerPage;
    const indexOfFirstAudience = indexOfLastAudience - audiencesPerPage;
    return customAudiences.slice(indexOfFirstAudience, indexOfLastAudience);
  }, [customAudiences, currentPage]);

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0D0E32]">Custom Audiences</h2>
        <Button
          name="Import Audience"
          className="w-full sm:w-auto py-2 px-4 text-sm sm:text-base"
          onClick={handleImportClick}
        />
      </div>
      {isImporting && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="mb-2 text-sm sm:text-base">Select a CSV file to import:</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={handleUpload}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
          >
            Upload CSV
          </button>
        </div>
      )}
      <div className="space-y-4">
        {customAudiences.length === 0 ? (
          <NoAudiencesFound />
        ) : (
          <>
            {currentAudiences.map((audience) => (
              <div
                key={audience.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg space-y-3 sm:space-y-0"
              >
                <div className="flex items-center">
                  <Users className="text-[#00ADEF] mr-3" size={24} />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-[#0D0E32]">
                      {audience.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{audience.count} participants</p>
                  </div>
                </div>
                <Button
                  outline
                  name="Export CSV"
                  className="w-full sm:w-auto py-1 px-3 text-sm"
                  style={{ backgroundColor: "white" }}
                  onClick={() => exportAudienceAsCSV(audience.id)}
                />
              </div>
            ))}
            {customAudiences.length > audiencesPerPage && (
              <div className="flex justify-center items-center mt-6 space-x-2 sm:space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 sm:p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm sm:text-base font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 sm:p-2 rounded-full bg-[#00ADEF] text-white disabled:bg-gray-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomAudiences;