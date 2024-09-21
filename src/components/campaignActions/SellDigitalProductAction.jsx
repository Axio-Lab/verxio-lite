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
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

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
  });

  const initialValues = {
    productAmount: digitalProduct?.productAmount || "",
    productQuantity: digitalProduct?.productQuantity || "",
    productFile: digitalProduct?.productFile || "",
    isCustomAmount: digitalProduct?.isCustomAmount || false,
  };

  return (
    <Formik
      onSubmit={() => {}}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {({ values, setFieldValue, errors, touched, dirty }) => (
        <Form className="space-y-8 sm:space-y-12">
          <div className="p-4 bg-white rounded-lg shadow border-none outline-none">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="mr-2 text-purple-500" />
              Sell Digital Product Details
            </h3>
            <div className="flex flex-col items-start gap-3 mb-3">
              <Field
                id="product"
                type={values.isCustomAmount ? "text" : "number"}
                className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 ${
                  errors.productAmount && touched.productAmount
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                } focus:ring-1 focus:ring-primary outline-none`}
                name="title"
                value={values.productAmount}
                placeholder="Product amount"
                onChange={(event) => {
                  setFieldValue("productAmount", event.target.value);
                }}
                disabled={values.isCustomAmount}
              />

              {errors.productAmount && touched.productAmount && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.productAmount}
                </div>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={values.isCustomAmount}
                  onChange={(event) =>
                    setFieldValue("isCustomAmount", event.target.checked)
                  }
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Custom amount
                </span>
              </label>
            </div>

            <Field
              id="quantity"
              type="number"
              className="border outline-none bg-transparent  font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              name="number"
              value={values.productQuantity}
              placeholder="Product quantity"
              onChange={(event) => {
                setFieldValue("productQuantity", event.target.value);
              }}
            />

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
                      alt="product image"
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
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  accept="image/*,.pdf,.docx,.zip"
                />
              </div>
            </div>
            <Button
              name={"Save"}
              onClick={() => {
                if (dirty) {
                  // console.log(values);
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
