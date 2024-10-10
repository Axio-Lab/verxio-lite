import * as Yup from "yup";
import { BarChart2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setPollsOption } from "@/store/slices/statesSlice";

const PollAction = () => {
  const dispatch = useDispatch();
  const pollsOption = useSelector((state) => state.generalStates.pollsOption);

  const initialValues = {
    pollTitle: pollsOption?.pollTitle || "",
    optionsArray: pollsOption?.optionsArray || ["", ""],
  };

  const validationSchema = Yup.object().shape({
    pollTitle: Yup.string().required("Poll title is required"),
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

  const handleSave = (values, isValid) => {
    const filteredOptions = values.optionsArray.filter(
      (option) => option.trim() !== ""
    );
    if (filteredOptions.length < 2) {
      toast.error("Please provide at least two non-empty options.");
      return;
    }

    if (isValid) {
      dispatch(
        setPollsOption({
          pollTitle: values.pollTitle,
          optionsArray: filteredOptions,
        })
      );
      toast.success("Saved successfully");
      // console.log(pollsOption, "polls options");
    } else {
      toast.error("Please fill out the fields correctly");
      return;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, errors, touched, isValid }) => (
        <Form className="p-4 space-y-3 bg-white border-none rounded-lg shadow outline-none sm:space-y-2">
          <div>
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <BarChart2 className="mr-2 text-green-500" />
              Create Poll Details
            </h3>

            <div className="mb-4 space-y-2">
              <label htmlFor="pollTitle" className="block mb-2 font-medium">
                Poll Title:
              </label>
              <Field
                id="pollTitle"
                className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded w-full px-4 py-2 ${
                  errors.pollTitle && touched.pollTitle
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                } focus:ring-1 focus:ring-primary outline-none`}
                name="pollTitle"
                value={values.pollTitle}
                placeholder="e.g. Vote for your favorite superteam chapter"
                onChange={(event) => {
                  setFieldValue("pollTitle", event.target.value);
                }}
              />
              <ErrorMessage
                name="pollTitle"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <label className="block mb-2 font-medium">Poll Options:</label>
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
                  className="flex-grow p-2 mr-2 border rounded outline-none"
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
                className="w-full px-4 text-sm sm:w-auto sm:text-base sm:px-6 sm:py-3"
              />
            )}
          </div>
          <Button
            name={"Save"}
            onClick={() => {
              handleSave(values, isValid);
            }}
            className="w-full px-4 text-sm sm:w-auto sm:text-base sm:px-6 sm:py-3"
          />
        </Form>
      )}
    </Formik>
  );
};

export default PollAction;
