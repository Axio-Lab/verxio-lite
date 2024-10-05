import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setDigitalProduct } from "@/store/slices/statesSlice";
import { Button } from "@/components/Button";

const SellDigitalProductAction = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const verxiocloudinaryApiKey = process.env.VERXIO_CORE_CLOUDINARY_KEY;

  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    await getImageDataUrl(file, setFieldValue);
    toast.success("File upload successful");
  };

  const getImageDataUrl = async (file, setFieldValue) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "verxio_core_team_inc");
    formData.append("api_key", `${verxiocloudinaryApiKey}`);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dum54wavg/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const results = await response.json();
      setFieldValue("productFile", results.url);
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const digitalProduct = useSelector(
    (state) => state.generalStates.digitalProduct
  );

  const validationSchema = Yup.object().shape({
    productAmount: Yup.number()
      .required("Product amount is required")
      .min(1, "Product amount must be at least 1")
      .typeError("Product amount must be a valid number"),
    productQuantity: Yup.number().required("Product quantity is required"),
    productFile: Yup.string().required("Product file is required"),
  });

  const initialValues = {
    productAmount: digitalProduct?.productAmount || "",
    productQuantity: digitalProduct?.productQuantity || "",
    productFile: digitalProduct?.productFile || "",
    // isCustomAmount: digitalProduct?.isCustomAmount || false,
  };

  return (
    <Formik
      onSubmit={() => {}}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {({ values, setFieldValue, errors, touched, dirty, isValid }) => (
        <Form className="space-y-8 sm:space-y-12">
          <div className="p-4 bg-white rounded-lg shadow border-none outline-none">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="mr-2 text-purple-500" />
              Sell Digital Product Details
            </h3>
            <div className="flex flex-col items-start gap-2 mb-3">
              <Field
                id="productAmount"
                type={"number"}
                className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 ${
                  errors.productAmount && touched.productAmount
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                } focus:ring-1 focus:ring-primary outline-none`}
                name="productAmount"
                value={values.productAmount}
                placeholder="Product amount"
                onChange={(event) => {
                  setFieldValue("productAmount", event.target.value);
                }}
              />

              {errors.productAmount && touched.productAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productAmount}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-2 mb-3">
              <Field
                id="productQuantity"
                type="number"
                className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 ${
                  errors.productQuantity && touched.productQuantity
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                } focus:ring-1 focus:ring-primary outline-none`}
                name="number"
                value={values.productQuantity}
                placeholder="Product quantity"
                onChange={(event) => {
                  setFieldValue("productQuantity", event.target.value);
                }}
              />

              {errors.productQuantity && touched.productQuantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productQuantity}
                </p>
              )}
            </div>

            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product File
              </label>
              <div
                className="border-2 border-dashed border-indigo-300 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center bg-indigo-50 cursor-pointer hover:bg-indigo-100 transition duration-300"
                onClick={() => fileInputRef.current.click()}
              >
                {selectedImage ? (
                  <div className="relative w-full h-32 sm:h-48">
                    <Image
                      src={selectedImage}
                      alt={
                        selectedImage
                          ? "File uploaded successful"
                          : "An error occured"
                      }
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <FiUploadCloud className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ADEF] mb-4" />
                    <p className="text-[#77a4b7] font-medium text-sm sm:text-base">
                      Click to upload product file
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      PDF, DOCX, ZIP up to 100MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                  accept="image/*,.pdf,.docx,.zip"
                />
              </div>

              {errors.productFile && touched.productFile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productFile}
                </p>
              )}
            </div>
            <Button
              name={"Save"}
              onClick={() => {
                if (dirty && isValid) {
                  dispatch(setDigitalProduct(values));
                  toast.success("Saved successful");
                }
              }}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SellDigitalProductAction;

