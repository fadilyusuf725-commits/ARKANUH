import { Route, Routes } from "react-router-dom";
import { BiodataPage } from "./pages/BiodataPage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { FinalResultPage } from "./pages/FinalResultPage";
import { FlipbookReaderPage } from "./pages/FlipbookReaderPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PosttestPage } from "./pages/PosttestPage";
import { PretestPage } from "./pages/PretestPage";
import { StartPage } from "./pages/StartPage";

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pretest" element={<PretestPage />} />
        <Route path="/biodata-penulis" element={<BiodataPage />} />
        <Route path="/cp-tp-atp" element={<CurriculumPage />} />
        <Route path="/mulai" element={<StartPage />} />
        <Route path="/flipbook/:pageId" element={<FlipbookReaderPage />} />
        <Route path="/posttest" element={<PosttestPage />} />
        <Route path="/hasil-akhir" element={<FinalResultPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
