"use client";
import Image from "next/image";

export const VerifyAUser = ({ requestUrl }) => {
  return (
    <div className="bg-[#000]/40 absolute w-full h-screen overflow-hidden top-0 left-0 z-50 flex justify-center items-center px-28">
      <div className="bg-white flex flex-col items-center gap-5 relative p-6 rounded-lg w-[320px] md:w-[538px]">
        <div className="flex items-center gap-6 flex-col text-center mx-auto justify-center my-6">
          <Image
            width={300}
            height={300}
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=#${requestUrl}`}
          />
        </div>
      </div>
    </div>
  );
};
