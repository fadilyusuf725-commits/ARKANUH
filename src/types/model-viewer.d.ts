import type * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "camera-controls"?: boolean | "";
        "disable-pan"?: boolean | "";
        "auto-rotate"?: boolean | "";
        "auto-rotate-delay"?: string;
        "rotation-per-second"?: string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        exposure?: string;
        "interaction-prompt"?: "none" | "auto";
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "interaction" | "manual";
        bounds?: "tight" | "legacy" | string;
        scale?: string;
        "camera-orbit"?: string;
        "camera-target"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "field-of-view"?: string;
        ar?: boolean | "";
        poster?: string;
      };
    }
  }
}

export {};
