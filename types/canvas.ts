export interface CanvasElement {
  id: string;
  type: "image" | "text" | "frame";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
}

export interface ImageElement extends CanvasElement {
  type: "image";
  src: string;
  originalWidth: number;
  originalHeight: number;
  filters?: ImageFilters;
}

export interface ImageFilters {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
}

export interface TextElement extends CanvasElement {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: "left" | "center" | "right";
  lineHeight: number;
}

export interface FrameElement extends CanvasElement {
  type: "frame";
  frameType: string;
  frameColor: string;
  frameShadow?: boolean;
}

export interface CanvasProject {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  elements: CanvasElement[];
  background: CanvasBackground;
  dimensions: CanvasDimensions;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface CanvasBackground {
  type: "solid" | "gradient" | "image" | "pattern";
  value: string | GradientConfig;
}

export interface GradientConfig {
  type: "linear" | "radial";
  angle?: number;
  stops: GradientStop[];
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface ExportOptions {
  format: "png" | "jpg" | "webp";
  quality: number;
  scale: number;
  backgroundColor?: string;
}
