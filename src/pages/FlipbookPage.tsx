import { useParams } from "react-router-dom";
import { PowerPointViewer } from "../components/PowerPointViewer";

export function FlipbookPage() {
  const { pageId } = useParams<{ pageId?: string }>();
  
  // Convert pageId to initial slide index (pageId is 1-based, index is 0-based)
  const initialSlide = pageId ? Math.max(0, parseInt(pageId) - 1) : 0;

  return (
    <PowerPointViewer
      fileUrl="/ARKANUH/presentations/arkanuh.pptx"
      initialSlide={initialSlide}
      onSlideChange={(index) => {
        console.log("Slide changed to:", index + 1);
      }}
    />
  );
}
