import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadPage } from "@/components/upload/upload-page";
import { createValidImageFile, mockFileReader, mockImage } from "./test-utils";

describe("Upload Error Handling", () => {
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
  describe("Invalid file formats", () => {
    it("should reject GIF files", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const gifFile = new File(["test"], "animated.gif", { type: "image/gif" });
      Object.defineProperty(fileInput, "files", {
        value: [gifFile],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
      });
    });

    it("should reject BMP files", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const bmpFile = new File(["test"], "image.bmp", { type: "image/bmp" });
      Object.defineProperty(fileInput, "files", {
        value: [bmpFile],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
      });
    });

    it("should reject non-image files", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const textFile = new File(["test"], "document.txt", { type: "text/plain" });
      Object.defineProperty(fileInput, "files", {
        value: [textFile],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
      });
    });
  });

  describe("Empty and corrupted files", () => {
    it("should reject empty files", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const emptyFile = new File([], "empty.png", { type: "image/png" });
      Object.defineProperty(fileInput, "files", {
        value: [emptyFile],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/File is empty/i)).toBeInTheDocument();
      });
    });

    it("should handle FileReader errors gracefully", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader;
      const mockFileReader = vi.fn(() => ({
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onerror) this.onerror(new Event("error") as ProgressEvent<FileReader>);
          }, 0);
        }),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      global.FileReader = mockFileReader as unknown as typeof FileReader;

      const file = createValidImageFile("corrupted.png");
      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Failed to read file/i)).toBeInTheDocument();
      });

      // Restore original FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe("Multiple file handling", () => {
    it("should enforce max file limit", async () => {
      render(<UploadPage />);
      const uploadZone = screen.getByRole("button", { name: /upload zone/i });

      // Create 6 files (max is 5)
      const files = Array.from({ length: 6 }, (_, i) => createValidImageFile(`file${i + 1}.png`));

      fireEvent.drop(uploadZone, {
        dataTransfer: { files },
      });

      await waitFor(() => {
        expect(screen.getByText(/Only 5 more files can be uploaded/i)).toBeInTheDocument();
      });
    });

    it("should handle mixed valid and invalid files", async () => {
      render(<UploadPage />);
      const uploadZone = screen.getByRole("button", { name: /upload zone/i });

      const validFile = createValidImageFile("valid.png");
      const invalidFile = new File(["test"], "invalid.gif", { type: "image/gif" });

      fireEvent.drop(uploadZone, {
        dataTransfer: { files: [validFile, invalidFile] },
      });

      await waitFor(() => {
        // Valid file should be processed
        expect(screen.getByText("valid.png")).toBeInTheDocument();
        // Invalid file should show error
        expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
      });
    });
  });

  describe("Upload cancellation", () => {
    it("should allow cancelling uploads", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createValidImageFile("large.png", 2 * 1024 * 1024);

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        const cancelButton = screen.getByLabelText("Cancel upload");
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(screen.queryByText("large.png")).not.toBeInTheDocument();
      });
    });

    it("should allow removing completed uploads", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createValidImageFile("small.png", 100 * 1024);

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Upload complete/i)).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText("Remove from list");
      fireEvent.click(removeButton);

      await waitFor(() => {
        // The file should be removed from the upload queue
        // But it may still appear in the processed image display
        expect(screen.queryByText(/Upload complete/i)).not.toBeInTheDocument();
        // The upload queue section should not show the file anymore
        const uploadQueue = screen.queryByText("Upload Queue");
        if (uploadQueue) {
          // If there's still an upload queue section, the file shouldn't be in it
          const queueSection = uploadQueue.closest("div");
          if (queueSection) {
            expect(queueSection.textContent).not.toContain("small.png");
          }
        }
      });
    });
  });

  describe("Error recovery", () => {
    it("should clear errors on new upload attempt", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // First upload with error
      const invalidFile = new File(["test"], "invalid.gif", { type: "image/gif" });
      Object.defineProperty(fileInput, "files", {
        value: [invalidFile],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
      });

      // Remove the failed file from the list
      const removeButton = screen.getByLabelText("Remove from list");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText(/Unsupported file format/i)).not.toBeInTheDocument();
      });

      // Second valid upload should work without errors
      const validFile = createValidImageFile("valid.png");
      Object.defineProperty(fileInput, "files", {
        value: [validFile],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText("valid.png")).toBeInTheDocument();
        expect(screen.queryByText(/Unsupported file format/i)).not.toBeInTheDocument();
      });
    });

    it("should allow retry after failure", async () => {
      render(<UploadPage />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Simulate a failed upload
      const file = createValidImageFile("retry.png");
      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });

      // First attempt - mock failure
      const originalFileReader = global.FileReader;
      const mockFileReader = vi.fn(() => ({
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onerror) this.onerror(new Event("error") as ProgressEvent<FileReader>);
          }, 0);
        }),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      global.FileReader = mockFileReader as unknown as typeof FileReader;

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText(/Failed to read file/i)).toBeInTheDocument();
      });

      // Restore and retry
      global.FileReader = originalFileReader;

      // Remove failed file and retry
      const removeButton = screen.getByLabelText("Remove from list");
      fireEvent.click(removeButton);

      // Try again
      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.queryByText(/Failed to read file/i)).not.toBeInTheDocument();
      });
    });
  });
});
