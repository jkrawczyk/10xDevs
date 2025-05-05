import { afterEach, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Extend Vitest's expect
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface Assertion extends TestingLibraryMatchers<any, void> {}
  }
}

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
    default: vi.fn().mockImplementation(({ src, alt, ...props }) => {
      return { src, alt, ...props };
    }),
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
}); 