import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { CanvasViewport } from "@/components/canvas/canvas-viewport";

// Mock canvas context
const mockGetContext = vi.fn();
const mockDrawImage = vi.fn();
const mockClearRect = vi.fn();
const mockFillRect = vi.fn();
const mockSave = vi.fn();
const mockRestore = vi.fn();
const mockScale = vi.fn();
const mockTranslate = vi.fn();

beforeEach(() => {
  mockGetContext.mockReturnValue({
    drawImage: mockDrawImage,
    clearRect: mockClearRect,
    fillRect: mockFillRect,
    save: mockSave,
    restore: mockRestore,
    scale: mockScale,
    translate: mockTranslate,
    fillStyle: "",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
  });

  HTMLCanvasElement.prototype.getContext = mockGetContext;
});

describe("CanvasViewport", () => {
  it("renders canvas element", () => {
    render(<CanvasViewport />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("shows upload prompt when no image", () => {
    render(<CanvasViewport />);
    expect(screen.getByText("Upload an image to get started")).toBeTruthy();
  });

  it("displays error message when image fails to load", async () => {
    // Mock Image constructor to trigger error
    class MockImage {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      src = "";
      width = 0;
      height = 0;
      alt = "";
      crossOrigin: string | null = null;
      naturalWidth = 0;
      naturalHeight = 0;

      constructor() {
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 0);
      }

      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {
        return true;
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    render(<CanvasViewport imageUrl="invalid-url" />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load image")).toBeTruthy();
    });
  });

  it("loads and displays image successfully", async () => {
    // Mock Image constructor to trigger load
    class MockImage {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      src = "";
      width = 800;
      height = 600;
      alt = "";
      crossOrigin: string | null = null;
      naturalWidth = 800;
      naturalHeight = 600;

      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }

      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {
        return true;
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    render(<CanvasViewport imageUrl="test-image.jpg" />);

    await waitFor(() => {
      expect(mockDrawImage).toHaveBeenCalled();
    });
  });

  it("adjusts canvas size on window resize", () => {
    const { container } = render(<CanvasViewport />);
    const canvas = container.querySelector("canvas");

    // Trigger resize event
    window.dispatchEvent(new Event("resize"));

    expect(canvas).toBeTruthy();
    // Canvas should maintain minimum dimensions
    expect(parseInt(canvas!.style.width || "0")).toBeGreaterThanOrEqual(800);
    expect(parseInt(canvas!.style.height || "0")).toBeGreaterThanOrEqual(600);
  });

  it("renders checkerboard background pattern", () => {
    render(<CanvasViewport />);

    // Check that fillRect is called for checkerboard pattern
    expect(mockFillRect).toHaveBeenCalled();
  });

  it("applies zoom and pan transformations", async () => {
    class MockImage {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      src = "";
      width = 800;
      height = 600;
      alt = "";
      crossOrigin: string | null = null;
      naturalWidth = 800;
      naturalHeight = 600;

      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }

      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {
        return true;
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    render(<CanvasViewport imageUrl="test-image.jpg" />);

    await waitFor(() => {
      expect(mockScale).toHaveBeenCalled();
      expect(mockTranslate).toHaveBeenCalled();
    });
  });

  it("calculates fit zoom correctly", async () => {
    class MockImage {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      src = "";
      width = 2000; // Large image
      height = 1500;
      alt = "";
      crossOrigin: string | null = null;
      naturalWidth = 2000;
      naturalHeight = 1500;

      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }

      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {
        return true;
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    render(<CanvasViewport imageUrl="large-image.jpg" />);

    await waitFor(() => {
      // Should scale down large image to fit
      const scaleCall = mockScale.mock.calls.find((call) => call[0] < 1 && call[0] === call[1]);
      expect(scaleCall).toBeTruthy();
    });
  });
});
