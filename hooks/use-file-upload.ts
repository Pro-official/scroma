"use client";

import { useState, useCallback, useRef } from "react";
import { FileUploadService, ProcessedFile } from "@/lib/upload/file-validation";
import { OptimizedFileUploadService } from "@/lib/upload/file-upload-service";
import { UploadFile, createUploadFile } from "@/lib/upload/upload-utils";

interface UseFileUploadOptions {
  maxFiles?: number;
  onUploadComplete?: (file: ProcessedFile) => void;
  onUploadError?: (error: string, file?: File) => void;
  autoProcess?: boolean;
}

interface UseFileUploadReturn {
  uploadFiles: UploadFile[];
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  uploadMultiple: (files: File[]) => Promise<void>;
  cancelUpload: (fileId: string) => void;
  removeFile: (fileId: string) => void;
  clearAll: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { maxFiles = 10, onUploadComplete, onUploadError, autoProcess = true } = options;

  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const updateFileStatus = useCallback((fileId: string, updates: Partial<UploadFile>) => {
    setUploadFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f)));
  }, []);

  const processFile = useCallback(
    async (uploadFile: UploadFile) => {
      const abortController = new AbortController();
      abortControllersRef.current.set(uploadFile.id, abortController);

      try {
        updateFileStatus(uploadFile.id, { status: "uploading", progress: 0 });

        const validationResult = FileUploadService.validateFile(uploadFile.file);

        if (!validationResult.isValid) {
          throw new Error(validationResult.error || "Invalid file");
        }

        if (uploadFile.file.size > 1024 * 1024) {
          await OptimizedFileUploadService.simulateUploadProgress(uploadFile.file, (progress) => {
            if (!abortController.signal.aborted) {
              updateFileStatus(uploadFile.id, { progress });
            }
          });
        } else {
          updateFileStatus(uploadFile.id, { progress: 100 });
        }

        if (abortController.signal.aborted) {
          throw new Error("Upload cancelled");
        }

        updateFileStatus(uploadFile.id, { status: "processing", progress: 100 });

        const processedFile = await OptimizedFileUploadService.processImageWithOptimization(
          uploadFile.file
        );

        if (abortController.signal.aborted) {
          throw new Error("Upload cancelled");
        }

        updateFileStatus(uploadFile.id, {
          status: "completed",
          processedData: {
            src: processedFile.src,
            dimensions: processedFile.dimensions,
          },
        });

        if (onUploadComplete) {
          onUploadComplete(processedFile);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";

        if (errorMessage !== "Upload cancelled") {
          updateFileStatus(uploadFile.id, {
            status: "error",
            error: errorMessage,
          });

          // Don't call onUploadError for individual file errors
          // as they're already shown in the file status
        }
      } finally {
        abortControllersRef.current.delete(uploadFile.id);
      }
    },
    [updateFileStatus, onUploadComplete]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      if (uploadFiles.length >= maxFiles) {
        if (onUploadError) {
          onUploadError(`Maximum ${maxFiles} files allowed`, file);
        }
        return;
      }

      const uploadFile = createUploadFile(file);
      setUploadFiles((prev) => [...prev, uploadFile]);

      if (autoProcess) {
        setIsUploading(true);
        await processFile(uploadFile);
        setIsUploading(false);
      }
    },
    [uploadFiles.length, maxFiles, autoProcess, processFile, onUploadError]
  );

  const uploadMultiple = useCallback(
    async (files: File[]) => {
      const remainingSlots = maxFiles - uploadFiles.length;
      const filesToUpload = files.slice(0, remainingSlots);

      if (files.length > remainingSlots && onUploadError) {
        onUploadError(`Only ${remainingSlots} more files can be uploaded`);
      }

      const newUploadFiles = filesToUpload.map(createUploadFile);
      setUploadFiles((prev) => [...prev, ...newUploadFiles]);

      if (autoProcess) {
        setIsUploading(true);
        await Promise.all(newUploadFiles.map((f) => processFile(f)));
        setIsUploading(false);
      }
    },
    [uploadFiles.length, maxFiles, autoProcess, processFile, onUploadError]
  );

  const cancelUpload = useCallback((fileId: string) => {
    const controller = abortControllersRef.current.get(fileId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(fileId);
    }
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const removeFile = useCallback(
    (fileId: string) => {
      const file = uploadFiles.find((f) => f.id === fileId);
      if (file?.processedData?.src) {
        OptimizedFileUploadService.cleanupBlobUrl(file.processedData.src);
      }
      setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
    },
    [uploadFiles]
  );

  const clearAll = useCallback(() => {
    abortControllersRef.current.forEach((controller) => controller.abort());
    abortControllersRef.current.clear();
    OptimizedFileUploadService.cleanupBlobUrls();
    setUploadFiles([]);
  }, []);

  return {
    uploadFiles,
    isUploading,
    uploadFile,
    uploadMultiple,
    cancelUpload,
    removeFile,
    clearAll,
  };
}
