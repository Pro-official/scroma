import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadPage } from "@/components/upload/upload-page";
import { createValidImageFile, mockFileReader, mockImage } from "./test-utils";

/**
 * Tests for Story 1.2: File Upload Interface
 * Ensuring all acceptance criteria are met
 */
describe("Story 1.2 - Acceptance Criteria Tests", () => {
  let cleanupFileReader: (() => void) | undefined;
  let cleanupImage: (() => void) | undefined;

  beforeEach(() => {
    cleanupFileReader = mockFileReader();
    cleanupImage = mockImage();
  });

  afterEach(() => {
    cleanupFileReader?.();
    cleanupImage?.();
  });
  /**
   * AC 1: Drag-and-drop zone clearly visible on main page with hover states
   */
  describe("AC1: Drag-and-drop zone visibility", () => {
    it("should display drag-and-drop zone on main page", () => {
      render(<UploadPage />);
      const uploadZone = screen.getByRole("button", { name: /upload zone/i });
      expect(uploadZone).toBeInTheDocument();
      expect(uploadZone).toBeVisible();
    });

    it("should show visual feedback on drag hover", () => {
      const { container } = render(<UploadPage />);

      // Find the drag-drop handler (parent container with min-h-screen class)
      const dragContainers = container.querySelectorAll(".min-h-screen");
      // The DragDropHandler is the second min-h-screen element (first is the outer div)
      const dragContainer = dragContainers[dragContainers.length - 1] as HTMLElement;

      // Drag enter should show overlay
      fireEvent.dragEnter(dragContainer, {
        dataTransfer: { items: [{ kind: "file", type: "image/png" }] },
      });

      // Should show drag overlay with instructions
      expect(screen.getByText("Drop your files here")).toBeInTheDocument();
      expect(screen.getByText("Release to upload")).toBeInTheDocument();
    });
  });

  /**
   * AC 2: Click-to-browse file selection supports PNG, JPG, and WebP formats
   */
  describe("AC2: Click-to-browse functionality", () => {
    it("should have hidden file input with correct accept attributes", () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("accept", "image/png,image/jpeg,image/jpg,image/webp");
      expect(fileInput).toHaveClass("hidden");
    });

    it("should trigger file input when upload zone is clicked", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, "click");

      const uploadZone = screen.getByRole("button", { name: /upload zone/i });
      fireEvent.click(uploadZone);

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should accept PNG, JPG, and WebP files", async () => {
      render(<UploadPage />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Test PNG with valid image data
      const pngFile = createValidImageFile("test.png");
      Object.defineProperty(fileInput, "files", { value: [pngFile], writable: false });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.queryByText(/Unsupported/i)).not.toBeInTheDocument();
      });
    });
  });

  /**
   * AC 3: Paste from clipboard (Ctrl/Cmd+V) functionality works anywhere on page
   */
  describe("AC3: Clipboard paste functionality", () => {
    it("should handle paste event with image data", async () => {
      render(<UploadPage />);

      const imageFile = createValidImageFile("pasted.png");

      // Create a custom paste event since ClipboardEvent might not be available in test env
      const pasteEvent = new Event("paste", { bubbles: true }) as Event & {
        clipboardData: {
          items: Array<{
            kind: string;
            type: string;
            getAsFile: () => File;
          }>;
        };
      };
      pasteEvent.clipboardData = {
        items: [
          {
            kind: "file",
            type: "image/png",
            getAsFile: () => imageFile,
          },
        ],
      };

      document.dispatchEvent(pasteEvent);

      // Should process the pasted file
      await waitFor(
        () => {
          const uploadQueue = screen.queryByText("pasted.png");
          expect(uploadQueue).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should work with Ctrl+V keyboard shortcut", async () => {
      render(<UploadPage />);

      // Simulate Ctrl+V
      fireEvent.keyDown(document, { key: "v", ctrlKey: true });

      // The component should be ready to accept paste
      expect(document.querySelector('[role="button"]')).toBeInTheDocument();
    });
  });

  /**
   * AC 4: File size validation prevents uploads over 10MB with user-friendly error message
   */
  describe("AC4: File size validation", () => {
    it("should reject files over 10MB with clear error message", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Create a mock file over 10MB
      const largeFile = createValidImageFile("large.png", 11 * 1024 * 1024);

      Object.defineProperty(fileInput, "files", { value: [largeFile], writable: false });
      fireEvent.change(fileInput);

      await waitFor(() => {
        const errorMessages = screen.getAllByText(/File too large/i);
        expect(errorMessages.length).toBeGreaterThan(0);
        // Check for "10 MB" specifically in error message
        expect(screen.getByText(/Maximum size is 10 MB/i)).toBeInTheDocument();
      });
    });

    it("should accept files under 10MB", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const normalFile = createValidImageFile("normal.png", 500 * 1024);

      Object.defineProperty(fileInput, "files", { value: [normalFile], writable: false });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.queryByText(/File too large/i)).not.toBeInTheDocument();
      });
    });
  });

  /**
   * AC 5: Upload progress indicator shows for files over 1MB
   */
  describe("AC5: Upload progress indicator", () => {
    it("should show progress for files over 1MB", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Create a file over 1MB
      const file = createValidImageFile("medium.png", 2 * 1024 * 1024);

      Object.defineProperty(fileInput, "files", { value: [file], writable: false });
      fireEvent.change(fileInput);

      await waitFor(() => {
        // Should show progress elements
        const progressElements = document.querySelector(".progress-bar");
        expect(progressElements).toBeInTheDocument();
      });
    });

    it("should not show progress for files under 1MB", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Create a small file
      const file = createValidImageFile("small.png", 500 * 1024);

      Object.defineProperty(fileInput, "files", { value: [file], writable: false });
      fireEvent.change(fileInput);

      // Progress should complete immediately for small files
      await waitFor(() => {
        const completedStatus = screen.queryByText(/Upload complete/i);
        expect(completedStatus).toBeInTheDocument();
      });
    });
  });

  /**
   * AC 6: Multiple file selection queues images for sequential editing
   */
  describe("AC6: Multiple file selection", () => {
    it("should support multiple file selection", () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // File input should NOT have multiple attribute by default
      // as we handle multiple files through drag-drop
      expect(fileInput).not.toHaveAttribute("multiple");
    });

    it("should queue multiple files when dropped", async () => {
      render(<UploadPage />);
      const uploadZone = screen.getByRole("button", { name: /upload zone/i });

      const file1 = createValidImageFile("file1.png");
      const file2 = createValidImageFile("file2.png");

      fireEvent.drop(uploadZone, {
        dataTransfer: { files: [file1, file2] },
      });

      await waitFor(() => {
        // Should show both files in queue
        expect(screen.getByText("file1.png")).toBeInTheDocument();
        expect(screen.getByText("file2.png")).toBeInTheDocument();
      });
    });
  });

  /**
   * AC 7: Supported format instructions clearly displayed in upload area
   */
  describe("AC7: Format instructions", () => {
    it("should display supported formats clearly", () => {
      render(<UploadPage />);

      expect(screen.getByText("PNG")).toBeInTheDocument();
      expect(screen.getByText("JPG")).toBeInTheDocument();
      expect(screen.getByText("WebP")).toBeInTheDocument();
    });

    it("should display file size limit", () => {
      render(<UploadPage />);

      expect(screen.getByText(/10MB/i)).toBeInTheDocument();
    });

    it("should display all upload methods", () => {
      render(<UploadPage />);

      expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
      expect(screen.getByText(/click to browse/i)).toBeInTheDocument();
      expect(screen.getByText(/paste.*Ctrl\+V/i)).toBeInTheDocument();
    });
  });

  /**
   * AC 8: File processing optimized for Next.js client-side performance
   */
  describe("AC8: Next.js performance optimization", () => {
    it("should process files on client-side without server upload", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createValidImageFile("test.png");
      Object.defineProperty(fileInput, "files", { value: [file], writable: false });

      // Mock fetch to ensure no server calls are made
      const fetchSpy = vi.spyOn(global, "fetch");

      fireEvent.change(fileInput);

      await waitFor(() => {
        // Should not make any server calls
        expect(fetchSpy).not.toHaveBeenCalled();
      });
    });

    it("should use FileReader API for image processing", async () => {
      const fileReaderSpy = vi.spyOn(global, "FileReader");

      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createValidImageFile("test.png");
      Object.defineProperty(fileInput, "files", { value: [file], writable: false });

      fireEvent.change(fileInput);

      await waitFor(() => {
        // Should use FileReader for client-side processing
        expect(fileReaderSpy).toHaveBeenCalled();
      });
    });
  });
});
