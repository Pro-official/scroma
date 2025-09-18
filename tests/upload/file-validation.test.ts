import { describe, it, expect } from "vitest";
import { FileUploadService } from "@/lib/upload/file-validation";

describe("FileUploadService", () => {
  describe("validateFile", () => {
    it("accepts valid PNG files", () => {
      const file = new File(["test"], "test.png", { type: "image/png" });
      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("accepts valid JPG files", () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("accepts valid WebP files", () => {
      const file = new File(["test"], "test.webp", { type: "image/webp" });
      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects unsupported file formats", () => {
      const file = new File(["test"], "test.gif", { type: "image/gif" });
      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Unsupported file format");
    });

    it("rejects files over 10MB", () => {
      // Create a mock file with size property set to 11MB without actually creating the content
      const file = new File(["test"], "large.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 11 * 1024 * 1024, writable: false });

      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("File too large");
    });

    it("warns for files over 5MB but under 10MB", () => {
      // Create a mock file with size property set to 6MB without actually creating the content
      const file = new File(["test"], "medium.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 6 * 1024 * 1024, writable: false });

      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.warning).toContain("Large file detected");
    });

    it("rejects empty files", () => {
      const file = new File([], "empty.png", { type: "image/png" });
      const result = FileUploadService.validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("File is empty");
    });
  });

  describe("formatFileSize", () => {
    it("formats bytes correctly", () => {
      expect(FileUploadService.formatFileSize(0)).toBe("0 Bytes");
      expect(FileUploadService.formatFileSize(512)).toBe("512 Bytes");
      expect(FileUploadService.formatFileSize(1024)).toBe("1 KB");
      expect(FileUploadService.formatFileSize(1536)).toBe("1.5 KB");
      expect(FileUploadService.formatFileSize(1048576)).toBe("1 MB");
      expect(FileUploadService.formatFileSize(10485760)).toBe("10 MB");
    });
  });
});
