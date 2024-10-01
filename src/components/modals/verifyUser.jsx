"use client";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "../Button";
import { useEffect } from "react";

export const VerifyAUser = ({ requestUrl, closeModal }) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    console.log(requestUrl, "request url");
  }, [requestUrl]);

  return (
    <div
      onClick={() => closeModal(false)}
      className="bg-[#000]/40 fixed inset-0 z-50 flex justify-center items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex flex-col items-center gap-5 relative p-6 rounded-lg w-full max-w-[400px]"
      >
        <div className="flex items-center gap-6 flex-col text-center w-full">
          <Image
            width={300}
            height={300}
            alt="qr_code"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              requestUrl
            )}`}
            className="w-full max-w-[300px] h-auto"
          />

          <p>Scan this QR to verify your Google account</p>

          {isSmallScreen && (
            <Button
              name="Verify in reclaim app"
              href={`${requestUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
