import React, { useState } from "react";
import axios from "axios";

const SplitRangePdf = () => {
  const [file, setFile] = useState(null);
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const splitRange = async () => {
    if (!file || !fromPage || !toPage) {
      alert("Please upload PDF and enter page range.");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setDownloadURL(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fromPage", fromPage);
    formData.append("toPage", toPage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/split/range`,
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

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setDownloadURL(url);

    } catch (error) {
      console.error(error);
      alert("Error splitting PDF");
    }

    setProcessing(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = `split_${fromPage}_to_${toPage}.pdf`;
    link.click();
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-xl text-center">

        <h1 className="text-3xl font-bold text-blue-600">Split PDF (Page Range)</h1>
        <p className="text-gray-500 mt-1">Extract selected pages from a PDF</p>

        {/* Upload */}
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50">
          <input type="file" id="splitRangeFile" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          <label htmlFor="splitRangeFile" className="cursor-pointer">
            <p className="text-lg font-medium">{file ? file.name : "Click to Upload PDF"}</p>
          </label>
        </div>

        {/* From Page */}
        <div className="mt-5">
          <label className="block font-medium text-left">From Page</label>
          <input
            type="number"
            placeholder="Start page"
            className="border px-4 py-2 w-full rounded"
            onChange={(e) => setFromPage(e.target.value)}
          />
        </div>

        {/* To Page */}
        <div className="mt-4">
          <label className="block font-medium text-left">To Page</label>
          <input
            type="number"
            placeholder="End page"
            className="border px-4 py-2 w-full rounded"
            onChange={(e) => setToPage(e.target.value)}
          />
        </div>

        {/* Split Button */}
        {!processing && !downloadURL && (
          <button
            className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={splitRange}
          >
            Split PDF
          </button>
        )}

        {/* Progress */}
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
              Split Successfully!
            </h3>
            <button
              onClick={handleDownload}
              className="mt-4 px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Split PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SplitRangePdf;
