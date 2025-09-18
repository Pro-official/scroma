"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CanvasViewportProps {
  imageUrl?: string;
  className?: string;
}

interface ViewportState {
  width: number;
  height: number;
  zoom: number;
  panX: number;
  panY: number;
}

export function CanvasViewport({ imageUrl, className }: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [viewport, setViewport] = useState<ViewportState>({
    width: 1200,
    height: 800,
    zoom: 1,
    panX: 0,
    panY: 0,
  });

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Calculate initial zoom to fit image in viewport
  const calculateFitZoom = useCallback(
    (imageWidth: number, imageHeight: number) => {
      const padding = 100; // Add some padding around the image
      const widthRatio = (viewport.width - padding) / imageWidth;
      const heightRatio = (viewport.height - padding) / imageHeight;
      return Math.min(widthRatio, heightRatio, 1); // Don't zoom in beyond 100%
    },
    [viewport.width, viewport.height]
  );

  // Center image in viewport
  const centerImage = useCallback(
    (imageWidth: number, imageHeight: number, zoom: number) => {
      const scaledWidth = imageWidth * zoom;
      const scaledHeight = imageHeight * zoom;
      const panX = (viewport.width - scaledWidth) / 2;
      const panY = (viewport.height - scaledHeight) / 2;
      return { panX, panY };
    },
    [viewport.width, viewport.height]
  );

  // Load image when URL changes
  useEffect(() => {
    if (!imageUrl) {
      setIsImageLoaded(false);
      setImageError(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setIsImageLoaded(true);
      setImageError(null);

      // Calculate initial zoom and center position
      const fitZoom = calculateFitZoom(img.width, img.height);
      const { panX, panY } = centerImage(img.width, img.height, fitZoom);

      setViewport((prev) => ({
        ...prev,
        zoom: fitZoom,
        panX,
        panY,
      }));
    };

    img.onerror = () => {
      setImageError("Failed to load image");
      setIsImageLoaded(false);
    };

    img.src = imageUrl;
  }, [imageUrl, calculateFitZoom, centerImage]);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      const minWidth = 800;
      const minHeight = 600;

      setViewport((prev) => ({
        ...prev,
        width: Math.max(width, minWidth),
        height: Math.max(height, minHeight),
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const render = () => {
      // Clear canvas
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, viewport.width, viewport.height);

      // Draw background pattern (checkerboard for transparency)
      drawCheckerboardPattern(ctx, viewport.width, viewport.height);

      // Draw image if loaded
      if (isImageLoaded && imageRef.current) {
        ctx.save();

        // Apply transformations
        ctx.translate(viewport.panX, viewport.panY);
        ctx.scale(viewport.zoom, viewport.zoom);

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw the image
        ctx.drawImage(imageRef.current, 0, 0);

        ctx.restore();
      }

      ctx.restore();
    };

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Request new animation frame for 60fps rendering
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewport, isImageLoaded]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden bg-gray-50", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ touchAction: "none" }} />

      {!imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Upload an image to get started</p>
        </div>
      )}

      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-red-500 text-lg">{imageError}</p>
        </div>
      )}
    </div>
  );
}

// Helper function to draw checkerboard pattern
function drawCheckerboardPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const squareSize = 20;
  const colors = ["#ffffff", "#f3f4f6"];

  for (let y = 0; y < height; y += squareSize) {
    for (let x = 0; x < width; x += squareSize) {
      const colorIndex = (x / squareSize + y / squareSize) % 2;
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }
}

// Export viewport state type for external use
export type { ViewportState };
