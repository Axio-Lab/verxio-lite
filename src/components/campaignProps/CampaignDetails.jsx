"use client";
import Tiptap from "./tiptap";
import * as Yup from "yup";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import React, { useState, useRef } from "react";
import "react-markdown-editor-lite/lib/index.css";
import { Button } from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FiUploadCloud } from "react-icons/fi";
import { setDetails } from "@/store/slices/statesSlice";

const CampaignDetails = () => {
  const fileInputRef = useRef(null);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const details = useSelector((state) => state.generalStates.details);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("DD/MM/YYYY");
    // setSelectedDate(formattedDate)
    console.log(formattedDate);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDescriptionChange = (newContent) => {
    setDescription(newContent);
    console.log(newContent);
  };

  const handleImageChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    await getImageDataUrl(file, setFieldValue);
  };

  const getImageDataUrl = async (file, setFieldValue) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Ibelachi_Test_Run");
    formData.append("api_key", "968631257356497");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/verxioaventor/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const results = await response.json();
      setFieldValue("bannerImg", results.url);
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const initialValues = {
    title: details?.title || "",
    description: details?.description || "",
    bannerImg: details?.bannerImg || "",
    startDate: details?.startDate || "",
    endDate: details?.endDate || "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Campaign name is required"),
    bannerImg: Yup.string().required("Campaign banner is required"),
    description: Yup.string().required("Campaign description is required"),
    startDate: Yup.date().required("Start date is required").nullable(),
    endDate: Yup.date().required("End date is required").nullable(),
  });

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Formik
        onSubmit={() => {}}
        validationSchema={validationSchema}
        initialValues={initialValues}
      >
        {({ values, setFieldValue, errors, touched, isValid, dirty }) => (
          <Form className="space-y-8 sm:space-y-12">
            <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <label
                    htmlFor="title"
                    className="font-medium text-base sm:text-lg text-gray-700 mb-2 block"
                  >
                    Campaign Title
                  </label>
                  <Field
                    id="title"
                    className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 ${
                      errors.title && touched.title
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-primary"
                    } focus:ring-1 focus:ring-primary outline-none`}
                    // className="border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    name="title"
                    value={values.title}
                    placeholder="Enter campaign name"
                    onChange={(event) => {
                      setFieldValue("title", event.target.value);
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="font-medium text-base sm:text-lg text-gray-700 mb-2 block"
                  >
                    Campaign Description
                  </label>
                  <Tiptap
                    onChange={handleDescriptionChange}
                    setFieldValue={setFieldValue}
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">
                    Campaign Banner
                  </label>
                  <div
                    className="border-2 border-dashed border-indigo-300 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center bg-indigo-50 cursor-pointer hover:bg-indigo-100 transition duration-300"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {selectedImage ? (
                      <div className="relative w-full h-32 sm:h-48">
                        <Image
                          src={selectedImage}
                          alt="Campaign Banner"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <FiUploadCloud className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ADEF] mb-4" />
                        <p className="text-[#00ADEF] font-medium text-sm sm:text-base">
                          Click to upload campaign banner
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-medium text-base sm:text-lg text-gray-700 mb-2 block">
                      Campaign Start Date
                    </label>
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={(date) => {
                        handleDateChange(date);
                        setFieldValue(
                          "startDate",
                          dayjs(date).format("DD/MM/YYYY")
                        );
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-base sm:text-lg text-gray-700 mb-2 block">
                      Campaign End Date
                    </label>
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={(date) => {
                        handleDateChange(date);
                        setFieldValue(
                          "endDate",
                          dayjs(date).format("DD/MM/YYYY")
                        );
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full mt-8 sm:mt-10">
                <Button
                  href="/dashboard/create-campaign?route=action"
                  name={"Continue"}
                  onClick={() => {
                    if (dirty && isValid) {
                      console.log(values);
                      dispatch(setDetails(values));
                    }
                  }}
                  className="w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default CampaignDetails;
