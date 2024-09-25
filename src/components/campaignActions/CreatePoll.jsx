import * as Yup from "yup";
import { BarChart2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/Button";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setPollsOption } from "@/store/slices/statesSlice";

const PollAction = () => {
  const dispatch = useDispatch();
  const pollsOption = useSelector((state) => state.generalStates.pollsOption);

  const initialValues = {
    optionsArray: pollsOption?.optionsArray || ["", ""],
  };

  const validationSchema = Yup.object().shape({
    optionsArray: Yup.array()
      .of(
        Yup.string()
          .trim()
          .min(1, "Option cannot be empty")
          .required("Option is required")
      )
      .min(2, "At least two options are required")
      .required("Poll options are required"),
  });

  const handleOptionChange = (index, value, setFieldValue, values) => {
    const newOptions = [...values.optionsArray];
    newOptions[index] = value;
    setFieldValue("optionsArray", newOptions);
  };

  const addOption = (setFieldValue, values) => {
    if (values.optionsArray.length < 5) {
      const newOptions = [...values.optionsArray, ""];
      setFieldValue("optionsArray", newOptions);
    }
  };

  const removeOption = (index, setFieldValue, values) => {
    if (values.optionsArray.length > 2) {
      const newOptions = values.optionsArray.filter((_, i) => i !== index);
      setFieldValue("optionsArray", newOptions);
    }
  };

  const handleSave = (values) => {
    const filteredOptions = values.optionsArray.filter(
      (option) => option.trim() !== ""
    );
    if (filteredOptions.length < 2) {
      toast("Please provide at least two non-empty options.");
      return;
    }
    dispatch(setPollsOption(filteredOptions));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-3 sm:space-y-2 p-4 bg-white rounded-lg shadow border-none outline-none">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart2 className="mr-2 text-green-500" />
              Burn Token Details
            </h3>

            <label className="block mb-2">Poll Options:</label>
            {values.optionsArray.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <Field
                  type="text"
                  name={`optionsArray[${index}]`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      e.target.value,
                      setFieldValue,
                      values
                    )
                  }
                  className="flex-grow p-2 border rounded mr-2 outline-none"
                  placeholder={`Option ${index + 1}`}
                />
                {values.optionsArray.length > 2 && (
                  <Button
                    name={"Remove"}
                    onClick={() => removeOption(index, setFieldValue, values)}
                    shade={"border border-red-600"}
                    className={"bg-red-600 border border-red-600 text-white"}
                  />
                )}
              </div>
            ))}
            {values.optionsArray.length < 5 && (
              <Button
                name={"Add Option"}
                outline
                onClick={() => addOption(setFieldValue, values)}
                style={{ backgroundColor: "white" }}
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 sm:py-3"
              />
            )}
          </div>
          <Button
            name={"Save"}
            onClick={() => {
              handleSave(values);
            }}
            className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 sm:py-3"
          />
        </Form>
      )}
    </Formik>
  );
};

export default PollAction;
