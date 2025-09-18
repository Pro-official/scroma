"use client";

import { X, CheckCircle, AlertCircle } from "lucide-react";
import { UploadFile, formatBytes, formatTime, estimateUploadTime } from "@/lib/upload/upload-utils";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface UploadProgressProps {
  files: UploadFile[];
  onCancel?: (fileId: string) => void;
  onRemove?: (fileId: string) => void;
}

export function UploadProgress({ files, onCancel, onRemove }: UploadProgressProps) {
  const [uploadStartTimes, setUploadStartTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    files.forEach((file) => {
      if (file.status === "uploading" && !uploadStartTimes[file.id]) {
        setUploadStartTimes((prev) => ({
          ...prev,
          [file.id]: Date.now(),
        }));
      }
    });
  }, [files, uploadStartTimes]);

  if (files.length === 0) return null;

  const getTimeRemaining = (file: UploadFile): string => {
    if (file.status !== "uploading" || file.progress === 0) return "";
    const startTime = uploadStartTimes[file.id];
    if (!startTime) return "";

    const elapsedTime = Date.now() - startTime;
    const uploadedBytes = (file.size * file.progress) / 100;
    const timeRemaining = estimateUploadTime(file.size, uploadedBytes, elapsedTime);

    return formatTime(timeRemaining);
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "bg-card border rounded-lg p-4 transition-all",
            file.status === "error" && "border-destructive/50 bg-destructive/5"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              </div>

              {file.status === "uploading" && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{file.progress}%</span>
                    {file.progress > 0 && <span>{getTimeRemaining(file)} remaining</span>}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden progress-bar">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out progress-fill"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {file.status === "processing" && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                  <span className="text-xs text-muted-foreground">Processing image...</span>
                </div>
              )}

              {file.status === "error" && file.error && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive">{file.error}</span>
                </div>
              )}

              {file.status === "completed" && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">Upload complete</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {file.status === "uploading" && onCancel && (
                <button
                  onClick={() => onCancel(file.id)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Cancel upload"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {(file.status === "completed" || file.status === "error") && onRemove && (
                <button
                  onClick={() => onRemove(file.id)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Remove from list"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
