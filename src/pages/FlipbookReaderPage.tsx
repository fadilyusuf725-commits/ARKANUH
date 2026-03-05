import { Navigate, useNavigate } from "react-router-dom";
import { FlipbookReader } from "../components/FlipbookReader";
import { totalFlipbookPages } from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

export function FlipbookReaderPage() {
  const navigate = useNavigate();
  const { session, markFlipbookPageCompleted } = useSessionContext();

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  const handlePageChange = (pageId: string, pageIndex: number) => {
    markFlipbookPageCompleted(pageId, totalFlipbookPages);

    // Check if this is the last page
    if (pageIndex === totalFlipbookPages - 1) {
      // After a short delay, go to posttest
      setTimeout(() => {
        navigate("/posttest", { replace: true });
      }, 1000);
    }
  };

  return (
    <main className="page-shell">
      <FlipbookReader 
        onPageChange={handlePageChange}
        autoPlayAudio={true}
      />
    </main>
  );
}
