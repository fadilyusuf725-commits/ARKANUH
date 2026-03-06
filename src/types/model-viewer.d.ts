import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        ar?: boolean;
        "camera-controls"?: boolean;
        "camera-target"?: string;
        "camera-orbit"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "field-of-view"?: string;
        "min-field-of-view"?: string;
        "max-field-of-view"?: string;
        "auto-rotate"?: boolean;
        "rotation-per-second"?: string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        exposure?: string;
        "disable-pan"?: boolean;
        "interaction-prompt"?: string;
        loading?: "auto" | "lazy" | "eager";
      };
    }
  }
}
