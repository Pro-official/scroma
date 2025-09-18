"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM } from "@/components/canvas/zoom-controls";

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  isSpacePressed: boolean;
  showGrid: boolean;
  imageUrl: string | null;
  imageLoaded: boolean;
  imageError: string | null;
  imageMetadata: {
    width: number;
    height: number;
    format: string;
    size: number;
    name: string;
  } | null;
}

interface UseCanvasStateOptions {
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
}

export function useCanvasState(options: UseCanvasStateOptions = {}) {
  const { minZoom = DEFAULT_MIN_ZOOM, maxZoom = DEFAULT_MAX_ZOOM, defaultZoom = 1 } = options;

  const [state, setState] = useState<CanvasState>({
    zoom: defaultZoom,
    panX: 0,
    panY: 0,
    isDragging: false,
    isSpacePressed: false,
    showGrid: true,
    imageUrl: null,
    imageLoaded: false,
    imageError: null,
    imageMetadata: null,
  });

  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Update zoom level
  const setZoom = useCallback(
    (zoom: number) => {
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
      setState((prev) => ({ ...prev, zoom: clampedZoom }));
    },
    [minZoom, maxZoom]
  );

  // Update zoom with center point
  const zoomAtPoint = useCallback(
    (zoom: number, centerX: number, centerY: number) => {
      setState((prev) => {
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
        const scale = clampedZoom / prev.zoom;

        // Adjust pan to keep the point under cursor stationary
        const newPanX = centerX - (centerX - prev.panX) * scale;
        const newPanY = centerY - (centerY - prev.panY) * scale;

        return {
          ...prev,
          zoom: clampedZoom,
          panX: newPanX,
          panY: newPanY,
        };
      });
    },
    [minZoom, maxZoom]
  );

  // Update pan position
  const setPan = useCallback((panX: number, panY: number) => {
    setState((prev) => ({ ...prev, panX, panY }));
  }, []);

  // Toggle grid display
  const toggleGrid = useCallback(() => {
    setState((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  // Reset view to default
  const resetView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: defaultZoom,
      panX: 0,
      panY: 0,
    }));
  }, [defaultZoom]);

  // Fit image to screen
  const fitToScreen = useCallback((canvasWidth: number, canvasHeight: number) => {
    if (!imageRef.current) return;

    const padding = 100;
    const widthRatio = (canvasWidth - padding) / imageRef.current.width;
    const heightRatio = (canvasHeight - padding) / imageRef.current.height;
    const fitZoom = Math.min(widthRatio, heightRatio, 1);

    const scaledWidth = imageRef.current.width * fitZoom;
    const scaledHeight = imageRef.current.height * fitZoom;

    setState((prev) => ({
      ...prev,
      zoom: fitZoom,
      panX: (canvasWidth - scaledWidth) / 2,
      panY: (canvasHeight - scaledHeight) / 2,
    }));
  }, []);

  // Load image
  const loadImage = useCallback((url: string, file?: File) => {
    setState((prev) => ({
      ...prev,
      imageUrl: url,
      imageLoaded: false,
      imageError: null,
    }));

    const img = new Image();

    img.onload = () => {
      imageRef.current = img;

      const metadata = {
        width: img.width,
        height: img.height,
        format: file?.type?.split("/")[1]?.toUpperCase() || "UNKNOWN",
        size: file?.size || 0,
        name: file?.name || "Untitled",
      };

      setState((prev) => ({
        ...prev,
        imageLoaded: true,
        imageError: null,
        imageMetadata: metadata,
      }));
    };

    img.onerror = () => {
      setState((prev) => ({
        ...prev,
        imageLoaded: false,
        imageError: "Failed to load image",
        imageMetadata: null,
      }));
    };

    img.src = url;
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Only start dragging if space is pressed or image is zoomed in
      if (state.isSpacePressed || state.zoom > 1) {
        e.preventDefault();
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          panX: state.panX,
          panY: state.panY,
        };
        setState((prev) => ({ ...prev, isDragging: true }));
      }
    },
    [state.isSpacePressed, state.zoom, state.panX, state.panY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (state.isDragging && dragStartRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        setState((prev) => ({
          ...prev,
          panX: dragStartRef.current!.panX + deltaX,
          panY: dragStartRef.current!.panY + deltaY,
        }));
      }
    },
    [state.isDragging]
  );

  const handleMouseUp = useCallback(() => {
    dragStartRef.current = null;
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    dragStartRef.current = null;
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  // Wheel event handler for zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = state.zoom * delta;

      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;

      zoomAtPoint(newZoom, centerX, centerY);
    },
    [state.zoom, zoomAtPoint]
  );

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar for pan mode
      if (e.code === "Space" && !state.isSpacePressed) {
        e.preventDefault();
        setState((prev) => ({ ...prev, isSpacePressed: true }));
      }

      // Zoom controls
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          setZoom(state.zoom * 1.2);
        } else if (e.key === "-") {
          e.preventDefault();
          setZoom(state.zoom * 0.8);
        } else if (e.key === "0") {
          e.preventDefault();
          resetView();
        }
      }

      // Arrow keys for panning
      const panAmount = 50;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPan(state.panX + panAmount, state.panY);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPan(state.panX - panAmount, state.panY);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPan(state.panX, state.panY + panAmount);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPan(state.panX, state.panY - panAmount);
      }

      // Reset view
      if (e.key === "r" || e.key === "R") {
        resetView();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setState((prev) => ({ ...prev, isSpacePressed: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state.zoom, state.panX, state.panY, state.isSpacePressed, setZoom, setPan, resetView]);

  return {
    state,
    imageRef: imageRef.current,
    actions: {
      setZoom,
      zoomAtPoint,
      setPan,
      toggleGrid,
      resetView,
      fitToScreen,
      loadImage,
    },
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onWheel: handleWheel,
    },
  };
}
