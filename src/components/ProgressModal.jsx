import React from "react";

const ProgressModal = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">Converting...</h2>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-blue-600 h-3 rounded-full animate-pulse w-2/3"></div>
        </div>
        <p className="mt-3 text-gray-600">Please wait</p>
      </div>
    </div>
  );
};

export default ProgressModal;
