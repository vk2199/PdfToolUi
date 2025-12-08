import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MergePdf from "./pages/MergePdf";
import WatermarkPdf from "./pages/WatermarkPdf";
import UnlockPdf from "./pages/UnlockPdf";
import ProtectPdf from "./pages/ProtectPdf";
import SplitRangePdf from "./pages/SplitRangePdf";
import SplitPagesZip from "./pages/SplitPagesZip";
import RotatePdfPreview from "./pages/RotatePdfPreview";
import ReorderPdf from "./pages/ReorderPdf";
import RemovePages from "./pages/RemovePages";
import PdfToImage from "./pages/PdfToImage";
import AddPageNumbers from "./pages/AddPageNumbers";
import ImageToPdf from "./pages/ImageToPdf";
import InsertPages from "./pages/InsertPages";
import CompressPdf from "./pages/CompressPdf";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/merge" element={<MergePdf />} />
        <Route path="/watermark-single" element={<WatermarkPdf />} />
        <Route path="/unlock" element={<UnlockPdf />} />
        <Route path="/protect" element={<ProtectPdf />} />
        <Route path="/split-range" element={<SplitRangePdf />} />
        <Route path="/split-pages" element={<SplitPagesZip />} />
         <Route path="/rotate" element={<RotatePdfPreview />} />
        <Route path="/reorder" element={<ReorderPdf />} />
        <Route path="/remove-pages" element={<RemovePages />} />
        <Route path="/pdf-to-image" element={<PdfToImage />} />
        <Route path="/add-page-numbers" element={<AddPageNumbers />} />
        <Route path="/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/insert-pages" element={<InsertPages />} />
        <Route path="/compress" element={<CompressPdf />} />




      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
