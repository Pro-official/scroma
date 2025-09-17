import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Frame Metadata Configuration', () => {
  let metadata: any;

  beforeAll(() => {
    const metadataPath = path.join(process.cwd(), 'public', 'frames', 'metadata.json');
    const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
    metadata = JSON.parse(metadataContent);
  });

  it('should have valid version and lastUpdated', () => {
    expect(metadata).toHaveProperty('version');
    expect(metadata).toHaveProperty('lastUpdated');
    expect(metadata.version).toBe('1.0.0');
  });

  it('should have at least 10 frame assets', () => {
    expect(metadata.frames).toBeDefined();
    expect(Array.isArray(metadata.frames)).toBe(true);
    expect(metadata.frames.length).toBeGreaterThanOrEqual(10);
  });

  it('should have all required frame categories', () => {
    const categories = metadata.frames.map((frame: any) => frame.category);
    expect(categories).toContain('browser');
    expect(categories).toContain('mobile');
    expect(categories).toContain('desktop');
    expect(categories).toContain('custom');
  });

  it('each frame should have required properties', () => {
    metadata.frames.forEach((frame: any) => {
      expect(frame).toHaveProperty('id');
      expect(frame).toHaveProperty('name');
      expect(frame).toHaveProperty('displayName');
      expect(frame).toHaveProperty('category');
      expect(frame).toHaveProperty('assets');
      expect(frame).toHaveProperty('dimensions');
      expect(frame).toHaveProperty('properties');

      // Check assets
      expect(frame.assets).toHaveProperty('thumbnail');
      expect(frame.assets).toHaveProperty('preview');
      expect(frame.assets).toHaveProperty('frame');

      // Check dimensions
      expect(frame.dimensions).toHaveProperty('width');
      expect(frame.dimensions).toHaveProperty('height');
      expect(frame.dimensions).toHaveProperty('contentArea');

      // Check content area
      expect(frame.dimensions.contentArea).toHaveProperty('x');
      expect(frame.dimensions.contentArea).toHaveProperty('y');
      expect(frame.dimensions.contentArea).toHaveProperty('width');
      expect(frame.dimensions.contentArea).toHaveProperty('height');
    });
  });

  it('should have valid SVG frame files', () => {
    metadata.frames.forEach((frame: any) => {
      const framePath = path.join(process.cwd(), 'public', frame.assets.frame.substring(1));
      expect(fs.existsSync(framePath)).toBe(true);
    });
  });
});