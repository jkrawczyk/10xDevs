import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ImageProps } from 'next/image';

// Mock Next.js routing
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    })),
    usePathname: vi.fn().mockReturnValue('/'),
    useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
  };
});

// Mock Next.js Image component
vi.mock('next/image', async () => {
  const actual = await vi.importActual('next/image');
  return {
    ...actual,
    default: vi.fn().mockImplementation(({ src, alt, ...props }: ImageProps) => {
      return { src, alt, ...props };
    }),
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
}); 