"use client";
import Tiptap from "./tiptap";
import * as Yup from "yup";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import React, { useState, useRef } from "react";
import "react-markdown-editor-lite/lib/index.css";
import UploadIcon from "@/components/assets/images/uploadIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CampaignDetails = () => {
  const fileInputRef = useRef(null);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
    startDate: details?.startDatate || "",
    endDate: details?.endDate || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Campaign name is required"),
    startDate: Yup.date().required("Start date is required").nullable(),
    endDate: Yup.date().required("End date is required").nullable(),
  });

  return (
    <section>
      <Formik
        onSubmit={() => {}}
        validationSchema={validationSchema}
        initialValues={initialValues}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col gap-8">
            <div className="w-full md:w-[90%] my-3">
              <p className="font-medium text-base md:text-xl text-[#303036] mb-3">
                Campaign Title
              </p>
              <Field
                className="border outline-none bg-transparent font-normal text-[14px] rounded-lg w-full px-5 py-3 border-[#0D0E32]"
                name="title"
                value={values.title}
                placeholder="Enter campaign name"
                onChange={(event) => {
                  setFieldValue("title", event.target.value);
                }}
              />
            </div>

            <div className="w-full md:w-[90%]">
              <p className="font-medium text-base md:text-xl text-[#303036] mb-3">
                Campaign Description
              </p>

              <Tiptap
                onChange={handleDescriptionChange}
                setFieldValue={setFieldValue}
              />
            </div>

            <div className="w-full md:w-[90%]">
              <p className="font-medium text-base md:text-xl text-[#303036] mb-3">
                Campaign Display Banner
              </p>

              <div className="flex flex-col justify-center items-center mx-auto rounded-lg border border-primary border-dashed bg-[#DFDFF7]">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="cover Banner"
                    className="w-full h-full bg-cover"
                    width={500}
                    height={400}
                  />
                ) : (
                  <div className="mx-28 my-24 justify-center border rounded-lg px-2 py-1 border-[#0D0E32] w-[150px] ">
                    <div className="flex items-center gap-2 justify-center">
                      <Image alt="upload" src={UploadIcon} />
                      <button
                        className="text-[14px]"
                        onClick={handleUploadButtonClick}
                      >
                        Upload Image
                      </button>
                    </div>
                    <input
                      name="profileImageDoc"
                      type="file"
                      capture="environment"
                      className="hidden"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        handleImageChange(e, setFieldValue);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center text-[13px] mt-2">
                <p>PNG / SVG / JPEG / 120*804</p>
                <p>Max 24MB</p>
              </div>
            </div>

            <div className="w-full md:w-[90%]">
              <section className="relative">
                <div className="flex flex-col md:flex-row gap-10 items-end w-full relative z-40 bg-white">
                  <div className="w-full flex flex-col items-start gap-2">
                    <p className="font-medium text-base md:text-xl text-[#303036] mb-3">
                      Campaign Start Date
                    </p>
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={(date) => {
                        handleDateChange(date);
                        console.log(date);
                        setFieldValue(
                          "startDate",
                          dayjs(date).format("DD/MM/YYYY")
                        );
                      }}
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-2">
                    <p className="font-medium text-base md:text-xl text-[#303036] mb-3">
                      Campaign End Date
                    </p>
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={(date) => {
                        handleDateChange(date);
                        setFieldValue(
                          "endDate",
                          dayjs(date).format("DD/MM/YYYY")
                        );
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default CampaignDetails;
