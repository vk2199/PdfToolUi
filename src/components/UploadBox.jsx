import React, { useState } from "react";

const UploadBox = () => {
  const [fileName, setFileName] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setShowOptions(true);
    }
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  const dropHandler = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setShowOptions(true);
    }
  };

  return (
    <div className="mt-10">
      <div
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
        className="border-2 border-dashed border-blue-400 rounded-lg p-10 text-center w-full md:w-1/2 mx-auto hover:bg-blue-50 transition"
      >
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="hidden" 
          id="fileUpload"
        />

        <label htmlFor="fileUpload" className="cursor-pointer">
          <p className="text-xl font-semibold text-gray-700">
            Drag & Drop PDF Here
          </p>
          <p className="text-gray-500 text-sm mt-2">or click to browse</p>
        </label>

        {fileName && (
          <p className="mt-4 text-green-600 font-medium text-lg">
            Uploaded: {fileName}
          </p>
        )}
      </div>

      {/* Show Options After File Upload */}
      {showOptions && (
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">What do you want to do?</h3>

          <div className="flex flex-wrap justify-center gap-4">
            <OperationButton name="Convert to Word" />
            <OperationButton name="Compress PDF" />
            <OperationButton name="Split Pages" />
            <OperationButton name="PDF to Image" />
            <OperationButton name="Sign PDF" />
          </div>
        </div>
      )}
    </div>
  );
};

const OperationButton = ({ name }) => (
  <button className="px-5 py-2 border rounded-lg bg-blue-600 text-white hover:bg-blue-700">
    {name}
  </button>
);

export default UploadBox;
