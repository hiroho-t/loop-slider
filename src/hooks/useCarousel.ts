'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CarouselState, ImageData, CarouselSettings } from '@/types/carousel';

export const useCarousel = () => {
  const [state, setState] = useState<CarouselState>({
    images: [],
    settings: { speed: 25, width: 300 },
    isLoading: false,
    error: null,
  });

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const positionRef = useRef<number>(0);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const updateSettings = useCallback((settings: Partial<CarouselSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  }, []);

  const validateImageUrl = useCallback((url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  const loadImageFromUrl = useCallback(async (url: string): Promise<boolean> => {
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setError('URLを入力してください');
      return false;
    }

    if (!validateImageUrl(trimmedUrl)) {
      setError('有効なURLを入力してください');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const timeoutId = setTimeout(() => {
          reject(new Error('画像の読み込みがタイムアウトしました'));
        }, 10000); // 10 second timeout
        
        img.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('画像の読み込みに失敗しました'));
        };
        
        img.src = trimmedUrl;
      });

      const imageData: ImageData = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        src: trimmedUrl,
        name: 'URL画像',
      };

      setState(prev => ({
        ...prev,
        images: [imageData],
        error: null,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '画像の読み込みに失敗しました。URLを確認してください。';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [validateImageUrl, setError, setLoading]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const startAnimation = useCallback((trackElement: HTMLElement | null) => {
    if (!trackElement || state.images.length === 0) return;

    stopAnimation();
    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;

      const duration = (51 - state.settings.speed) * 2000;
      const elapsed = currentTime - startTimeRef.current;
      const progress = (elapsed % duration) / duration;

      positionRef.current = -progress * state.settings.width;
      trackElement.style.transform = `translateX(${positionRef.current}px)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [state.images.length, state.settings.speed, state.settings.width, stopAnimation]);

  const generateEmbedCode = useMemo((): string => {
    if (state.images.length === 0) return '';

    const image = state.images[0];
    const duration = (51 - state.settings.speed) * 2000;

    return `<!DOCTYPE html>
<html>
<head>
<style>
:root { --image-url: url('${image.src}'); }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: transparent; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.carousel { background: transparent; height: 300px; width: 100vw; display: flex; align-items: center; overflow: hidden; }
.track { display: flex; height: 220px; animation: slide ${duration}ms linear infinite; }
.item { flex-shrink: 0; height: 100%; margin: 0; width: ${state.settings.width}px; background-image: var(--image-url); background-size: contain; background-repeat: no-repeat; background-position: center; }
@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-${state.settings.width}px); } }
</style>
</head>
<body>
<div class="carousel">
<div class="track">${Array(20).fill('<div class="item"></div>').join('')}</div>
</div>
</body>
</html>`;
  }, [state.images, state.settings.speed, state.settings.width]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    state,
    loadImageFromUrl,
    updateSettings,
    startAnimation,
    stopAnimation,
    generateEmbedCode,
    setError,
  };
};