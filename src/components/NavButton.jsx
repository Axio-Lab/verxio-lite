import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const NavButton = ({ icon, label, href }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
  };

  return (
    <Link href={href}>
      <span
        className={twMerge(
          `flex flex-col items-center py-2 px-4 text-sm font-medium`,
          isActive ? "text-[#00ADEF]" : "text-gray-500 hover:text-gray-700"
        )}
        onClick={handleClick}
      >
        {icon}
        <span className="mt-1">{label}</span>
      </span>
    </Link>
  );
};

export default NavButton;
