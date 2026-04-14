import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

const WelcomePage = lazy(() => import("./pages/WelcomePage").then((module) => ({ default: module.WelcomePage })));
const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const PretestPage = lazy(() => import("./pages/PretestPage").then((module) => ({ default: module.PretestPage })));
const StartPage = lazy(() => import("./pages/StartPage").then((module) => ({ default: module.StartPage })));
const PosttestPage = lazy(() => import("./pages/PosttestPage").then((module) => ({ default: module.PosttestPage })));
const FinalResultPage = lazy(() =>
  import("./pages/FinalResultPage").then((module) => ({ default: module.FinalResultPage }))
);
const CurriculumPage = lazy(() =>
  import("./pages/CurriculumPage").then((module) => ({ default: module.CurriculumPage }))
);
const BiodataPage = lazy(() => import("./pages/BiodataPage").then((module) => ({ default: module.BiodataPage })));
const UserGuidePage = lazy(() =>
  import("./pages/UserGuidePage").then((module) => ({ default: module.UserGuidePage }))
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

function LegacyFlipbookRedirect() {
  const { pageId = "1" } = useParams();
  return <Navigate to={`/mulai?page=${pageId}`} replace />;
}

function RouteLoading() {
  return (
    <main className="page-shell">
      <section className="card route-loading-card" role="status" aria-live="polite">
        <p className="eyebrow">Memuat</p>
        <h1>Menyiapkan halaman ARKANUH...</h1>
        <p className="subtitle">Tunggu sebentar, materi belajar sedang dibuka.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Suspense fallback={<RouteLoading />}>
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
      </Suspense>
    </div>
  );
}
