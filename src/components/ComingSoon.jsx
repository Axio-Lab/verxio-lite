import React from "react";
import { Rocket, Clock, Bell } from "lucide-react";

const ComingSoonPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#090A25] rounded-3xl sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8 text-center">
        <div>
          <p className="text-xl text-indigo-100 sm:text-2xl">
            We're working hard to bring you this feature.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
          <div className="flex items-center space-x-2 text-white">
            <Rocket size={24} />
            <span className="text-lg">Launching Soon</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Clock size={24} />
            <span className="text-lg">Stay Tuned</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Bell size={24} />
            <span className="text-lg">Get Notified</span>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-indigo-200">
            Don't worry, we'll notify you when it's ready.
            <br className="hidden sm:inline" />
            In the meantime, keep crushing those campaigns!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
