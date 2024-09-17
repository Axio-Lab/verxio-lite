import Link from "next/link";
import { twMerge } from "tailwind-merge";

const TabButton = ({ name, href, isActive, className }) => (
  <Link
    href={href}
    className={twMerge(
      `relative px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg`,
      isActive
        ? "text-indigo-700 bg-indigo-50"
        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50",
      className
    )}
  >
    {name}
    {isActive && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
    )}
  </Link>
);

export default TabButton;