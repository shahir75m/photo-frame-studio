export interface Frame {
  id: string;
  name: string;
  imageUrl: string; // Base64 or Data URI of the PNG/SVG frame overlay
  aspectRatio: '1:1' | '9:16';
  isDefault?: boolean;
}

export interface PhotoAdjustment {
  zoom: number;
  x: number; // offset X in pixels
  y: number; // offset Y in pixels
  rotation: number; // in degrees
}
