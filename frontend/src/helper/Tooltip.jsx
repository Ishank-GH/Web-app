import React from "react";

const ToolTip = ({ children, message }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <span
        className="absolute left-1/2 bottom-full mb-2 w-max -translate-x-1/2 
      rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 
      group-hover:opacity-100"
      >
        {message}
      </span>
    </div>
  );
};

export default ToolTip;
