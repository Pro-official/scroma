import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UploadProgress } from "@/components/upload/upload-progress";
import { UploadFile } from "@/lib/upload/upload-utils";
import { createValidImageFile, mockFileReader, mockImage } from "./test-utils";

describe("Upload Progress Tracking", () => {
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
  const createMockFile = (
    name: string,
    size: number,
    status: UploadFile["status"],
    progress = 0
  ): UploadFile => ({
    id: `file-${Date.now()}-${Math.random()}`,
    file: createValidImageFile(name),
    name,
    size,
    progress,
    status,
    error: undefined,
  });

  describe("Progress display", () => {
    it("should display progress percentage", () => {
      const files: UploadFile[] = [createMockFile("test.png", 2 * 1024 * 1024, "uploading", 45)];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("45%")).toBeInTheDocument();
    });

    it("should show progress bar with correct width", () => {
      const files: UploadFile[] = [createMockFile("test.png", 2 * 1024 * 1024, "uploading", 75)];

      render(<UploadProgress files={files} />);

      const progressBar = document.querySelector(".progress-fill") as HTMLElement;
      expect(progressBar).toBeInTheDocument();
      expect(progressBar?.style.width).toBe("75%");
    });

    it("should display file name and size", () => {
      const files: UploadFile[] = [createMockFile("document.png", 1536 * 1024, "uploading", 50)];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("document.png")).toBeInTheDocument();
      expect(screen.getByText("1.5 MB")).toBeInTheDocument();
    });
  });

  describe("Status indicators", () => {
    it("should show uploading status", () => {
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "uploading", 30)];

      render(<UploadProgress files={files} />);

      // Check for progress percentage which indicates uploading
      expect(screen.getByText("30%")).toBeInTheDocument();
    });

    it("should show processing status", () => {
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "processing", 100)];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("Processing image...")).toBeInTheDocument();
    });

    it("should show completed status", () => {
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "completed", 100)];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("Upload complete")).toBeInTheDocument();
    });

    it("should show error status with message", () => {
      const files: UploadFile[] = [
        {
          ...createMockFile("test.png", 1024 * 1024, "error", 0),
          error: "Network connection failed",
        },
      ];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("Network connection failed")).toBeInTheDocument();
    });
  });

  describe("Multiple file progress", () => {
    it("should display multiple files simultaneously", () => {
      const files: UploadFile[] = [
        createMockFile("file1.png", 1024 * 1024, "uploading", 30),
        createMockFile("file2.png", 2048 * 1024, "uploading", 60),
        createMockFile("file3.png", 512 * 1024, "completed", 100),
      ];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("file1.png")).toBeInTheDocument();
      expect(screen.getByText("file2.png")).toBeInTheDocument();
      expect(screen.getByText("file3.png")).toBeInTheDocument();

      expect(screen.getByText("30%")).toBeInTheDocument();
      expect(screen.getByText("60%")).toBeInTheDocument();
    });

    it("should show different statuses for different files", () => {
      const files: UploadFile[] = [
        createMockFile("uploading.png", 1024 * 1024, "uploading", 50),
        createMockFile("processing.png", 1024 * 1024, "processing", 100),
        createMockFile("completed.png", 1024 * 1024, "completed", 100),
        {
          ...createMockFile("failed.png", 1024 * 1024, "error", 0),
          error: "Upload failed",
        },
      ];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("Processing image...")).toBeInTheDocument();
      expect(screen.getByText("Upload complete")).toBeInTheDocument();
      expect(screen.getByText("Upload failed")).toBeInTheDocument();
    });
  });

  describe("User actions", () => {
    it("should call onCancel when cancel button clicked", () => {
      const onCancel = vi.fn();
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "uploading", 30)];

      render(<UploadProgress files={files} onCancel={onCancel} />);

      const cancelButton = screen.getByLabelText("Cancel upload");
      cancelButton.click();

      expect(onCancel).toHaveBeenCalledWith(files[0].id);
    });

    it("should call onRemove when remove button clicked for completed file", () => {
      const onRemove = vi.fn();
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "completed", 100)];

      render(<UploadProgress files={files} onRemove={onRemove} />);

      const removeButton = screen.getByLabelText("Remove from list");
      removeButton.click();

      expect(onRemove).toHaveBeenCalledWith(files[0].id);
    });

    it("should not show cancel button for completed files", () => {
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "completed", 100)];

      render(<UploadProgress files={files} onCancel={vi.fn()} />);

      expect(screen.queryByLabelText("Cancel upload")).not.toBeInTheDocument();
    });

    it("should not show any action buttons when handlers not provided", () => {
      const files: UploadFile[] = [createMockFile("test.png", 1024 * 1024, "uploading", 30)];

      render(<UploadProgress files={files} />);

      expect(screen.queryByLabelText("Cancel upload")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Remove from list")).not.toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("should render nothing when no files", () => {
      const { container } = render(<UploadProgress files={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Time remaining calculation", () => {
    it("should display progress for large files", () => {
      const files: UploadFile[] = [createMockFile("test.png", 10 * 1024 * 1024, "uploading", 45)];

      render(<UploadProgress files={files} />);

      // Should show progress percentage
      expect(screen.getByText("45%")).toBeInTheDocument();
      expect(screen.getByText("test.png")).toBeInTheDocument();
      expect(screen.getByText("10 MB")).toBeInTheDocument();
    });

    it("should not show time remaining at 0% progress", () => {
      const files: UploadFile[] = [createMockFile("test.png", 10 * 1024 * 1024, "uploading", 0)];

      render(<UploadProgress files={files} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.queryByText(/remaining/i)).not.toBeInTheDocument();
    });
  });
});
