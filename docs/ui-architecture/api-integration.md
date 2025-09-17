# API Integration

Since Scroma is a client-side static application with no backend APIs, our "API integration" focuses on browser APIs and external services:

### Service Template

```typescript
import { ExportFormat, ExportQuality } from "@/types/export";
import { CanvasExportData } from "@/types/canvas";

// Browser API service for file operations
class FileService {
  // File upload handling
  static async uploadFile(file: File): Promise<FileUploadResult> {
    return new Promise((resolve, reject) => {
      // Validate file type and size
      if (!this.isValidImageFile(file)) {
        reject(new Error("Invalid file type. Supported: PNG, JPG, WebP"));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        reject(new Error("File too large. Maximum size: 10MB"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        const image = new Image();

        image.onload = () => {
          resolve({
            src: result,
            originalWidth: image.width,
            originalHeight: image.height,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          });
        };

        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = result;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  // Clipboard operations
  static async pasteFromClipboard(): Promise<FileUploadResult | null> {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const item of clipboardItems) {
        if (item.types.includes("image/png")) {
          const blob = await item.getType("image/png");
          const file = new File([blob], "pasted-image.png", {
            type: "image/png",
          });
          return await this.uploadFile(file);
        }
      }

      return null;
    } catch (error) {
      throw new Error("Clipboard access denied or no image found");
    }
  }

  private static isValidImageFile(file: File): boolean {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    return validTypes.includes(file.type);
  }
}

// Canvas rendering service
class CanvasService {
  private static canvas: HTMLCanvasElement | null = null;
  private static ctx: CanvasRenderingContext2D | null = null;

  static initializeCanvas(width: number, height: number): HTMLCanvasElement {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");

    if (!this.ctx) {
      throw new Error("Failed to get 2D context");
    }

    return this.canvas;
  }

  static async renderToCanvas(
    data: CanvasExportData
  ): Promise<HTMLCanvasElement> {
    if (!this.canvas || !this.ctx) {
      throw new Error("Canvas not initialized");
    }

    // Canvas rendering implementation...

    return this.canvas;
  }

  static async exportToBlob(
    format: ExportFormat,
    quality: ExportQuality = 1.0
  ): Promise<Blob> {
    if (!this.canvas) {
      throw new Error("Canvas not initialized");
    }

    return new Promise((resolve, reject) => {
      this.canvas!.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to export canvas"));
          }
        },
        format === "png" ? "image/png" : "image/jpeg",
        quality
      );
    });
  }
}

export { FileService, CanvasService };
```
