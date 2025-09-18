"use client";

import { useState } from "react";
import { UploadPage } from "@/components/upload/upload-page";
import { CanvasEditor } from "@/components/canvas/canvas-editor";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Show upload page if no image is uploaded yet
  if (!uploadedImage) {
    return (
      <UploadPage
        onImageUploaded={(imageSrc) => {
          setUploadedImage(imageSrc);
        }}
      />
    );
  }

  // Show canvas editor after image is uploaded
  return (
    <main className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div>
          <h1 className="text-2xl font-bold">Scroma</h1>
          <p className="text-sm text-gray-600">Screenshot Mockup Tool</p>
        </div>
        <button
          onClick={() => setUploadedImage(null)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Upload New Image
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        <CanvasEditor imageSrc={uploadedImage} />
      </div>
    </main>
  );
}
