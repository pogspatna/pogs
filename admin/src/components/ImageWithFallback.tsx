'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  fileId: string;
  alt: string;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fileId,
  alt,
  className,
  onError,
  onLoad
}) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Multiple URL formats to try
  const urlFormats = [
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h200`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/uc?id=${fileId}`,
  ];

  const handleError = () => {
    console.log(`Failed to load image with URL format ${currentUrlIndex + 1}/${urlFormats.length}`);
    
    if (currentUrlIndex < urlFormats.length - 1) {
      // Try next URL format
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      // All formats failed
      setHasError(true);
      onError?.();
    }
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image with URL format ${currentUrlIndex + 1}`);
    onLoad?.();
  };

  if (hasError) {
    return null; // Let parent component show fallback
  }

  return (
    <Image
      src={urlFormats[currentUrlIndex]}
      alt={alt}
      width={300}
      height={200}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default ImageWithFallback; 