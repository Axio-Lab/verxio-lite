import React from 'react';

const NavButton = ({ icon, label, onClick, active }) => (
  <button
    className={`flex flex-col items-center py-2 px-4 text-sm font-medium ${
      active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="mt-1">{label}</span>
  </button>
);

export default NavButton;
