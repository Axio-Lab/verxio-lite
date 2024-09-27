import { Button } from "@/components/Button";
import React, { useState, useEffect } from "react";
import { Key, Copy, Trash2, Loader, AlertCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { setUserApiKey } from "@/store/slices/statesSlice";
import { createAPIKey, invalidateAPIKey } from "@/store/slices/apiKeySlice";
import { useDispatch, useSelector } from "react-redux";

const ApiSection = () => {
  const dispatch = useDispatch();
  const [createdDate, setCreatedDate] = useState("");
  const [loadingCreateApi, setLoadingCreateApi] = useState(false);
  const [loadingDeleteApi, setLoadingDeleteApi] = useState(false);
  const userId = useSelector((state) => state.generalStates.userId);
  const [generatedAPIKey, setGeneratedAPIKey] = useState(null);
  const userApiKey = useSelector((state) => state.generalStates.userApiKey);
  const isVerified = useSelector((state) => state.generalStates.userProfile.isVerified);
console.log(useSelector((state) => state.generalStates))

  useEffect(() => {
    if (userApiKey) {
      setGeneratedAPIKey(userApiKey);
      setCreatedDate(new Date().toISOString().split("T")[0]);
    }
  }, [userApiKey]);

  const copyToClipboard = () => {
    if (!generatedAPIKey) {
      toast.error("No API key to copy. Generate one first.");
      return;
    }
    navigator.clipboard.writeText(generatedAPIKey);
    toast.success("API key copied to clipboard!");
  };

  const createNewApiKey = async () => {
    try {
      setLoadingCreateApi(true);
      const response = await dispatch(createAPIKey({ id: userId }));
      if (response.payload.success === true) {
        // console.log(response.payload.message);
        toast.success("ApiKey generated successfully");
        dispatch(setUserApiKey(response.payload.data));
        setGeneratedAPIKey(response.payload.data);
        setCreatedDate(new Date().toISOString().split("T")[0]);
      } else {
        toast.error(response.payload.message);
      }
      setLoadingCreateApi(false);
    } catch (error) {
      console.error(error);
      setLoadingCreateApi(false);
    }
  };

  const invalidateNewApiKey = async () => {
    try {
      setLoadingDeleteApi(true);
      const response = await dispatch(invalidateAPIKey({ id: userId }));
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        setGeneratedAPIKey(null);
        dispatch(setUserApiKey(null));
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to invalidate API key");
    } finally {
      setLoadingDeleteApi(false);
    }
  };

  const NoApiKeyFound = ({ isVerified, handleCreateApiKey, loadingCreateApi }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
      <Key className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No API Key Found
      </h3>
      <p className="text-gray-600 text-center mb-4">
        You haven't generated an API key yet.
      </p>
      {isVerified ? (
        <Button
          onClick={handleCreateApiKey}
          className="py-2 px-4"
          name="Generate API Key"
          isLoading={loadingCreateApi}
        />
      ) : (
        <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Please complete verification with Reclaim Protocol to generate an API key.</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          {!generatedAPIKey ? (
            <NoApiKeyFound
              isVerified={isVerified}
              handleCreateApiKey={createNewApiKey}
              loadingCreateApi={loadingCreateApi}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                {isVerified ? (
                  <Button
                    onClick={createNewApiKey}
                    className="py-3 px-6"
                    name="Generate New API Key"
                    isLoading={loadingCreateApi}
                  />
                ) : (
                  <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p>Please complete verification with Reclaim Protocol to generate a new API key.</p>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Key className="h-6 w-6 text-[#00ADEF] mr-2" />
                    <span className="font-semibold text-[#0D0E32]">
                      Your API Key:
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={copyToClipboard}
                      className="text-[#00ADEF] hover:text-[#41c3f6] mr-2"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={invalidateNewApiKey}
                      className="text-red-600 hover:text-red-800"
                      title="Revoke API key"
                      disabled={loadingDeleteApi}
                    >
                      {loadingDeleteApi ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[#0D0E32] font-mono bg-gray-100 p-2 rounded break-all">
                  {generatedAPIKey}
                </p>
                {createdDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    Created on: {createdDate}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ApiSection;
