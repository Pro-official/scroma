"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grid3X3, EyeOff } from "lucide-react";

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  name: string;
}

interface CanvasToolbarProps {
  imageMetadata?: ImageMetadata | null;
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  onToggleGrid: () => void;
  showFPS?: boolean;
  currentFPS?: number;
  className?: string;
}

export function CanvasToolbar({
  imageMetadata,
  zoom,
  panX,
  panY,
  showGrid,
  onToggleGrid,
  showFPS = false,
  currentFPS = 0,
  className,
}: CanvasToolbarProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatZoom = (zoom: number): string => {
    return `${Math.round(zoom * 100)}%`;
  };

  const formatPosition = (x: number, y: number): string => {
    return `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-2 bg-white border-b",
        className
      )}
    >
      {/* Left side - Image metadata */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {imageMetadata ? (
          <>
            <span className="font-mono">{imageMetadata.name}</span>
            <span className="text-gray-400">•</span>
            <span>
              {imageMetadata.width} × {imageMetadata.height}px
            </span>
            <span className="text-gray-400">•</span>
            <span>{formatFileSize(imageMetadata.size)}</span>
            <span className="text-gray-400">•</span>
            <span className="uppercase">{imageMetadata.format}</span>
          </>
        ) : (
          <span className="text-gray-400">No image loaded</span>
        )}
      </div>

      {/* Center - Canvas status */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-mono text-gray-600">Zoom: {formatZoom(zoom)}</span>
        <span className="text-gray-400">•</span>
        <span className="font-mono text-gray-600">{formatPosition(panX, panY)}</span>
        {showFPS && (
          <>
            <span className="text-gray-400">•</span>
            <span
              className={cn(
                "font-mono",
                currentFPS >= 55
                  ? "text-green-600"
                  : currentFPS >= 30
                    ? "text-yellow-600"
                    : "text-red-600"
              )}
            >
              {Math.round(currentFPS)} FPS
            </span>
          </>
        )}
      </div>

      {/* Right side - Background controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={showGrid ? "default" : "outline"}
          size="sm"
          onClick={onToggleGrid}
          className="h-8"
          title={showGrid ? "Hide background grid" : "Show background grid"}
        >
          {showGrid ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Grid
            </>
          ) : (
            <>
              <Grid3X3 className="h-4 w-4 mr-1" />
              Show Grid
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Export types for external use
export type { ImageMetadata };
