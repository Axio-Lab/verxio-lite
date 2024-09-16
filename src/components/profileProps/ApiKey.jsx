import React, { useState } from "react";
import { Key, Copy, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../button";
import { createAPIKey, invalidateAPIKey } from "@/store/slices/apiKeySlice";
import { useDispatch, useSelector } from "react-redux";


const ApiSection = () => {
  const [generatedAPIKey, setGeneratedAPIKey] = useState("");
  const [createdDate, setCreatedDate] = useState("2023-05-01");
  const [apiKey, setApiKey] = useState("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");

  const generateNewApiKey = () => {
    // In a real application, this would be an API call
    const newKey = "xxx235yhx-xxxx-xxxx-xxxx-xxx2345".replace(/[x]/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    );
    setApiKey(newKey);
    setCreatedDate(new Date().toISOString().split("T")[0]);
    toast.success("New API key generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard!");
  };

  const revokeApiKey = () => {
    setApiKey("");
    setCreatedDate("");
    toast.success("API key revoked successfully!");
  };

  const createNewApiKey = async () => {
    try {
      const response = await dispatch(createAPIKey({ id: userId }));
      console.log(response, "response");
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        setGeneratedAPIKey(response.payload.data);
        console.log(response);
      } else {
        toast.error(response.payload.message);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const invalidateNewApiKey = async () => {
    try {
      const response = await dispatch(invalidateAPIKey({ id: userId }));
      console.log(response, "response");
      if (response.payload.success === true) {
        toast.success(response.payload.message);
        console.log(response);
      } else {
        toast.error(response.payload.message);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex justify-between items-center mb-6">
           <Button onClick={generateNewApiKey} className={"py-3 px-6"} name={`Generate New API Key`} />
        </div>
        {apiKey && (
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
                  onClick={revokeApiKey}
                  className="text-red-600 hover:text-red-800"
                  title="Revoke API key"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-[#0D0E32] font-mono bg-gray-100 p-2 rounded">
              {apiKey}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Created on: {createdDate}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiSection;
