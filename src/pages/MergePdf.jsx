import React, { useState } from "react";
import axios from "axios";
import { DndContext, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaFilePdf } from "react-icons/fa";

const MAX_FILES = 10;
const MAX_TOTAL_SIZE_MB = 25;

// Sortable Item Component
const SortableItem = ({ file, index, removeFile }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const maxLength = 22;
  const shortName =
    file.name.length > maxLength ? file.name.substring(0, maxLength) + "..." : file.name;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="py-2 border-b flex justify-between items-center"
    >
      <span {...attributes} {...listeners} className="cursor-grab text-gray-600 mr-3">☰</span>

      <span className="w-2/3 flex items-center gap-2 text-left overflow-hidden" title={file.name}>
        <FaFilePdf size={18} className="text-red-500" /> {shortName}
      </span>

      <span className="text-gray-500 text-sm w-24 text-right">
        {(file.size / 1024).toFixed(1)} KB
      </span>

      <button
        className="text-red-500 text-sm hover:text-red-700 ml-3"
        onClick={() => removeFile(file.name)}
      >
        ❌
      </button>
    </li>
  );
};

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const totalSizeKB = files.reduce((sum, file) => sum + file.size, 0) / 1024;
  const totalSizeMB = (totalSizeKB / 1024).toFixed(2);

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    if (files.length + uploaded.length > MAX_FILES) {
      alert(`⚠ Max ${MAX_FILES} files allowed`);
      return;
    }
    setFiles((prev) => [...prev, ...uploaded]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    if (files.length + dropped.length > MAX_FILES) {
      alert(`⚠ Max ${MAX_FILES} files allowed`);
      return;
    }
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (name) => setFiles(files.filter((file) => file.name !== name));

  const clearAll = () => setFiles([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((f, i) => active.id === f.name + i);
    const newIndex = files.findIndex((f, i) => over.id === f.name + i);

    setFiles((items) => arrayMove(items, oldIndex, newIndex));
  };

  const startMerging = async () => {
    if (files.length < 2) return;

    setMerging(true);
    setProgress(0);
    setDownloadURL(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pdf/merge`,
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
      alert("❌ Error merging PDF");
      console.log(error);
    }

    setMerging(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "merged.pdf";
    link.click();
  };

  return (
    <div className="px-6 md:px-20 text-center mt-10">

      <h1 className="text-4xl font-bold text-blue-600">Merge PDF Files</h1>
      <p className="text-gray-600">Upload, reorder & merge PDFs</p>

      {/* Drag + Click Upload */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-blue-400 rounded-lg p-10 mt-10 hover:bg-blue-50 cursor-pointer"
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          id="uploadPDFs"
          onChange={handleFileUpload}
        />

        <label htmlFor="uploadPDFs">
          <p className="text-xl font-semibold text-gray-700">Drag & Drop PDFs Here</p>
          <p className="text-gray-500">or Click to Browse</p>
          <p className="text-gray-400 text-xs">Max {MAX_FILES} files • Max {MAX_TOTAL_SIZE_MB}MB</p>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 w-full md:w-1/2 mx-auto bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">
            Files ({files.length}) — Total: {totalSizeMB} MB
          </h3>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map((f, i) => f.name + i)} strategy={verticalListSortingStrategy}>
              <ul>
                {files.map((file, index) => (
                  <SortableItem key={file.name + index} file={file} index={index} removeFile={removeFile} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <button className="mt-3 text-red-600 hover:underline" onClick={clearAll}>
            Clear All Files
          </button>
        </div>
      )}

      {/* Warnings */}
      {files.length === 1 && (
        <p className="mt-4 text-yellow-700 bg-yellow-100 px-4 py-2 inline-block rounded-lg">
          Upload at least one more file to merge
        </p>
      )}

      {/* Merge Button */}
      {!merging && files.length > 1 && !downloadURL && (
        <button
          className="mt-6 px-10 py-3 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700"
          onClick={startMerging}
        >
          Merge PDFs
        </button>
      )}

      {/* Progress Loader */}
      {merging && (
        <div className="mt-10">
          <div className="mx-auto w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="font-bold text-xl mt-3">{progress}%</p>
        </div>
      )}

      {/* Download Button */}
      {downloadURL && (
        <div className="mt-8">
          <h3 className="font-bold text-green-600 text-xl">Merge Complete!</h3>
          <button
            onClick={handleDownload}
            className="mt-4 px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Merged PDF
          </button>
        </div>
      )}

    </div>
  );
};

export default MergePdf;
