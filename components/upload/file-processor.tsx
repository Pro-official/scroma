"use client";

import { useEffect } from "react";

interface FileProcessorProps {
  onFileSelect: (file: File) => Promise<void>;
  enabled?: boolean;
}

export function FileProcessor({ onFileSelect, enabled = true }: FileProcessorProps) {
  useEffect(() => {
    if (!enabled) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            await onFileSelect(file);
            break;
          }
        }
      }
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        try {
          const clipboardItems = await navigator.clipboard.read();
          for (const item of clipboardItems) {
            const imageTypes = item.types.filter((type) => type.startsWith("image/"));
            if (imageTypes.length > 0) {
              const blob = await item.getType(imageTypes[0]);
              const file = new File([blob], "pasted-image.png", { type: imageTypes[0] });
              await onFileSelect(file);
              break;
            }
          }
        } catch {
          console.log("Clipboard API not available, falling back to paste event");
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onFileSelect, enabled]);

  return null;
}
