"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Minus, Plus, Maximize, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  className?: string;
}

const DEFAULT_MIN_ZOOM = 0.1;
const DEFAULT_MAX_ZOOM = 5.0;
const ZOOM_STEP = 0.2;

// Predefined zoom levels for quick jumping
const ZOOM_PRESETS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5];

export function ZoomControls({
  zoom,
  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  onZoomChange,
  onFitToScreen,
  onResetView,
  className,
}: ZoomControlsProps) {
  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    // Find next preset zoom level
    const nextPreset = ZOOM_PRESETS.find((preset) => preset > zoom);
    if (nextPreset && nextPreset <= maxZoom) {
      onZoomChange(nextPreset);
    } else {
      const newZoom = Math.min(maxZoom, zoom + ZOOM_STEP);
      onZoomChange(newZoom);
    }
  };

  const handleZoomOut = () => {
    // Find previous preset zoom level
    const prevPreset = [...ZOOM_PRESETS].reverse().find((preset) => preset < zoom);
    if (prevPreset && prevPreset >= minZoom) {
      onZoomChange(prevPreset);
    } else {
      const newZoom = Math.max(minZoom, zoom - ZOOM_STEP);
      onZoomChange(newZoom);
    }
  };

  const handleSliderChange = (value: number[]) => {
    onZoomChange(value[0] / 100);
  };

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minZoom * 100 && value <= maxZoom * 100) {
      onZoomChange(value / 100);
    }
  };

  return (
    <div
      className={cn("flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border", className)}
    >
      {/* Zoom Out Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        aria-label="Zoom out"
        className="h-8 w-8 p-0"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Zoom Slider */}
      <Slider
        value={[zoomPercentage]}
        onValueChange={handleSliderChange}
        min={minZoom * 100}
        max={maxZoom * 100}
        step={1}
        className="w-32"
        aria-label="Zoom level"
      />

      {/* Zoom In Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="Zoom in"
        className="h-8 w-8 p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Zoom Percentage Display/Input */}
      <div className="flex items-center gap-0.5">
        <input
          type="number"
          value={zoomPercentage}
          onChange={handleZoomInputChange}
          className="w-12 text-sm text-center font-mono border-0 outline-none focus:ring-1 focus:ring-primary rounded px-1"
          min={minZoom * 100}
          max={maxZoom * 100}
          aria-label="Zoom percentage"
        />
        <span className="text-sm font-mono">%</span>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200" />

      {/* Fit to Screen Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFitToScreen}
        aria-label="Fit to screen"
        className="h-8 w-8 p-0"
        title="Fit to screen"
      >
        <Maximize className="h-4 w-4" />
      </Button>

      {/* Reset View Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onResetView}
        aria-label="Reset view"
        className="h-8 w-8 p-0"
        title="Reset view (100% zoom, centered)"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Export preset zoom levels for external use
export { ZOOM_PRESETS, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM };
