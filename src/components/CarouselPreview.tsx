'use client';

import { useEffect, useRef, ReactElement } from 'react';
import { Box } from '@mui/material';
import { ImageData, CarouselSettings } from '@/types/carousel';

interface CarouselPreviewProps {
  images: ImageData[];
  settings: CarouselSettings;
  onStartAnimation: (trackElement: HTMLElement | null) => void;
}

export const CarouselPreview = ({ images, settings, onStartAnimation }: CarouselPreviewProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      onStartAnimation(trackRef.current);
    }
  }, [images, settings, onStartAnimation]);

  if (images.length === 0) {
    return null;
  }

  const repeatCount = 20;
  const carouselItems: ReactElement[] = [];

  for (let i = 0; i < repeatCount; i++) {
    images.forEach((image, index) => {
      carouselItems.push(
        <Box
          key={`${i}-${index}`}
          sx={{
            flexShrink: 0,
            height: '100%',
            width: `${settings.width}px`,
            backgroundImage: `url('${image.src}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: 2,
          }}
        />
      );
    });
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        py: 6,
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          height: 300,
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          py: 5,
          mx: 'auto',
        }}
      >
        <Box
          ref={trackRef}
          sx={{
            display: 'flex',
            height: 220,
            alignItems: 'center',
            transition: 'none',
          }}
        >
          {carouselItems}
        </Box>
      </Box>
    </Box>
  );
};
