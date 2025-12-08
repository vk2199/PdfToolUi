import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const RemovePages = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [removedPages, setRemovedPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setRemovedPages([]);
    setDownloadURL(null);
    previewPdf(uploaded);
  };

  const previewPdf = async (pdfFile) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      const pagesPreview = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        pagesPreview.push({
          pageNumber: i,
          image: canvas.toDataURL("image/png"),
        });
      }

      setPages(pagesPreview);
    };

    reader.readAsArrayBuffer(pdfFile);
  };

  const toggleRemove = (pageNumber) => {
    setRemovedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const applyRemove = async () => {
    if (!file || removedPages.length === 0) {
      alert("Select at least one page to remove");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pages", JSON.stringify(removedPages)); // send removed pages

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/pdf/remove-pages",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setDownloadURL(url);
    } catch (err) {
      alert("Error removing pages");
    }

    setProcessing(false);
  };

  const downloadPDF = () => {
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = "removed-pages.pdf";
    a.click();
  };

  return (
    <div className="mt-10 px-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Remove Pages from PDF
      </h1>
      <p className="text-center text-gray-600">Click ❌ to select pages for deletion</p>

      {/* Upload */}
      <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50 text-center">
        <input
          type="file"
          id="removePdf"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="removePdf" className="cursor-pointer">
          <p className="text-lg">{file ? file.name : "Click to Upload PDF"}</p>
        </label>
      </div>

      {/* Preview Grid */}
      {pages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {pages.map((pg) => (
            <div
              key={pg.pageNumber}
              className="relative bg-white shadow-lg p-3 rounded-lg hover:scale-105 transition"
            >
              <button
                className={`absolute top-1 right-1 px-2 text-xs rounded-full ${
                  removedPages.includes(pg.pageNumber)
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => toggleRemove(pg.pageNumber)}
              >
                ❌
              </button>

              <img src={pg.image} className="rounded mx-auto" alt="" />
              <p className="font-medium mt-2 text-center">Page {pg.pageNumber}</p>
            </div>
          ))}
        </div>
      )}

      {/* Remove Button */}
      {pages.length > 0 && !processing && !downloadURL && (
        <div className="text-center mt-8">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={applyRemove}
          >
            Remove Selected Pages
          </button>
        </div>
      )}

      {/* Loader */}
      {processing && (
        <div className="text-center mt-8">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 font-bold">Processing...</p>
        </div>
      )}

      {/* Download */}
      {downloadURL && (
        <div className="text-center mt-8">
          <button
            className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={downloadPDF}
          >
            Download Updated PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default RemovePages;
