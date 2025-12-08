import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
        PDFTools
      </h1>

      <div className="space-x-6 text-lg">
        <a href="/" className="hover:text-blue-600">Home</a>
        <a href="/login" className="hover:text-blue-600">Login</a>
        <a 
          href="/signup" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
