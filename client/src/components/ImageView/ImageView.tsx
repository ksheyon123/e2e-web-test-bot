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

  // URL이 http/https로 시작하는지 확인
  const isHttpUrl = /^https?:\/\//i.test(base64Data);

  // base64 데이터인지 확인 (base64 문자열 패턴 체크)
  const isBase64 = /^[A-Za-z0-9+/=]+$/.test(base64Data);

  let imageSource = base64Data;

  if (!isHttpUrl) {
    if (base64Data.startsWith("data:image/")) {
      imageSource = base64Data;
    } else if (isBase64) {
      imageSource = `data:image/png;base64,${base64Data}`;
    }
  }

  return (
    <div className={`image-view ${className}`}>
      <img src={imageSource} alt={alt} className="image-view__img" />
    </div>
  );
};
