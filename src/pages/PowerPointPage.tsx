import { PowerPointViewer } from "../components/PowerPointViewer";

export function PowerPointPage() {
  return (
    <PowerPointViewer
      fileUrl="/ARKANUH/presentations/arkanuh.pptx"
      onSlideChange={(index) => {
        console.log("Slide changed to:", index + 1);
      }}
    />
  );
}
