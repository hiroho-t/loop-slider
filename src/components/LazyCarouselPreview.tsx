'use client';

import dynamic from 'next/dynamic';
import { ImageData, CarouselSettings } from '@/types/carousel';

const CarouselPreview = dynamic(() => 
  import('./CarouselPreview').then(mod => ({ default: mod.CarouselPreview })), {
  loading: () => (
    <div style={{
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '1.2rem'
    }}>
      プレビューを読み込み中...
    </div>
  ),
  ssr: false
});

interface LazyCarouselPreviewProps {
  images: ImageData[];
  settings: CarouselSettings;
  onStartAnimation: (trackElement: HTMLElement | null) => void;
}

export const LazyCarouselPreview = ({ images, settings, onStartAnimation }: LazyCarouselPreviewProps) => {
  // 画像がない場合は何も表示しない（遅延読み込みも不要）
  if (images.length === 0) {
    return null;
  }

  return (
    <CarouselPreview
      images={images}
      settings={settings}
      onStartAnimation={onStartAnimation}
    />
  );
};