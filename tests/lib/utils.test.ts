import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', {
      'active-class': true,
      'inactive-class': false,
    });
    expect(result).toBe('base-class active-class');
  });

  it('should override Tailwind classes correctly', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['text-lg', 'font-bold'], 'text-red-500');
    expect(result).toBe('text-lg font-bold text-red-500');
  });
});