import '@testing-library/jest-dom';
import axios from 'axios';
import { vi } from 'vitest';
import { toast } from 'react-hot-toast';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })),
});

vi.mock('axios');

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

mockedAxios.get = vi.fn().mockResolvedValue({ data: {}, status: 200 });
mockedAxios.post = vi.fn().mockResolvedValue({ data: {}, status: 200 });
mockedAxios.put = vi.fn().mockResolvedValue({ data: {}, status: 200 });
mockedAxios.patch = vi.fn().mockResolvedValue({ data: {}, status: 200 });
mockedAxios.delete = vi.fn().mockResolvedValue({ data: {}, status: 200 });

afterEach(() => {
  toast.dismiss();
});
