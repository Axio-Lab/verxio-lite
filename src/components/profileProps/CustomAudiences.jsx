import React, { useState, useRef, useMemo } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import {Button} from "@/components/Button";

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
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
      <Users className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Audiences Found</h3>
      <p className="text-gray-600 text-center mb-4">You haven't created or imported any custom audience yet.</p>
    </div>
  );

  const totalPages = Math.ceil(customAudiences.length / audiencesPerPage);

  const currentAudiences = useMemo(() => {
    const indexOfLastAudience = currentPage * audiencesPerPage;
    const indexOfFirstAudience = indexOfLastAudience - audiencesPerPage;
    return customAudiences.slice(indexOfFirstAudience, indexOfLastAudience);
  }, [customAudiences, currentPage]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0D0E32]">Custom Audiences</h2>
        <Button
          name="Import Audience"
          className="py-3 px-6"
          onClick={handleImportClick}
        />
      </div>
      {isImporting && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="mb-2">Select a CSV file to import:</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={handleUpload}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
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
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <Users className="text-[#00ADEF] mr-3" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg text-[#0D0E32]">
                      {audience.name}
                    </h3>
                    <p className="text-gray-600">{audience.count} participants</p>
                  </div>
                </div>
                <Button
                  outline
                  name="Export CSV"
                  style={{ backgroundColor: "white" }}
                  onClick={() => exportAudienceAsCSV(audience.id)}
                />
              </div>
            ))}
            {customAudiences.length > audiencesPerPage && (
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
        )}
      </div>
    </div>
  );
};

export default CustomAudiences;