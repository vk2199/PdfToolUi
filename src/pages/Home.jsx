import React from "react";
import { Link } from "react-router-dom";

const tools = [
  { title: "Merge PDF", icon: "🔁", path: "/merge" },
  { title: "Watermark PDF", icon: "💧", path: "/watermark-single" },
  { title: "Unlock PDF", icon: "🔓", path: "/unlock" },
  { title: "Convert to PDF", icon: "📤", path: "/toPdf" },
  { title: "PDF to Word", icon: "📄➡📝", path: "/toDoc" },
  { title: "Split PDF by Range", icon: "✂", path: "/split-range" },
  { title: "Split by Pages", icon: "📑", path: "/split-pages" },
  { title: "Rotate PDF", icon: "🔄", path: "/rotate" },
  { title: "Reorder Pages", icon: "☰", path: "/reorder" },
  { title: "Remove Pages", icon: "❌", path: "/remove-pages" },
  { title: "Protect PDF", icon: "🔐", path: "/protect" },
  { title: "PDF to Image", icon: "🖼", path: "/pdf-to-image" },
  { title: "Insert Pages", icon: "➕📄", path: "/insert-pages" },
  { title: "Images to PDF", icon: "🖼➡📄", path: "/image-to-pdf" },
  { title: "Compress PDF", icon: "🗜", path: "/compress" },
  { title: "Add Page Numbers", icon: "🔢", path: "/add-page-numbers" },
];

const Home = () => {
  return (
    <div className="px-6 md:px-20 text-center mt-16">

      <h1 className="text-5xl font-extrabold text-blue-700">
        PDF Tools – Everything You Need
      </h1>

      <p className="text-gray-600 mt-3 text-lg">
        Convert, Split, Protect, Edit & Merge PDFs effortlessly 🚀
      </p>

      <h2 className="text-3xl font-bold text-gray-800 mt-14">
        Select a Tool
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 mb-20">
        {tools.map((tool, i) => (
          <Link key={i} to={tool.path}>
            <div className="shadow-lg p-6 border rounded-xl hover:scale-105 transition cursor-pointer bg-white flex flex-col items-center">
              <span className="text-5xl">{tool.icon}</span>
              <h3 className="font-semibold text-lg mt-2">{tool.title}</h3>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Home;
