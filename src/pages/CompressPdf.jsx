import React, { useState } from "react";
import axios from "axios";

const CompressPdf = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState("recommended");
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [reducedPercent, setReducedPercent] = useState(null);

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setDownloadURL(null);
  };

  const compressPDF = async () => {
    if (!file) {
      alert("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    setProcessing(true);
    setOriginalSize((file.size / (1024 * 1024)).toFixed(2));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/compress`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadURL(url);

      setCompressedSize((blob.size / (1024 * 1024)).toFixed(2));

      const percent = (((file.size - blob.size) / file.size) * 100).toFixed(1);
      setReducedPercent(percent);

    } catch (error) {
      alert("Error compressing PDF");
    }

    setProcessing(false);
  };

  const downloadPDF = () => {
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = "compressed.pdf";
    a.click();
  };

  return (
    <div className="px-10 mt-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Compress PDF
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Reduce file size easily — keep good quality
      </p>

      {/* Upload */}
      <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg mt-6 text-center cursor-pointer hover:bg-blue-50">
        <input
          type="file"
          id="compressPdf"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <label htmlFor="compressPdf" className="cursor-pointer">
          {file ? file.name : "Click to Upload PDF"}
        </label>
      </div>

      {/* Compression Options */}
      <div className="text-center mt-6">
        <h3 className="font-semibold">Choose Compression Quality</h3>
        <div className="flex justify-center gap-6 mt-3">

          <label className="cursor-pointer">
            <input
              type="radio"
              name="quality"
              value="extreme"
              checked={quality === "extreme"}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="ml-2">Extreme (Smallest size)</span>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="quality"
              value="recommended"
              checked={quality === "recommended"}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="ml-2">Recommended</span>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="quality"
              value="less"
              checked={quality === "less"}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="ml-2">Less (Better quality)</span>
          </label>
        </div>
      </div>

      {/* Compress Button */}
      {!processing && !downloadURL && (
        <div className="text-center mt-8">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={compressPDF}
          >
            Compress PDF
          </button>
        </div>
      )}

      {/* Loader */}
      {processing && (
        <div className="text-center mt-8">
          <div className="w-20 h-20 animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
          <p className="mt-2 font-bold">Processing...</p>
        </div>
      )}

      {/* Result */}
      {downloadURL && (
        <div className="text-center mt-8">
          <h3 className="font-semibold text-green-600 text-xl">Compression Successful 🎉</h3>
          <p className="mt-2">
            Original: <b>{originalSize} MB</b> → Compressed: <b>{compressedSize} MB</b>
          </p>
          <p className="text-green-700 font-semibold">
            Reduced: {reducedPercent}% smaller
          </p>

          <button
            onClick={downloadPDF}
            className="px-10 py-3 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
          >
            Download Compressed PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CompressPdf;
