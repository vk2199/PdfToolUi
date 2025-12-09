import React, { useState } from "react";
import axios from "axios";

const AddPageNumbers = () => {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("bottom-center");
  const [format, setFormat] = useState("Page {n}");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFile = (e) => setFile(e.target.files[0]);

  const applyNumbering = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", position);
    formData.append("format", format);
    formData.append("fontSize", fontSize);
    formData.append("color", color);

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pdf/add-page-numbers`,
        formData,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      setDownloadURL(url);
    } catch (err) {
      alert("Error adding page numbers");
    }
    
    setProcessing(false);
  };

  return (
    <div className="px-10 mt-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">Add Page Numbers</h1>
      <p className="text-center text-gray-500">Customize page number style & position</p>

      <div className="border-2 border-dashed border-blue-400 mt-6 p-6 rounded-lg text-center">
        <input type="file" id="pagePdfUpload" accept=".pdf" className="hidden" onChange={handleFile} />
        <label htmlFor="pagePdfUpload" className="cursor-pointer">
          {file ? file.name : "Click to upload PDF"}
        </label>
      </div>

      {file && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div>
            <p className="font-semibold">Position</p>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          <div>
            <p className="font-semibold">Format</p>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="e.g. Page {n}, Pg {n}, {n}"
            />
          </div>

          <div>
            <p className="font-semibold">Font Size</p>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="border p-2 rounded w-full"
              min="8"
              max="40"
            />
          </div>

          <div>
            <p className="font-semibold">Color</p>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

        </div>
      )}

      {!processing && file && !downloadURL && (
        <div className="text-center mt-8">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={applyNumbering}
          >
            Apply Page Numbers
          </button>
        </div>
      )}

      {processing && (
        <div className="text-center mt-8">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 font-medium">Processing...</p>
        </div>
      )}

      {downloadURL && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = downloadURL;
              a.download = "numbered.pdf";
              a.click();
            }}
            className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Updated PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPageNumbers;
