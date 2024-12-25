import React, { useState } from 'react';

const TooltipButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ms-3 mb-2 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Tooltip right
      </button>

      {isVisible && (
        <div
          role="tooltip"
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-200 dark:bg-gray-700"
          style={{
            top: '50%',
            left: '110%',
            transform: 'translateY(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          Tooltip on right
          <div
            className="absolute w-2 h-2 bg-gray-900 transform rotate-45 dark:bg-gray-700"
            style={{
              top: '50%',
              right: '100%',
              transform: 'translateY(-50%)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
