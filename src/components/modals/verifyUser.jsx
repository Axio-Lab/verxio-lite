"use client";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "../Button";
import { useEffect } from "react";

// import { useSelector } from "react-redux";

export const VerifyAUser = ({ requestUrl, closeModal }) => {
  // const userProfile = useSelector((state) => state.generalStates.userProfile);
  // const { isVerified } = userProfile;
  // console.log(isVerified, userProfile, "Verification status");
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  // console.log(requestUrl, "request url");

  useEffect(() => {
    console.log(requestUrl, "request url");
  }, [requestUrl]);

  return (
    <div
      onClick={() => closeModal(false)}
      className="bg-[#000]/40 absolute w-full h-screen overflow-hidden top-0 left-0 z-50 flex justify-center items-center px-28"
    >
      <div className="bg-white flex flex-col items-center gap-5 relative p-6 rounded-lg w-[320px] md:w-[400px]">
        <div className="flex items-center gap-6 flex-col text-center mx-auto justify-center">
          <Image
            width={300}
            height={300}
            alt="qr_code"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              requestUrl
            )}`}
          />

          {isSmallScreen && (
            <Button
              name="Verify in reclaim app"
              href={`${requestUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          )}
        </div>
      </div>
    </div>
  );
};
