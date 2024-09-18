import Button from "../Button";
import React, { useState } from "react";
import { Key, Copy, Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { setUserApiKey } from "@/store/slices/statesSlice";
import { createAPIKey, invalidateAPIKey } from "@/store/slices/apiKeySlice";

import { useDispatch, useSelector } from "react-redux";

const ApiSection = () => {
  const dispatch = useDispatch();
  const [createdDate, setCreatedDate] = useState("");
  const [loadingCreateApi, setLoadingCreateApi] = useState(false);
  const userId = useSelector((state) => state.generalStates.userId);
  const [generatedAPIKey, setGeneratedAPIKey] = useState(
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  );
  const userApiKey = useSelector((state) => state.generalStates.userApiKey);

  const copyToClipboard = () => {
    if (!userApiKey || !generatedAPIKey) {
      toast.message("Generate an Api Key");
      return;
    }
    navigator.clipboard.writeText(userApiKey);
    toast.success("API key copied to clipboard!");
  };

  const createNewApiKey = async () => {
    try {
      setLoadingCreateApi(true);
      const response = await dispatch(createAPIKey({ id: userId }));
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        dispatch(setUserApiKey(response.payload.data));
        setGeneratedAPIKey(response.payload.data);
        setCreatedDate(new Date().toISOString().split("T")[0]);
      } else {
        toast.error(response.payload.message);
      }
      setLoadingCreateApi(false);
    } catch (error) {
      console.error(error);
    }
  };

  const invalidateNewApiKey = async () => {
    try {
      const response = await dispatch(invalidateAPIKey({ id: userId }));
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        setGeneratedAPIKey("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => createNewApiKey()}
              className={"py-3 px-6"}
              name={`Generate New API Key`}
              isLoading={loadingCreateApi}
            />
          </div>
          {generatedAPIKey && (
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
                    onClick={() => invalidateNewApiKey()}
                    className="text-red-600 hover:text-red-800"
                    title="Revoke API key"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-[#0D0E32] font-mono bg-gray-100 p-2 rounded">
                {generatedAPIKey}
              </p>
              {createdDate && (
                <p className="text-sm text-gray-600 mt-2">
                  Created on: {createdDate}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApiSection;
