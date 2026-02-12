import "@testing-library/jest-dom";
import "whatwg-fetch";

// Polyfill Request/Response for Next.js server components in tests
if (typeof global.Request === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.Request = require("next/dist/compiled/@edge-runtime/primitives/fetch").Request;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.Response = require("next/dist/compiled/@edge-runtime/primitives/fetch").Response;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.Headers = require("next/dist/compiled/@edge-runtime/primitives/fetch").Headers;
}

// Mock window.matchMedia for components using media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});