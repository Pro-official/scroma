export interface Transform {
  zoom: number;
  panX: number;
  panY: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface BackgroundPattern {
  type: "grid" | "checkerboard" | "dots" | "solid";
  color?: string;
  size?: number;
  opacity?: number;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private devicePixelRatio: number;
  private renderQueue: (() => void)[] = [];
  private isRendering = false;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      // In test environment, we might not have a real canvas context
      if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
        console.warn("Canvas context not available in test environment");
        // Create a mock context for testing
        this.ctx = {} as CanvasRenderingContext2D;
        this.devicePixelRatio = 1;
        return;
      }
      throw new Error("Failed to get 2D context from canvas");
    }
    this.ctx = context;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.setupCanvas();
  }

  private setupCanvas() {
    // Skip setup in test environment without proper context
    if (!this.ctx.scale) return;

    const rect = this.canvas.getBoundingClientRect();

    // Handle high-DPI displays for sharp rendering
    this.canvas.width = rect.width * this.devicePixelRatio;
    this.canvas.height = rect.height * this.devicePixelRatio;
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";

    // Scale context to match device pixel ratio
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    // Set default rendering properties
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  }

  public resize(width: number, height: number) {
    // Skip in test environment without proper context
    if (!this.ctx.scale) return;

    this.canvas.width = width * this.devicePixelRatio;
    this.canvas.height = height * this.devicePixelRatio;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";

    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
  }

  public clear() {
    if (!this.ctx.clearRect) return;
    const width = this.canvas.width / this.devicePixelRatio;
    const height = this.canvas.height / this.devicePixelRatio;
    this.ctx.clearRect(0, 0, width, height);
  }

  public renderImage(image: HTMLImageElement, transform: Transform, centerImage = true) {
    this.queueRender(() => {
      if (!this.ctx.save) return;
      this.ctx.save();

      const canvasWidth = this.canvas.width / this.devicePixelRatio;
      const canvasHeight = this.canvas.height / this.devicePixelRatio;

      // Apply transform matrix
      this.ctx.translate(transform.panX, transform.panY);
      this.ctx.scale(transform.zoom, transform.zoom);

      // Calculate position (center image if requested)
      let x = 0;
      let y = 0;

      if (centerImage) {
        // Calculate the base position to center the image
        x = (canvasWidth / transform.zoom - image.width) / 2;
        y = (canvasHeight / transform.zoom - image.height) / 2;

        // Adjust for pan offset
        x -= transform.panX / transform.zoom;
        y -= transform.panY / transform.zoom;
      }

      // Enable image smoothing for better quality
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";

      // Draw the image
      this.ctx.drawImage(image, x, y);

      this.ctx.restore();
    });
  }

  public renderBackground(pattern: BackgroundPattern) {
    if (!this.ctx.save) return;
    const width = this.canvas.width / this.devicePixelRatio;
    const height = this.canvas.height / this.devicePixelRatio;

    switch (pattern.type) {
      case "grid":
        this.renderGridPattern(width, height, pattern);
        break;
      case "checkerboard":
        this.renderCheckerboardPattern(width, height, pattern);
        break;
      case "dots":
        this.renderDotsPattern(width, height, pattern);
        break;
      case "solid":
        this.renderSolidBackground(width, height, pattern);
        break;
    }
  }

  private renderGridPattern(width: number, height: number, pattern: BackgroundPattern) {
    if (!this.ctx.save) return;
    const gridSize = pattern.size || 20;
    const color = pattern.color || "#e5e7eb";
    const opacity = pattern.opacity ?? 1;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(width, y + 0.5);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private renderCheckerboardPattern(width: number, height: number, pattern: BackgroundPattern) {
    if (!this.ctx.save) return;
    const squareSize = pattern.size || 20;
    const colors = [pattern.color || "#ffffff", "#f3f4f6"];
    const opacity = pattern.opacity ?? 1;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;

    for (let y = 0; y < height; y += squareSize) {
      for (let x = 0; x < width; x += squareSize) {
        const colorIndex = (x / squareSize + y / squareSize) % 2;
        this.ctx.fillStyle = colors[colorIndex];
        this.ctx.fillRect(x, y, squareSize, squareSize);
      }
    }

    this.ctx.restore();
  }

  private renderDotsPattern(width: number, height: number, pattern: BackgroundPattern) {
    if (!this.ctx.save) return;
    const dotSize = 2;
    const spacing = pattern.size || 20;
    const color = pattern.color || "#e5e7eb";
    const opacity = pattern.opacity ?? 1;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;

    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }

  private renderSolidBackground(width: number, height: number, pattern: BackgroundPattern) {
    if (!this.ctx.save) return;
    const color = pattern.color || "#f9fafb";
    const opacity = pattern.opacity ?? 1;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }

  private queueRender(renderFn: () => void) {
    this.renderQueue.push(renderFn);

    if (!this.isRendering) {
      this.processRenderQueue();
    }
  }

  private processRenderQueue() {
    if (this.renderQueue.length === 0) {
      this.isRendering = false;
      return;
    }

    this.isRendering = true;

    // Cancel previous animation frame if exists
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      // Process all queued renders
      while (this.renderQueue.length > 0) {
        const renderFn = this.renderQueue.shift();
        if (renderFn) {
          renderFn();
        }
      }

      this.isRendering = false;
      this.animationFrameId = null;
    });
  }

  public render(
    image: HTMLImageElement | null,
    transform: Transform,
    background: BackgroundPattern
  ) {
    this.clear();
    this.renderBackground(background);

    if (image) {
      this.renderImage(image, transform);
    }
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderQueue = [];
    this.isRendering = false;
  }

  // Performance monitoring utilities
  public getCanvasSize(): CanvasSize {
    return {
      width: this.canvas.width / this.devicePixelRatio,
      height: this.canvas.height / this.devicePixelRatio,
    };
  }

  public getDevicePixelRatio(): number {
    return this.devicePixelRatio;
  }

  // Calculate optimal zoom to fit image in canvas
  public calculateFitZoom(imageWidth: number, imageHeight: number, padding = 100): number {
    const canvasSize = this.getCanvasSize();
    const widthRatio = (canvasSize.width - padding) / imageWidth;
    const heightRatio = (canvasSize.height - padding) / imageHeight;
    return Math.min(widthRatio, heightRatio, 1);
  }

  // Calculate pan offsets to center image
  public calculateCenterPosition(
    imageWidth: number,
    imageHeight: number,
    zoom: number
  ): { panX: number; panY: number } {
    const canvasSize = this.getCanvasSize();
    const scaledWidth = imageWidth * zoom;
    const scaledHeight = imageHeight * zoom;

    return {
      panX: (canvasSize.width - scaledWidth) / 2,
      panY: (canvasSize.height - scaledHeight) / 2,
    };
  }
}
