import React, { useState, useEffect } from "react";
import { BarChart2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/Button";

const PollAction = ({ onSave, initialData }) => {
  const [options, setOptions] = useState(initialData?.options || ["", ""]);
  const [question, setQuestion] = useState(initialData?.question || "");

  useEffect(() => {
    if (options.length < 2) {
      setOptions((prev) => [...prev, ""]);
    }
  }, [options]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSave = () => {
    const filteredOptions = options.filter((option) => option.trim() !== "");
    if (filteredOptions.length < 2) {
      toast("Please provide at least two non-empty options.");
      return;
    }
    if (question.trim() === "") {
      toast("Please provide a question for the poll.");
      return;
    }
    onSave({ question, options: filteredOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart2 className="mr-2 text-green-500" />
          Burn Token Details
        </h3>

        <label className="block mb-2">Poll Options:</label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-grow p-2 border rounded mr-2 outline-none"
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {options.length < 5 && (
          <Button
            name={"Add Option"}
            outline
            onClick={addOption}
            style={{ backgroundColor: "white" }}
            className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 sm:py-3"
          />
        )}
      </div>
      <Button
        name={"Save"}
        onClick={handleSave}
        className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 sm:py-3"
      />
    </div>
  );
};

export default PollAction;
