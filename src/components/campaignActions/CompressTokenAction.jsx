import * as Yup from "yup";
import { Minimize } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/Button";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setTokenMint } from "@/store/slices/statesSlice";

const CompressTokenAction = () => {
  const dispatch = useDispatch();
  const tokenMint = useSelector((state) => state.generalStates.tokenMint);

  const initialValues = {
    tokenMintAmount: tokenMint?.tokenMintAmount || "",
    tokenMintAddress: tokenMint?.tokenMintAddress || "",
  };

  const validationSchema = Yup.object().shape({
    tokenMintAmount: Yup.number().required("Token amount is required"),
    tokenMintAddress: Yup.string().required("Token address is required"),
  });

  return (
    <>
      <Formik
        onSubmit={() => {}}
        validationSchema={validationSchema}
        initialValues={initialValues}
      >
        {({ values, setFieldValue, errors, touched, dirty, isValid }) => (
          <Form className="space-y-3 sm:space-y-2 p-4 bg-white rounded-lg shadow border-none outline-none">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Minimize className="mr-2 text-indigo-500" />
              Compress Token Details
            </h3>

            <Field
              type="text"
              id="tokenAddress"
              className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 ${
                errors.tokenMintAddress && touched.tokenMintAddress
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary"
              } focus:ring-1 focus:ring-primary outline-none`}
              name="tokenAddress"
              value={values.tokenMintAddress}
              placeholder="Token mint address"
              onChange={(event) => {
                setFieldValue("tokenMintAddress", event.target.value);
              }}
            />

            <Field
              id="tokenAmount"
              type="number"
              className={`border outline-none bg-transparent font-normal text-sm sm:text-base rounded-lg w-full px-4 py-3 ${
                errors.tokenMintAmount && touched.tokenMintAmount
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary"
              } focus:ring-1 focus:ring-primary outline-none`}
              name="tokenAmount"
              value={values.tokenMintAmount}
              placeholder="Minimum burn amount"
              onChange={(event) => {
                setFieldValue("tokenMintAmount", event.target.value);
              }}
            />

            <Button
              name={"Save"}
              type="button"
              onClick={() => {
                if (dirty && isValid) {
                  dispatch(setTokenMint(values));
                  toast.success("Saved successful");
                } else {
                  toast.error("Please fill out the fields correctly");
                  return;
                }
              }}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CompressTokenAction;
