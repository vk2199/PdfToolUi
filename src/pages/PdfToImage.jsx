import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfToImage = () => {
  const [file, setFile] = useState(null);
  const [previewPages, setPreviewPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    previewPdf(uploaded);
  };

  const previewPdf = async (pdfFile) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      const previews = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.20 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        previews.push(canvas.toDataURL("image/png"));
      }

      setPreviewPages(previews);
    };

    reader.readAsArrayBuffer(pdfFile);
  };

  const convertToImages = async () => {
    const formData = new FormData();
    formData.append("file", file);

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/pdf-to-images`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      setDownloadURL(url);
    } catch (error) {
      alert("Error converting PDF");
    }

    setProcessing(false);
  };

  const downloadZip = () => {
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = "pdf_images.zip";
    a.click();
  };

  return (
    <div className="px-10 mt-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">PDF to Images</h1>
      <p className="text-center text-gray-500 mb-6">Convert every PDF page into PNG image</p>

      <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg mt-6 cursor-pointer hover:bg-blue-50 text-center">
        <input type="file" id="pdfImageUpload" className="hidden" accept=".pdf" onChange={handleFileUpload} />
        <label htmlFor="pdfImageUpload" className="cursor-pointer">
          {file ? file.name : "Click to Upload PDF"}
        </label>
      </div>

      {previewPages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {previewPages.map((img, i) => (
            <img key={i} src={img} className="rounded shadow-md" alt={`preview-${i}`} />
          ))}
        </div>
      )}

      {!processing && previewPages.length > 0 && !downloadURL && (
        <div className="text-center mt-8">
          <button className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={convertToImages}>
            Convert to Images
          </button>
        </div>
      )}

      {processing && (
        <div className="text-center mt-8">
          <div className="w-20 h-20 animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="mt-2">Converting...</p>
        </div>
      )}

      {downloadURL && (
        <div className="text-center mt-8">
          <button onClick={downloadZip} className="px-10 py-3 bg-green-600 text-white rounded hover:bg-green-700">
            Download Images ZIP
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfToImage;
