import React, { useState } from "react";
import axios from "axios";

const WatermarkPdf = () => {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const applyWatermark = async () => {
    if (!file || !watermarkText.trim()) {
      alert("Please select PDF and enter watermark text");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setDownloadURL(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", watermarkText);

    try {
      const response = await axios.post(
        "http://localhost:8080/pdf/watermark-single",
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
      console.log(error);
      alert("Failed to process watermark.");
    }

    setProcessing(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "watermarked.pdf";
    link.click();
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-xl text-center">
        
        <h1 className="text-3xl font-bold text-blue-600">Add Watermark to PDF</h1>
        <p className="text-gray-500 mt-1">
          Upload a PDF and add custom watermark text.
        </p>

        {/* Upload */}
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50">
          <input type="file" id="watermarkFile" accept=".pdf" className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="watermarkFile" className="cursor-pointer">
            <p className="text-lg font-medium">
              {file ? file.name : "Click to Upload PDF"}
            </p>
          </label>
        </div>

        {/* Watermark Input */}
        <input
          type="text"
          placeholder="Enter text to watermark"
          className="mt-5 border px-4 py-2 w-full rounded"
          onChange={(e) => setWatermarkText(e.target.value)}
        />

        {/* Apply Button */}
        {!processing && !downloadURL && (
          <button
            className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={applyWatermark}
          >
            Apply Watermark
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
              Watermark added successfully!
            </h3>

            <button
              onClick={handleDownload}
              className="mt-4 px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Watermarked PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default WatermarkPdf;
