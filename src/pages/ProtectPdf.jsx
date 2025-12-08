import React, { useState } from "react";
import axios from "axios";

const ProtectPdf = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const protectPDF = async () => {
    if (!file || !password.trim()) {
      alert("Please upload PDF and enter a password");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setDownloadURL(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8080/pdf/protect",
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
      alert("Error securing PDF.");
    }

    setProcessing(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "protected.pdf";
    link.click();
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-xl text-center">

        <h1 className="text-3xl font-bold text-blue-600">Protect PDF</h1>
        <p className="text-gray-500 mt-1">Secure your PDF with a password</p>

        {/* Upload */}
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50">
          <input
            type="file"
            id="protectPDF"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="protectPDF" className="cursor-pointer">
            <p className="text-lg font-medium">
              {file ? file.name : "Click to Upload PDF"}
            </p>
          </label>
        </div>

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter new password"
          className="mt-5 border px-4 py-2 w-full rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Protect Button */}
        {!processing && !downloadURL && (
          <button
            className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={protectPDF}
          >
            Protect PDF
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
            <h3 className="text-green-600 font-bold text-xl">
              PDF Secured Successfully!
            </h3>
            <button
              onClick={handleDownload}
              className="mt-4 px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Protected PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProtectPdf;
