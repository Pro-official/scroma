import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CanvasToolbar, ImageMetadata } from "@/components/canvas/canvas-toolbar";

describe("CanvasToolbar", () => {
  const mockOnToggleGrid = vi.fn();

  const defaultProps = {
    zoom: 1,
    panX: 100,
    panY: 50,
    showGrid: true,
    onToggleGrid: mockOnToggleGrid,
  };

  const mockImageMetadata: ImageMetadata = {
    width: 1920,
    height: 1080,
    format: "PNG",
    size: 1024000, // 1MB
    name: "test-image.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without image metadata", () => {
    render(<CanvasToolbar {...defaultProps} />);
    expect(screen.getByText("No image loaded")).toBeTruthy();
  });

  it("displays image metadata correctly", () => {
    render(<CanvasToolbar {...defaultProps} imageMetadata={mockImageMetadata} />);

    expect(screen.getByText("test-image.png")).toBeTruthy();
    expect(screen.getByText("1920 × 1080px")).toBeTruthy();
    expect(screen.getByText("1000 KB")).toBeTruthy(); // 1024000 bytes = 1000 KB
    expect(screen.getByText("PNG")).toBeTruthy();
  });

  it("formats file size correctly", () => {
    const testCases = [
      { size: 500, expected: "500 Bytes" },
      { size: 1024, expected: "1 KB" },
      { size: 1536, expected: "1.5 KB" },
      { size: 1048576, expected: "1 MB" },
      { size: 5242880, expected: "5 MB" },
    ];

    testCases.forEach(({ size, expected }) => {
      const metadata = { ...mockImageMetadata, size };
      const { rerender } = render(<CanvasToolbar {...defaultProps} imageMetadata={metadata} />);
      expect(screen.getByText(expected)).toBeTruthy();
      rerender(<CanvasToolbar {...defaultProps} />);
    });
  });

  it("displays zoom percentage", () => {
    render(<CanvasToolbar {...defaultProps} zoom={1.5} />);
    expect(screen.getByText("Zoom: 150%")).toBeTruthy();
  });

  it("displays pan coordinates", () => {
    render(<CanvasToolbar {...defaultProps} panX={123.456} panY={78.901} />);
    expect(screen.getByText("X: 123, Y: 79")).toBeTruthy();
  });

  it("toggles grid visibility", () => {
    const { rerender } = render(<CanvasToolbar {...defaultProps} showGrid={true} />);

    const toggleButton = screen.getByRole("button", { name: /grid/i });
    expect(screen.getByText("Hide Grid")).toBeTruthy();

    fireEvent.click(toggleButton);
    expect(mockOnToggleGrid).toHaveBeenCalled();

    rerender(<CanvasToolbar {...defaultProps} showGrid={false} />);
    expect(screen.getByText("Show Grid")).toBeTruthy();
  });

  it("displays FPS counter when enabled", () => {
    render(<CanvasToolbar {...defaultProps} showFPS={true} currentFPS={60} />);
    expect(screen.getByText("60 FPS")).toBeTruthy();
  });

  it("applies correct FPS color coding", () => {
    const { rerender } = render(<CanvasToolbar {...defaultProps} showFPS={true} currentFPS={60} />);
    let fpsElement = screen.getByText("60 FPS");
    expect(fpsElement.className).toContain("text-green-600");

    rerender(<CanvasToolbar {...defaultProps} showFPS={true} currentFPS={45} />);
    fpsElement = screen.getByText("45 FPS");
    expect(fpsElement.className).toContain("text-yellow-600");

    rerender(<CanvasToolbar {...defaultProps} showFPS={true} currentFPS={20} />);
    fpsElement = screen.getByText("20 FPS");
    expect(fpsElement.className).toContain("text-red-600");
  });

  it("does not display FPS counter when disabled", () => {
    render(<CanvasToolbar {...defaultProps} showFPS={false} currentFPS={60} />);
    expect(screen.queryByText("60 FPS")).toBeNull();
  });

  it("rounds zoom percentage correctly", () => {
    const testCases = [
      { zoom: 0.334, expected: "Zoom: 33%" },
      { zoom: 0.666, expected: "Zoom: 67%" },
      { zoom: 1.234, expected: "Zoom: 123%" },
      { zoom: 2.567, expected: "Zoom: 257%" },
    ];

    testCases.forEach(({ zoom, expected }) => {
      const { rerender } = render(<CanvasToolbar {...defaultProps} zoom={zoom} />);
      expect(screen.getByText(expected)).toBeTruthy();
      rerender(<CanvasToolbar {...defaultProps} />);
    });
  });

  it("rounds pan coordinates correctly", () => {
    const testCases = [
      { panX: 10.4, panY: 20.4, expected: "X: 10, Y: 20" },
      { panX: 10.5, panY: 20.5, expected: "X: 11, Y: 21" },
      { panX: -15.6, panY: -25.3, expected: "X: -16, Y: -25" },
    ];

    testCases.forEach(({ panX, panY, expected }) => {
      const { rerender } = render(<CanvasToolbar {...defaultProps} panX={panX} panY={panY} />);
      expect(screen.getByText(expected)).toBeTruthy();
      rerender(<CanvasToolbar {...defaultProps} />);
    });
  });
});
