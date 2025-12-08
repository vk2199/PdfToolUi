import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">PDFTools</h2>
          <p className="mt-2 text-sm">
            The ultimate toolkit for editing, converting, protecting & managing PDFs.
            100% Free — Fast — Secure — No Signup Required.
          </p>
          <span className="mt-4 inline-block bg-green-600 px-3 py-1 rounded-full text-white text-xs">
            Made in India 🇮🇳
          </span>
        </div>

        {/* Tools */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Tools</h3>
          <ul className="space-y-1 text-sm">
            <li>Merge PDF</li>
            <li>Split PDF</li>
            <li>Compress PDF</li>
            <li>Protect PDF</li>
            <li>Unlock PDF</li>
            <li>PDF to Image</li>
            <li>Image to PDF</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
          <ul className="space-y-1 text-sm">
            <li>Help Center</li>
            <li>Contact Support</li>
            <li>Report Issue</li>
            <li>API Documentation</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6">

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-xl mb-4">
          <FaFacebook className="cursor-pointer hover:text-white" />
          <FaTwitter className="cursor-pointer hover:text-white" />
          <FaLinkedin className="cursor-pointer hover:text-white" />
          <FaGithub className="cursor-pointer hover:text-white" />
          <FaYoutube className="cursor-pointer hover:text-white" />
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} PDFTools. All Rights Reserved. Built with ❤️ using React & Spring Boot.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
