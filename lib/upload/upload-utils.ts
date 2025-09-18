export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  error?: string;
  processedData?: {
    src: string;
    dimensions: { width: number; height: number };
  };
}

export function createUploadFile(file: File): UploadFile {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    progress: 0,
    status: "pending",
  };
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function estimateUploadTime(
  fileSize: number,
  uploadedBytes: number,
  elapsedTime: number
): number {
  if (uploadedBytes === 0 || elapsedTime === 0) return 0;
  const bytesPerMs = uploadedBytes / elapsedTime;
  const remainingBytes = fileSize - uploadedBytes;
  return Math.round(remainingBytes / bytesPerMs / 1000); // Return seconds
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function cleanupBlobUrl(url: string | undefined): void {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
