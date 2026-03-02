import { SlideLayerAsset } from "../types/domain";

type LayeredIllustrationProps = {
  layers: SlideLayerAsset[];
  title: string;
};

export function LayeredIllustration({ layers, title }: LayeredIllustrationProps) {
  return (
    <div className="ppt-illustration" role="img" aria-label={`Ilustrasi ${title}`}>
      {layers.map((item, index) => (
        <img
          key={`${item.src}-${index}`}
          src={item.src}
          alt={item.alt}
          className={`ppt-layer ${item.effect ? `is-${item.effect}` : ""}`}
          style={{ zIndex: item.zIndex }}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
    </div>
  );
}
