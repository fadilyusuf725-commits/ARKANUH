import { PowerPointViewer } from "../components/PowerPointViewer";

export function CeritaNabiNuhPage() {
  return (
    <PowerPointViewer
      fileUrl="/ARKANUH/presentations/cerita-nabi-nuh.pptx"
      initialSlide={0}
      onSlideChange={(index) => {
        console.log("Slide CERITA NABI NUH changed to:", index + 1);
      }}
    />
  );
}
