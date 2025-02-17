import React from "react";
import "./ImageView.css";

interface ImageViewProps {
  base64Data: string;
  alt?: string;
  className?: string;
}

export const ImageView: React.FC<ImageViewProps> = ({
  base64Data,
  alt = "Image",
  className = "",
}) => {
  if (!base64Data) {
    return null;
  }

  // base64Data가 'data:image/' 접두사를 포함하지 않는 경우 추가
  const imageSource = base64Data.startsWith("data:image/")
    ? base64Data
    : `data:image/png;base64,${base64Data}`;

  return (
    <div className={`image-view ${className}`}>
      <img src={imageSource} alt={alt} className="image-view__img" />
    </div>
  );
};
