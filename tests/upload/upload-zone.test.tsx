import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadZone } from "@/components/upload/upload-zone";
import { createValidImageFile, mockFileReader, mockImage } from "./test-utils";

describe("UploadZone", () => {
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
  it("renders upload instructions", () => {
    const onFileSelect = vi.fn();
    render(<UploadZone onFileSelect={onFileSelect} />);

    expect(screen.getByText("Upload your screenshot")).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop/)).toBeInTheDocument();
    expect(screen.getByText("PNG")).toBeInTheDocument();
    expect(screen.getByText("JPG")).toBeInTheDocument();
    expect(screen.getByText("WebP")).toBeInTheDocument();
    expect(screen.getByText(/Maximum file size: 10MB/)).toBeInTheDocument();
  });

  it("handles file selection via click", async () => {
    const onFileSelect = vi.fn();
    render(<UploadZone onFileSelect={onFileSelect} />);

    const file = createValidImageFile("test.png");
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it("displays upload instructions", () => {
    const onFileSelect = vi.fn();
    render(<UploadZone onFileSelect={onFileSelect} />);

    const dropZone = screen.getByRole("button", { name: /upload zone/i });
    expect(dropZone).toBeInTheDocument();

    // Should show static upload text since drag is handled by parent
    expect(screen.getByText("Upload your screenshot")).toBeInTheDocument();
    expect(screen.queryByText("Drop your screenshot here")).not.toBeInTheDocument();
  });

  it("triggers file selection on click", () => {
    const onFileSelect = vi.fn();
    render(<UploadZone onFileSelect={onFileSelect} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    const dropZone = screen.getByRole("button", { name: /upload zone/i });
    fireEvent.click(dropZone);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("shows uploading state when isUploading is true", () => {
    const onFileSelect = vi.fn();
    render(<UploadZone onFileSelect={onFileSelect} isUploading={true} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("disables input when uploading", () => {
    const onFileSelect = vi.fn();
    render(<UploadZone onFileSelect={onFileSelect} isUploading={true} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
