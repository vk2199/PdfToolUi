import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const RotatePdfPreview = () => {
  const [file, setFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [rotations, setRotations] = useState({});
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setPdfPages([]);
    setRotations({});
    renderPreview(uploaded);
  };

  const renderPreview = async (pdfFile) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const pages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        pages.push({ pageNumber: i, image: canvas.toDataURL("image/png") });
      }

      setPdfPages(pages);
    };

    fileReader.readAsArrayBuffer(pdfFile);
  };

  const rotatePage = (pageNum, value) => {
    setRotations((prev) => ({
      ...prev,
      [pageNum]: ((prev[pageNum] || 0) + value) % 360,
    }));
  };

  const resetPageRotation = (pageNum) => {
    setRotations((prev) => {
      const updated = { ...prev };
      delete updated[pageNum];
      return updated;
    });
  };

  const resetAllRotations = () => setRotations({});

  const applyRotation = async () => {
    const rotationList = Object.entries(rotations).map(([page, degree]) => ({
      page: parseInt(page),
      degree,
    }));

    if (!rotationList.length) {
      alert("No rotation applied!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("rotations", JSON.stringify(rotationList));

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/rotate-pages`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setDownloadURL(url);
    } catch (error) {
      console.error(error);
      alert("Error rotating PDF");
    }

    setProcessing(false);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "rotated.pdf";
    link.click();
  };

  return (
    <div className="mt-10 px-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">Rotate PDF Pages</h1>
      <p className="text-center text-gray-500 mb-6">
        Rotate each page individually, then export final PDF
      </p>

      {/* Upload */}
      <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50 text-center">
        <input
          type="file"
          id="rotatePdf"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <label htmlFor="rotatePdf" className="cursor-pointer">
          <p className="text-lg font-medium">
            {file ? file.name : "Click to Upload PDF"}
          </p>
        </label>
      </div>

      {/* Reset All Button */}
      {Object.keys(rotations).length > 0 && (
        <div className="text-center mt-3">
          <button
            className="px-6 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={resetAllRotations}
          >
            Reset All Rotations
          </button>
        </div>
      )}

      {/* Thumbnails Grid */}
      {pdfPages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {pdfPages.map((pg) => (
            <div
              key={pg.pageNumber}
              className="bg-white shadow-xl p-3 rounded-xl text-center hover:scale-105 transition"
            >
              <img
                src={pg.image}
                alt=""
                className="w-full mx-auto rounded"
                style={{ transform: `rotate(${rotations[pg.pageNumber] || 0}deg)` }}
              />

              <p className="font-medium mt-2">Page {pg.pageNumber}</p>

              <div className="flex justify-center gap-3 mt-2">
                <button
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() => rotatePage(pg.pageNumber, -90)}
                >
                  ↺ Left
                </button>
                <button
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={() => rotatePage(pg.pageNumber, 90)}
                >
                  ↻ Right
                </button>
              </div>

              {rotations[pg.pageNumber] !== undefined && (
                <button
                  className="mt-2 text-red-500 text-xs underline"
                  onClick={() => resetPageRotation(pg.pageNumber)}
                >
                  Reset
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Apply Button */}
      {pdfPages.length > 0 && !processing && !downloadURL && (
        <div className="text-center mt-10">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={applyRotation}
          >
            Save Rotated PDF
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
        <div className="text-center mt-10">
          <button
            className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={downloadPDF}
          >
            Download Rotated PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default RotatePdfPreview;
