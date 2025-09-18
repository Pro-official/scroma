"use client";

import { useRef, useCallback, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function UploadZone({ onFileSelect, isUploading = false }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await onFileSelect(files[0]);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer",
        "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50",
        isUploading && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload zone - drag and drop, click to browse, or paste image"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
        aria-label="File input"
      />

      <div className="space-y-4 pointer-events-none">
        <Upload className="mx-auto h-16 w-16 transition-colors text-muted-foreground" />
        <div>
          <p className="text-xl font-semibold">Upload your screenshot</p>
          <p className="text-sm text-muted-foreground mt-2">
            Drag and drop, click to browse, or paste (Ctrl+V)
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span className="px-2 py-1 bg-muted rounded">PNG</span>
            <span className="px-2 py-1 bg-muted rounded">JPG</span>
            <span className="px-2 py-1 bg-muted rounded">WebP</span>
          </div>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
