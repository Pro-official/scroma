import { ProcessedFile } from "./file-validation";

interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export class OptimizedFileUploadService {
  private static blobUrls: Set<string> = new Set();

  static async processImageWithOptimization(
    file: File,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedFile> {
    const { maxWidth = 4096, maxHeight = 4096, quality = 0.9 } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = async () => {
          try {
            const shouldResize = img.width > maxWidth || img.height > maxHeight;

            if (!shouldResize) {
              const src = event.target?.result as string;
              resolve({
                file,
                src,
                dimensions: { width: img.width, height: img.height },
                size: file.size,
                format: file.type,
                name: file.name,
              });
              return;
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to process image"));
                  return;
                }

                const optimizedFile = new File([blob], file.name, {
                  type: file.type || "image/png",
                });

                const optimizedSrc = URL.createObjectURL(blob);
                this.blobUrls.add(optimizedSrc);

                resolve({
                  file: optimizedFile,
                  src: optimizedSrc,
                  dimensions: { width: canvas.width, height: canvas.height },
                  size: blob.size,
                  format: file.type,
                  name: file.name,
                });
              },
              file.type || "image/png",
              quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error("Invalid or corrupted image file"));
        };

        img.src = event.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  static async generateThumbnail(file: File, maxSize: number = 256): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to generate thumbnail"));
                return;
              }

              const thumbnailUrl = URL.createObjectURL(blob);
              this.blobUrls.add(thumbnailUrl);
              resolve(thumbnailUrl);
            },
            "image/webp",
            0.8
          );
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = event.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  static cleanupBlobUrls(): void {
    this.blobUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.blobUrls.clear();
  }

  static cleanupBlobUrl(url: string): void {
    if (this.blobUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.blobUrls.delete(url);
    }
  }

  static async simulateUploadProgress(
    file: File,
    onProgress: (progress: number) => void
  ): Promise<void> {
    const chunkSize = 64 * 1024; // 64KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    return new Promise((resolve) => {
      const processChunk = () => {
        if (currentChunk >= totalChunks) {
          onProgress(100);
          resolve();
          return;
        }

        currentChunk++;
        const progress = Math.round((currentChunk / totalChunks) * 100);
        onProgress(progress);

        requestAnimationFrame(() => {
          setTimeout(processChunk, 50 + Math.random() * 100);
        });
      };

      processChunk();
    });
  }
}
