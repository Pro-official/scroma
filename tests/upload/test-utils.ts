import { vi } from "vitest";

// A minimal valid 1x1 transparent PNG as base64
export const VALID_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

// Convert base64 to blob
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

// Create a valid test image file
export function createValidImageFile(name: string = "test.png", size?: number): File {
  const blob = base64ToBlob(VALID_PNG_BASE64, "image/png");
  const file = new File([blob], name, { type: "image/png" });

  // Override size if specified
  if (size !== undefined) {
    Object.defineProperty(file, "size", { value: size, writable: false });
  }

  return file;
}

// Mock FileReader for tests
export function mockFileReader() {
  const originalFileReader = global.FileReader;

  const MockFileReader = vi.fn(() => ({
    readAsDataURL: vi.fn(function (this: FileReader, file: File) {
      setTimeout(() => {
        if (this.onload) {
          this.onload({
            target: {
              result: `data:${file.type};base64,${VALID_PNG_BASE64}`,
            },
          } as ProgressEvent<FileReader>);
        }
      }, 0);
    }),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  global.FileReader = MockFileReader as unknown as typeof FileReader;

  return () => {
    global.FileReader = originalFileReader;
  };
}

// Mock Image for tests
export function mockImage() {
  const originalImage = global.Image;

  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    width = 100;
    height = 100;

    set src(value: string) {
      // Simulate async image load
      setTimeout(() => {
        if (value && value.startsWith("data:")) {
          if (this.onload) this.onload();
        } else {
          if (this.onerror) this.onerror();
        }
      }, 0);
    }
  }

  global.Image = MockImage as unknown as typeof Image;

  return () => {
    global.Image = originalImage;
  };
}
