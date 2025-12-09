import React, { useState } from "react";
import axios from "axios";

const SplitPagesZip = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const splitPages = async () => {
    if (!file) {
      alert("Please upload a PDF file");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setDownloadURL(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/split-pages-zip`,
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      setDownloadURL(url);

    } catch (error) {
      console.error(error);
      alert("Failed to split PDF pages.");
    }

    setProcessing(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "split_pages.zip";
    link.click();
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-xl text-center">

        <h1 className="text-3xl font-bold text-blue-600">Split PDF into Individual Pages</h1>
        <p className="text-gray-500 mt-1">Each page will be saved as a separate PDF inside a .zip file</p>

        {/* Upload PDF */}
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50">
          <input 
            type="file" 
            id="splitPageFile" 
            accept=".pdf" 
            className="hidden"
            onChange={handleFileUpload} 
          />
          <label htmlFor="splitPageFile" className="cursor-pointer">
            <p className="text-lg font-medium">{file ? file.name : "Click to Upload PDF"}</p>
          </label>
        </div>

        {/* Split Button */}
        {!processing && !downloadURL && (
          <button
            className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={splitPages}
          >
            Split PDF Pages
          </button>
        )}

        {/* Loader */}
        {processing && (
          <div className="mt-6">
            <div className="mx-auto w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="font-bold mt-3">{progress}%</p>
          </div>
        )}

        {/* Download */}
        {downloadURL && (
          <div className="mt-8">
            <h3 className="font-bold text-green-600 text-xl">
              PDF Split Successfully!
            </h3>

            <button
              className="mt-4 px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={handleDownload}
            >
              Download Split ZIP
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SplitPagesZip;
