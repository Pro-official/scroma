"use client";

import { useState, useCallback, useRef, DragEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DragDropHandlerProps {
  children: ReactNode;
  onFileDrop: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export function DragDropHandler({
  children,
  onFileDrop,
  disabled = false,
  className,
}: DragDropHandlerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      dragCounterRef.current++;

      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        const hasFiles = Array.from(e.dataTransfer.items).some((item) => item.kind === "file");
        if (hasFiles) {
          setIsDragging(true);
        }
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      dragCounterRef.current = 0;

      if (disabled) return;

      const files: File[] = [];

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach((file) => {
          if (file.type.startsWith("image/")) {
            files.push(file);
          }
        });
      } else if (e.dataTransfer.items) {
        Array.from(e.dataTransfer.items).forEach((item) => {
          if (item.kind === "file" && item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              files.push(file);
            }
          }
        });
      }

      if (files.length > 0) {
        onFileDrop(files);
      }
    },
    [onFileDrop, disabled]
  );

  return (
    <div
      className={cn(className, isDragging && "drag-active")}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {isDragging && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card border-2 border-primary border-dashed rounded-lg p-8 shadow-2xl">
              <p className="text-xl font-semibold text-primary">Drop your files here</p>
              <p className="text-sm text-muted-foreground mt-2">Release to upload</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
