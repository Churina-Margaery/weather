import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

describe('createAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should create axios instance with timeout and baseURL and register response interceptor', async () => {
    const useMock = vi.fn();

    const apiMock = {
      interceptors: {
        response: {
          use: useMock,
        },
      },
    };

    const createMock = vi.spyOn(axios, 'create').mockReturnValue(apiMock as any);

    const { createAPI } = await import('./api');
    const api = createAPI();

    expect(createMock).toHaveBeenCalledTimes(1);

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        timeout: 5000,
      })
    );

    expect(useMock).toHaveBeenCalledTimes(1);
    expect(typeof useMock.mock.calls[0][0]).toBe('function');
    expect(typeof useMock.mock.calls[0][1]).toBe('function');

    expect(api).toBe(apiMock);
  });

  it('should rethrow error in response interceptor (equivalence: any error)', async () => {
    let errorHandler: (e: any) => never;

    vi.spyOn(axios, 'create').mockReturnValue({
      interceptors: {
        response: {
          use: (_ok: any, bad: any) => {
            errorHandler = bad;
          },
        },
      },
    } as any);

    const { createAPI } = await import('./api');
    createAPI();

    const err = new Error('fail');
    (err as any).response = { status: 500 };

    expect(() => errorHandler(err)).toThrow();
  });
});
