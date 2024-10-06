"use client";
import Image from "next/image";
import { Button } from "../Button";
import useMediaQuery from "@/hooks/useMediaQuery";

export const VerifyAUser = ({ requestUrl, closeModal }) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <div
      onClick={() => closeModal(false)}
      className="bg-[#000]/40 fixed inset-0 z-50 flex justify-center items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex flex-col items-center gap-5 relative p-6 rounded-lg w-full max-w-[400px]"
      >
        <div className="flex flex-col items-center w-full gap-6 text-center">
          <Image
            width={300}
            height={300}
            alt="qr_code"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              requestUrl
            )}`}
            className="w-full max-w-[300px] h-auto"
          />

          {isSmallScreen && <p>Scan this QR to verify your Google account</p>}

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
