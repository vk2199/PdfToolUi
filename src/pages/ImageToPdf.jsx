import React, { useState } from "react";
import axios from "axios";

const ImageToPdf = () => {
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);
    setDownloadURL(null);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image!");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("files", img.file));

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/images-to-pdf`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = URL.createObjectURL(blob);
      setDownloadURL(link);
    } catch (err) {
      alert("Failed to convert images to PDF");
    }

    setProcessing(false);
  };

  const downloadPDF = () => {
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = "converted.pdf";
    a.click();
    setImages([]);
  };

  return (
    <div className="px-10 mt-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Image to PDF
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Upload images and convert them into a single PDF
      </p>

      {/* Upload */}
      <div
        className="border-2 border-dashed border-blue-400 p-8 rounded-lg mt-6 cursor-pointer text-center hover:bg-blue-50"
      >
        <input
          type="file"
          id="imgUpload"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <label htmlFor="imgUpload" className="cursor-pointer">
          {images.length === 0 ? (
            "Click to Upload Images"
          ) : (
            `${images.length} image(s) selected — Add more`
          )}
        </label>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="shadow rounded-lg p-2 relative bg-white"
            >
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 text-xs hover:bg-red-600"
              >
                ✖
              </button>
              <img
                src={img.url}
                alt=""
                className="rounded h-32 w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Convert Button */}
      {!processing && images.length > 0 && !downloadURL && (
        <div className="text-center mt-8">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={convertToPdf}
          >
            Convert to PDF
          </button>
        </div>
      )}

      {/* Loader */}
      {processing && (
        <div className="text-center mt-8">
          <div className="w-20 h-20 animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
          <p className="mt-3 font-bold">Processing...</p>
        </div>
      )}

      {/* Download Button */}
      {downloadURL && (
        <div className="text-center mt-10">
          <button
            onClick={downloadPDF}
            className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageToPdf;
