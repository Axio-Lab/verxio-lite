import { Field } from "formik";
import React, { useState, useEffect } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const CampaignDetails = ({
  campaignTitle,
  setCampaignName,
  setShowDescriptionPreview,
  description,
  setDescription,
  showDescriptionPreview,
  renderedDescription,
  mdParser,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");

  useEffect(() => {
    setLocalStartDate(startDate || "");
    setLocalEndDate(endDate || "");
  }, [startDate, endDate]);

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleDateChange = (setter, parentSetter) => (e) => {
    const date = e.target.value;
    setter(date);
    if (
      date &&
      !isNaN(new Date(date).getTime()) &&
      typeof parentSetter === "function"
    ) {
      parentSetter(date);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="mb-4">
        <p className="font-semibold text-[24px] mb-5">
          <span className="mr-3 text-">*</span>Campaign Title
        </p>
        <Field
          className="border outline-none bg-transparent font-normal text-[14px] rounded-lg w-full px-5 py-3 border-[#0D0E32]"
          name="title"
          value={campaignTitle}
          onChange={(event) => {
            setFieldValue("title", event.target.value);
          }}
          placeholder="Enter name of product"
        />
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="mb-4 text-xl font-semibold">Campaign Description</h3>
        </div>
        {showDescriptionPreview ? (
          <div className="p-4 prose bg-white border border-gray-300 rounded-md max-w-none">
            <div dangerouslySetInnerHTML={{ __html: renderedDescription }} />
          </div>
        ) : (
          <MdEditor
            style={{ height: "250px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            value={description}
            config={{
              view: { menu: true, md: true, html: false },
              canView: {
                menu: true,
                md: true,
                html: false,
                fullScreen: false,
                hideMenu: true,
              },
            }}
          />
        )}
      </div>
      <div className="mb-4">
        <h3 className="mb-4 text-xl font-semibold">Campaign Dates</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={localStartDate}
              onChange={handleDateChange(setLocalStartDate, setStartDate)}
              min={today}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={localEndDate}
              onChange={handleDateChange(setLocalEndDate, setEndDate)}
              min={localStartDate || today}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetails;
