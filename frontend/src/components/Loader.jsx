import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );
};

export default Loader;