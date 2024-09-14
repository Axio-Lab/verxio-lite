import Link from "next/link";
import { twMerge } from "tailwind-merge";

const TabButton = ({ name, href, isActive, className }) => (
  <Link
    href={href}
    className={twMerge(
      `text-[#787887] font-normal shadow-sm text-xs md:text-sm ${
        isActive
          ? "bg-[#DFDFF7] text-[#2C30AA] border-b border-[#2C30AA] font-bold"
          : "bg-transparent"
      } px-8 py-2 hover:text-[#2C30AA] hover:border-b hover:border-[#2C30AA] transition duration-300 ease-out`,
      className
    )}
  >
    {name}
  </Link>
);

export default TabButton;
