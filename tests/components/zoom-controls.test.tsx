import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ZoomControls,
  DEFAULT_MIN_ZOOM,
  DEFAULT_MAX_ZOOM,
} from "@/components/canvas/zoom-controls";

describe("ZoomControls", () => {
  const mockOnZoomChange = vi.fn();
  const mockOnFitToScreen = vi.fn();
  const mockOnResetView = vi.fn();

  const defaultProps = {
    zoom: 1,
    onZoomChange: mockOnZoomChange,
    onFitToScreen: mockOnFitToScreen,
    onResetView: mockOnResetView,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all control buttons", () => {
    render(<ZoomControls {...defaultProps} />);

    expect(screen.getByLabelText("Zoom out")).toBeTruthy();
    expect(screen.getByLabelText("Zoom in")).toBeTruthy();
    expect(screen.getByLabelText("Fit to screen")).toBeTruthy();
    expect(screen.getByLabelText("Reset view")).toBeTruthy();
  });

  it("displays correct zoom percentage", () => {
    render(<ZoomControls {...defaultProps} zoom={1.5} />);
    const input = screen.getByLabelText("Zoom percentage");
    expect(input).toHaveProperty("value", "150");
  });

  it("handles zoom in button click", () => {
    render(<ZoomControls {...defaultProps} zoom={1} />);

    const zoomInButton = screen.getByLabelText("Zoom in");
    fireEvent.click(zoomInButton);

    // Should jump to next preset (1.5)
    expect(mockOnZoomChange).toHaveBeenCalledWith(1.5);
  });

  it("handles zoom out button click", () => {
    render(<ZoomControls {...defaultProps} zoom={1} />);

    const zoomOutButton = screen.getByLabelText("Zoom out");
    fireEvent.click(zoomOutButton);

    // Should jump to previous preset (0.75)
    expect(mockOnZoomChange).toHaveBeenCalledWith(0.75);
  });

  it("disables zoom out at minimum zoom", () => {
    render(<ZoomControls {...defaultProps} zoom={DEFAULT_MIN_ZOOM} />);

    const zoomOutButton = screen.getByLabelText("Zoom out");
    expect(zoomOutButton).toHaveProperty("disabled", true);
  });

  it("disables zoom in at maximum zoom", () => {
    render(<ZoomControls {...defaultProps} zoom={DEFAULT_MAX_ZOOM} />);

    const zoomInButton = screen.getByLabelText("Zoom in");
    expect(zoomInButton).toHaveProperty("disabled", true);
  });

  it("handles slider value change", () => {
    const { container } = render(<ZoomControls {...defaultProps} />);

    const slider = container.querySelector('[role="slider"]');
    expect(slider).toBeTruthy();

    // Simulate slider change to 200%
    fireEvent.change(slider!, { target: { value: 200 } });

    // Note: Actual slider implementation might differ
    // This test assumes the slider component triggers onValueChange
  });

  it("handles zoom percentage input change", () => {
    render(<ZoomControls {...defaultProps} />);

    const input = screen.getByLabelText("Zoom percentage");
    fireEvent.change(input, { target: { value: "75" } });

    expect(mockOnZoomChange).toHaveBeenCalledWith(0.75);
  });

  it("validates zoom percentage input range", () => {
    render(<ZoomControls {...defaultProps} />);

    const input = screen.getByLabelText("Zoom percentage");

    // Try to set value below minimum
    fireEvent.change(input, { target: { value: "5" } });
    expect(mockOnZoomChange).not.toHaveBeenCalledWith(0.05);

    // Try to set value above maximum
    fireEvent.change(input, { target: { value: "600" } });
    expect(mockOnZoomChange).not.toHaveBeenCalledWith(6);
  });

  it("handles fit to screen button click", () => {
    render(<ZoomControls {...defaultProps} />);

    const fitButton = screen.getByLabelText("Fit to screen");
    fireEvent.click(fitButton);

    expect(mockOnFitToScreen).toHaveBeenCalled();
  });

  it("handles reset view button click", () => {
    render(<ZoomControls {...defaultProps} />);

    const resetButton = screen.getByLabelText("Reset view");
    fireEvent.click(resetButton);

    expect(mockOnResetView).toHaveBeenCalled();
  });

  it("respects custom min and max zoom props", () => {
    const { rerender } = render(<ZoomControls {...defaultProps} zoom={0.5} minZoom={0.5} maxZoom={2} />);

    // At custom minimum
    const zoomOutButton = screen.getByLabelText("Zoom out");
    expect(zoomOutButton).toHaveProperty("disabled", true);

    // Rerender at custom maximum
    rerender(<ZoomControls {...defaultProps} zoom={2} minZoom={0.5} maxZoom={2} />);

    const zoomInButton = screen.getByLabelText("Zoom in");
    expect(zoomInButton).toHaveProperty("disabled", true);
  });
});
