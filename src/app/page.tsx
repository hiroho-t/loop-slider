'use client';

import { Box } from '@mui/material';
import { ImageUrlInput } from '@/components/ImageUrlInput';
import { CarouselSettings } from '@/components/CarouselSettings';
import { LazyCarouselPreview } from '@/components/LazyCarouselPreview';
import { EmbedCodeSection } from '@/components/EmbedCodeSection';
import { useCarousel } from '@/hooks/useCarousel';

export default function LoopSliderPage() {
  const { state, loadImageFromUrl, updateSettings, startAnimation, generateEmbedCode } =
    useCarousel();

  const embedCode = generateEmbedCode;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
      }}
    >
      <Box>
        <Box
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* Controls */}
          <Box
            sx={{
              p: 4,
              borderColor: 'divider',
            }}
          >
            <ImageUrlInput
              onLoadImage={loadImageFromUrl}
              isLoading={state.isLoading}
              error={state.error}
            />

            <CarouselSettings settings={state.settings} onSettingsChange={updateSettings} />
          </Box>

          {/* Carousel Preview */}
          <LazyCarouselPreview
            images={state.images}
            settings={state.settings}
            onStartAnimation={startAnimation}
          />

          {/* Embed Code Section */}
          <EmbedCodeSection embedCode={embedCode} />
        </Box>
      </Box>
    </Box>
  );
}
