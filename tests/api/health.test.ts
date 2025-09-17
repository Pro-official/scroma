import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';
import { NextResponse } from 'next/server';

describe('Health API Endpoint', () => {
  it('should return healthy status', async () => {
    const response = await GET();
    expect(response).toBeInstanceOf(NextResponse);

    const data = await response.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('application', 'Scroma - Screenshot Mockup Tool');
    expect(data).toHaveProperty('timestamp');
  });

  it('should return valid timestamp', async () => {
    const response = await GET();
    const data = await response.json();

    const timestamp = new Date(data.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });
});