import React, { useState } from "react";
import axios from "axios";

const InsertPages = () => {
  const [mainPdf, setMainPdf] = useState(null);
  const [insertPdf, setInsertPdf] = useState(null);
  const [page, setPage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleMainUpload = (e) => {
    setMainPdf(e.target.files[0]);
    setDownloadURL(null);
  };

  const handleInsertUpload = (e) => {
    setInsertPdf(e.target.files[0]);
    setDownloadURL(null);
  };

  const handleInsertPDF = async () => {
    if (!mainPdf || !insertPdf || !page) {
      alert("Please upload both PDFs and enter page number");
      return;
    }

    const formData = new FormData();
    formData.append("mainPdf", mainPdf);   // must match backend param
    formData.append("insertPdf", insertPdf); // must match backend param
    formData.append("page", page);          // must match backend param

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/insert-pages`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = URL.createObjectURL(blob);
      setDownloadURL(link);
    } catch (error) {
      console.error(error);
      alert("Insert failed!");
    }

    setProcessing(false);
  };

  const downloadPDF = () => {
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = "updated.pdf";
    a.click();
  };

  return (
    <div className="px-10 mt-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Insert PDF Into Another PDF
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Choose main PDF and select page number where the second PDF will be inserted
      </p>

      {/* Upload Main PDF */}
      <div className="border border-blue-400 p-6 rounded-lg mt-6 hover:bg-blue-50 text-center cursor-pointer">
        <input
          type="file"
          id="mainPdf"
          accept=".pdf"
          className="hidden"
          onChange={handleMainUpload}
        />
        <label htmlFor="mainPdf" className="cursor-pointer">
          {mainPdf ? mainPdf.name : "Upload Main PDF"}
        </label>
      </div>

      {/* Upload Insert PDF */}
      <div className="border border-green-400 p-6 rounded-lg mt-4 hover:bg-green-50 text-center cursor-pointer">
        <input
          type="file"
          id="insertPdf"
          accept=".pdf"
          className="hidden"
          onChange={handleInsertUpload}
        />
        <label htmlFor="insertPdf" className="cursor-pointer">
          {insertPdf ? insertPdf.name : "Upload PDF to Insert"}
        </label>
      </div>

      {/* Page number */}
      <div className="text-center mt-6">
        <input
          type="number"
          min="1"
          className="border p-2 rounded w-60"
          placeholder="Insert at page number"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
      </div>

      {/* Insert Button */}
      {!processing && !downloadURL && (
        <div className="text-center mt-6">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleInsertPDF}
          >
            Insert PDF
          </button>
        </div>
      )}

      {/* Loader */}
      {processing && (
        <div className="text-center mt-6">
          <div className="w-16 h-16 animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
          <p className="mt-3 font-bold">Processing...</p>
        </div>
      )}

      {/* Download */}
      {downloadURL && (
        <div className="text-center mt-6">
          <button
            className="px-10 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={downloadPDF}
          >
            Download Updated PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default InsertPages;
