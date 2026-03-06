import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { BiodataPage } from "./pages/BiodataPage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { FinalResultPage } from "./pages/FinalResultPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PosttestPage } from "./pages/PosttestPage";
import { PretestPage } from "./pages/PretestPage";
import { StartPage } from "./pages/StartPage";
import { UserGuidePage } from "./pages/UserGuidePage";
import { WelcomePage } from "./pages/WelcomePage";

function LegacyFlipbookRedirect() {
  const { pageId = "1" } = useParams();
  return <Navigate to={`/mulai?page=${pageId}`} replace />;
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu" element={<HomePage />} />
        <Route path="/pretest" element={<PretestPage />} />
        <Route path="/mulai" element={<StartPage />} />
        <Route path="/posttest" element={<PosttestPage />} />
        <Route path="/hasil-akhir" element={<FinalResultPage />} />
        <Route path="/cp-tp-atp" element={<CurriculumPage />} />
        <Route path="/biodata-penulis" element={<BiodataPage />} />
        <Route path="/panduan-penggunaan" element={<UserGuidePage />} />
        <Route path="/beranda" element={<Navigate to="/menu" replace />} />
        <Route path="/flipbook/:pageId" element={<LegacyFlipbookRedirect />} />
        <Route path="/powerpoint" element={<Navigate to="/mulai" replace />} />
        <Route path="/cerita-nabi-nuh" element={<Navigate to="/mulai" replace />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
