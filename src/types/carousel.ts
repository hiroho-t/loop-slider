export interface ImageData {
  id: string;
  src: string;
  name: string;
}

export interface CarouselSettings {
  speed: number; // 1-50
  width: number; // 100-1000
}

export interface CarouselState {
  images: ImageData[];
  settings: CarouselSettings;
  isLoading: boolean;
  error: string | null;
}

export interface EmbedCodeOptions {
  imageUrl: string;
  width: number;
  speed: number;
}