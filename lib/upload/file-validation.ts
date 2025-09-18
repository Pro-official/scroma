export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export interface ProcessedFile {
  file: File;
  src: string;
  dimensions: { width: number; height: number };
  size: number;
  format: string;
  name: string;
}

export class FileUploadService {
  static readonly SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  static readonly SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly WARNING_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  static validateFile(file: File): FileValidationResult {
    if (!file) {
      return {
        isValid: false,
        error: "No file provided",
      };
    }

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if (!this.SUPPORTED_EXTENSIONS.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Unsupported file format. Please use PNG, JPG, or WebP files.`,
      };
    }

    if (!this.SUPPORTED_FORMATS.includes(file.type) && file.type !== "") {
      return {
        isValid: false,
        error: `Unsupported file type. Please use PNG, JPG, or WebP files.`,
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${this.formatFileSize(this.MAX_FILE_SIZE)}.`,
      };
    }

    if (file.size > this.WARNING_FILE_SIZE) {
      return {
        isValid: true,
        warning: `Large file detected (${this.formatFileSize(file.size)}). Processing may take longer.`,
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        error: "File is empty",
      };
    }

    return { isValid: true };
  }

  static async processFile(file: File): Promise<ProcessedFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();

        img.onload = () => {
          resolve({
            file,
            src,
            dimensions: { width: img.width, height: img.height },
            size: file.size,
            format: file.type || this.getFileTypeFromExtension(file.name),
            name: file.name,
          });
        };

        img.onerror = () => {
          reject(new Error("Invalid or corrupted image file"));
        };

        img.src = src;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      try {
        reader.readAsDataURL(file);
      } catch {
        reject(new Error("Failed to process file"));
      }
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  private static getFileTypeFromExtension(filename: string): string {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
    switch (extension) {
      case ".png":
        return "image/png";
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      case ".webp":
        return "image/webp";
      default:
        return "";
    }
  }
}
