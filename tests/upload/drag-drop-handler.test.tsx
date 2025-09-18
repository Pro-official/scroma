import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DragDropHandler } from "@/components/upload/drag-drop-handler";
import { createValidImageFile, mockFileReader, mockImage } from "./test-utils";

describe("DragDropHandler", () => {
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
  it("renders children content", () => {
    const onFileDrop = vi.fn();
    render(
      <DragDropHandler onFileDrop={onFileDrop}>
        <div>Test Content</div>
      </DragDropHandler>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("handles file drop with image files", () => {
    const onFileDrop = vi.fn();
    const { container } = render(
      <DragDropHandler onFileDrop={onFileDrop}>
        <div>Drop Zone</div>
      </DragDropHandler>
    );

    const dropZone = container.firstChild as HTMLElement;
    const imageFile = createValidImageFile("test.png");

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [imageFile],
      },
    });

    expect(onFileDrop).toHaveBeenCalledWith([imageFile]);
  });

  it("filters out non-image files", () => {
    const onFileDrop = vi.fn();
    const { container } = render(
      <DragDropHandler onFileDrop={onFileDrop}>
        <div>Drop Zone</div>
      </DragDropHandler>
    );

    const dropZone = container.firstChild as HTMLElement;
    const imageFile = createValidImageFile("test.png");
    const textFile = new File(["text"], "test.txt", { type: "text/plain" });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [imageFile, textFile],
      },
    });

    expect(onFileDrop).toHaveBeenCalledWith([imageFile]);
  });

  it("shows drag overlay when dragging files", () => {
    const onFileDrop = vi.fn();
    const { container } = render(
      <DragDropHandler onFileDrop={onFileDrop}>
        <div>Drop Zone</div>
      </DragDropHandler>
    );

    const dropZone = container.firstChild as HTMLElement;

    fireEvent.dragEnter(dropZone, {
      dataTransfer: {
        items: [{ kind: "file", type: "image/png" }],
      },
    });

    expect(screen.getByText("Drop your files here")).toBeInTheDocument();
    expect(screen.getByText("Release to upload")).toBeInTheDocument();
  });

  it("does not handle drops when disabled", () => {
    const onFileDrop = vi.fn();
    const { container } = render(
      <DragDropHandler onFileDrop={onFileDrop} disabled={true}>
        <div>Drop Zone</div>
      </DragDropHandler>
    );

    const dropZone = container.firstChild as HTMLElement;
    const imageFile = createValidImageFile("test.png");

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [imageFile],
      },
    });

    expect(onFileDrop).not.toHaveBeenCalled();
  });
});
