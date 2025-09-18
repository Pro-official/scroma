"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CanvasRenderer, Transform, BackgroundPattern } from "@/lib/canvas/canvas-renderer";
import { ZoomControls } from "./zoom-controls";
import { CanvasToolbar, ImageMetadata } from "./canvas-toolbar";
import { useCanvasState } from "@/hooks/use-canvas-state";

interface CanvasEditorProps {
  className?: string;
  onImageLoad?: (metadata: ImageMetadata) => void;
}

export function CanvasEditor({ className, onImageLoad }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fps, setFps] = useState(60);
  const fpsFrameCount = useRef(0);
  const fpsLastTime = useRef(performance.now());

  const { state, imageRef, actions, handlers } = useCanvasState();

  // Initialize canvas renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new CanvasRenderer(canvasRef.current);
    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      const minWidth = 800;
      const minHeight = 600;

      const finalWidth = Math.max(width, minWidth);
      const finalHeight = Math.max(height - 120, minHeight); // Subtract toolbar heights

      rendererRef.current.resize(finalWidth, finalHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render loop
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    let animationId: number;

    const render = () => {
      // FPS calculation
      fpsFrameCount.current++;
      const currentTime = performance.now();
      if (currentTime - fpsLastTime.current >= 1000) {
        setFps(fpsFrameCount.current);
        fpsFrameCount.current = 0;
        fpsLastTime.current = currentTime;
      }

      // Prepare transform
      const transform: Transform = {
        zoom: state.zoom,
        panX: state.panX,
        panY: state.panY,
      };

      // Prepare background pattern
      const background: BackgroundPattern = state.showGrid
        ? { type: "checkerboard", size: 20 }
        : { type: "solid", color: "#f9fafb" };

      // Render frame
      renderer.render(imageRef, transform, background);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [state.zoom, state.panX, state.panY, state.showGrid, imageRef]);

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Create object URL for the image
      const url = URL.createObjectURL(file);
      actions.loadImage(url, file);

      // Notify parent component if needed
      if (onImageLoad && state.imageMetadata) {
        onImageLoad(state.imageMetadata);
      }
    },
    [actions, onImageLoad, state.imageMetadata]
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please drop an image file");
        return;
      }

      const url = URL.createObjectURL(file);
      actions.loadImage(url, file);
    },
    [actions]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Calculate canvas dimensions for fitToScreen
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    actions.fitToScreen(width, height - 120);
  }, [actions]);

  // Canvas cursor style
  const getCursorStyle = () => {
    if (state.isDragging) return "grabbing";
    if (state.isSpacePressed || state.zoom > 1) return "grab";
    return "default";
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Top Toolbar */}
      <CanvasToolbar
        imageMetadata={state.imageMetadata}
        zoom={state.zoom}
        panX={state.panX}
        panY={state.panY}
        showGrid={state.showGrid}
        onToggleGrid={actions.toggleGrid}
        showFPS={process.env.NODE_ENV === "development"}
        currentFPS={fps}
      />

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            touchAction: "none",
            cursor: getCursorStyle(),
          }}
          onMouseDown={handlers.onMouseDown}
          onMouseMove={handlers.onMouseMove}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
          onWheel={(e) => handlers.onWheel(e.nativeEvent)}
        />

        {/* Upload prompt when no image */}
        {!state.imageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">Drop an image here or click to upload</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="pointer-events-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Choose Image
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {state.imageError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-red-500 text-lg">{state.imageError}</p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center p-4 bg-white border-t">
        <ZoomControls
          zoom={state.zoom}
          onZoomChange={actions.setZoom}
          onFitToScreen={handleFitToScreen}
          onResetView={actions.resetView}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      {state.isSpacePressed && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/75 text-white text-sm rounded pointer-events-none">
          Hold Space + Drag to pan
        </div>
      )}
    </div>
  );
}
