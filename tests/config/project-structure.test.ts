import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Project Structure', () => {
  const rootDir = process.cwd();

  it('should have all required configuration files', () => {
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.ts',
      'tailwind.config.js',
      'eslint.config.mjs',
      '.prettierrc',
      '.gitignore',
      '.lintstagedrc.json',
    ];

    requiredFiles.forEach((file) => {
      const filePath = path.join(rootDir, file);
      expect(fs.existsSync(filePath), `${file} should exist`).toBe(true);
    });
  });

  it('should have all required directories', () => {
    const requiredDirs = [
      'app',
      'app/api',
      'app/api/health',
      'components',
      'components/ui',
      'components/canvas',
      'components/upload',
      'components/layout',
      'hooks',
      'lib',
      'stores',
      'types',
      'public',
      'public/frames',
      'public/frames/assets',
      'public/frames/thumbnails',
      'public/frames/previews',
      'tests',
    ];

    requiredDirs.forEach((dir) => {
      const dirPath = path.join(rootDir, dir);
      expect(fs.existsSync(dirPath), `${dir} directory should exist`).toBe(true);
    });
  });

  it('should have TypeScript path aliases configured', () => {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    expect(tsconfig.compilerOptions.paths).toHaveProperty('@/*');
    expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./*']);
  });

  it('should have strict TypeScript configuration', () => {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitAny).toBe(true);
    expect(tsconfig.compilerOptions.strictNullChecks).toBe(true);
  });

  it('should have pre-commit hooks configured', () => {
    const huskyPreCommitPath = path.join(rootDir, '.husky', 'pre-commit');
    expect(fs.existsSync(huskyPreCommitPath)).toBe(true);

    const content = fs.readFileSync(huskyPreCommitPath, 'utf-8');
    expect(content).toContain('lint-staged');
  });
});