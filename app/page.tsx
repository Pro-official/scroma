import { CanvasEditor } from "@/components/canvas/canvas-editor";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div>
          <h1 className="text-2xl font-bold">Scroma</h1>
          <p className="text-sm text-gray-600">Screenshot Mockup Tool</p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <CanvasEditor />
      </div>
    </main>
  );
}
