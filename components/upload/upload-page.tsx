"use client";

import { useState } from "react";
import { UploadZone } from "./upload-zone";
import { FileProcessor } from "./file-processor";
import { UploadProgress } from "./upload-progress";
import { DragDropHandler } from "./drag-drop-handler";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ProcessedFile } from "@/lib/upload/file-validation";
import { AlertCircle } from "lucide-react";

interface UploadPageProps {
  onImageUploaded?: (imageSrc: string) => void;
}

export function UploadPage({ onImageUploaded }: UploadPageProps = {}) {
  const [error, setError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedFile | null>(null);

  const { uploadFiles, uploadFile, uploadMultiple, cancelUpload, removeFile, clearAll } =
    useFileUpload({
      maxFiles: 5,
      onUploadComplete: (file) => {
        setProcessedImage(file);
        setError(null);
        // Pass the image source to parent component
        if (onImageUploaded && file.src) {
          onImageUploaded(file.src);
        }
      },
      onUploadError: (errorMessage) => {
        setError(errorMessage);
      },
    });

  const handleFileSelect = async (file: File) => {
    setError(null);
    await uploadFile(file);
  };

  const handleMultipleFiles = async (files: File[]) => {
    setError(null);
    await uploadMultiple(files);
  };

  const hasActiveUploads = uploadFiles.some(
    (f) => f.status === "uploading" || f.status === "processing"
  );

  return (
    <div className="min-h-screen bg-background">
      <DragDropHandler
        onFileDrop={handleMultipleFiles}
        disabled={hasActiveUploads}
        className="min-h-screen"
      >
        <FileProcessor onFileSelect={handleFileSelect} enabled={!hasActiveUploads} />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Scroma Upload</h1>
              <p className="text-muted-foreground">
                Create beautiful screenshot mockups in seconds
              </p>
            </div>

            {!processedImage && (
              <UploadZone onFileSelect={handleFileSelect} isUploading={hasActiveUploads} />
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            {uploadFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Upload Queue</h2>
                  {uploadFiles.length > 0 && !hasActiveUploads && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <UploadProgress files={uploadFiles} onCancel={cancelUpload} onRemove={removeFile} />
              </div>
            )}

            {processedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Uploaded Image</h2>
                  <button
                    onClick={() => {
                      setProcessedImage(null);
                      clearAll();
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Upload another
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden bg-card">
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium">{processedImage.name}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>
                        {processedImage.dimensions.width} × {processedImage.dimensions.height}
                      </span>
                      <span>{Math.round(processedImage.size / 1024)} KB</span>
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={processedImage.src}
                    alt={processedImage.name}
                    className="w-full h-auto"
                    style={{ maxHeight: "600px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </DragDropHandler>
    </div>
  );
}
