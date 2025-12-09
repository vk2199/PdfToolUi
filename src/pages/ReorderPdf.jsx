import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.js";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const ReorderPdf = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [downloadURL, setDownloadURL] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setDownloadURL(null);
    renderPreview(uploaded);
  };

  const renderPreview = async (pdfFile) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      const allPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        allPages.push({
          id: String(i),
          pageNumber: i,
          image: canvas.toDataURL("image/png"),
        });
      }

      setPages(allPages);
    };

    reader.readAsArrayBuffer(pdfFile);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedPages = Array.from(pages);
    const [reorderedItem] = updatedPages.splice(result.source.index, 1);
    updatedPages.splice(result.destination.index, 0, reorderedItem);

    setPages(updatedPages);
  };

  const applyReorder = async () => {
    if (!file || pages.length === 0) return;

    const newOrder = pages.map((p) => p.pageNumber); // Extract page numbers
    const formData = new FormData();
    formData.append("file", file);
    formData.append("order", JSON.stringify(newOrder));

    setProcessing(true);
    setDownloadURL(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdf/reorder`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setDownloadURL(url);
    } catch (error) {
      console.error(error);
      alert("Error reordering PDF");
    }

    setProcessing(false);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "reordered.pdf";
    link.click();
  };

  return (
    <div className="mt-10 px-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Reorder PDF Pages
      </h1>
      <p className="text-center text-gray-500 mb-5">
        Drag pages to change their order
      </p>

      {/* Upload */}
      <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 mt-6 cursor-pointer hover:bg-blue-50 text-center">
        <input
          type="file"
          id="reorderPdf"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
        <label htmlFor="reorderPdf" className="cursor-pointer">
          <p className="text-lg font-medium">
            {file ? file.name : "Click to Upload PDF"}
          </p>
        </label>
      </div>

      {/* Drag Drop Thumbnails */}
      {pages.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pages" direction="horizontal">
            {(provided) => (
              <div
                className="flex overflow-x-auto gap-6 mt-10"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {pages.map((pg, index) => (
                  <Draggable key={pg.id} draggableId={pg.id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-white shadow-lg p-3 rounded-lg w-36 cursor-move text-center hover:scale-105 transition"
                      >
                        <img
                          src={pg.image}
                          alt=""
                          className="rounded w-full"
                        />
                        <p className="font-semibold mt-2 text-sm">
                          Page {pg.pageNumber}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Button */}
      {pages.length > 0 && !processing && !downloadURL && (
        <div className="text-center mt-8">
          <button
            className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={applyReorder}
          >
            Reorder PDF
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
            onClick={downloadPDF}
            className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Reordered PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReorderPdf;
