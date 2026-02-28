import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { toast } from 'react-toastify';

import { fetchWeatherAction } from './api-actions';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('./main-process/main-slice.js', () => ({
  setLoadingStatus: vi.fn((payload: boolean) => ({ type: 'setLoadingStatus', payload })),
  changeCity: vi.fn((payload: string) => ({ type: 'changeCity', payload })),
  loadInfo: vi.fn((payload: unknown) => ({ type: 'loadInfo', payload })),
  loadForecast: vi.fn((payload: unknown) => ({ type: 'loadForecast', payload })),
  loadChartsData3Days: vi.fn((payload: unknown) => ({ type: 'loadChartsData3Days', payload })),
  loadChartsData10Days: vi.fn((payload: unknown) => ({ type: 'loadChartsData10Days', payload })),
}));

describe('fetchWeatherAction thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({}));

  const api = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call API endpoints with encoded city_name param (equivalence: valid city)', async () => {
    api.get
      .mockResolvedValueOnce({ data: { wind_speed: 1 } })
      .mockResolvedValueOnce({ data: [{ date: 'x', temperature: 1 }] })
      .mockResolvedValueOnce({ data: [{ date: 'x', temperature: 1 }] })
      .mockResolvedValueOnce({ data: [{ date: 'x', temperature: 1 }] });

    await fetchWeatherAction(
      { cityName: 'Saint-Petersburg', stateName: '', countryName: '' },
    )(dispatch as any, getState as any, api as any);

    expect(api.get).toHaveBeenNthCalledWith(1, '/?city_name=Saint-Petersburg');
    expect(api.get).toHaveBeenNthCalledWith(2, '/forecast/?city_name=Saint-Petersburg');
    expect(api.get).toHaveBeenNthCalledWith(3, '/3days/?city_name=Saint-Petersburg');
    expect(api.get).toHaveBeenNthCalledWith(4, '/10days/?city_name=Saint-Petersburg');
  });

  it('should not show toast on success (equivalence: success)', async () => {
    api.get
      .mockResolvedValueOnce({ data: { wind_speed: 1 } })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    await fetchWeatherAction(
      { cityName: 'London', stateName: '', countryName: '' },
    )(dispatch as any, getState as any, api as any);

    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should reject with "No such city" and show toast when axios error status=400 (boundary: 400)', async () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    const err = new Error('bad request') as any;
    err.response = { status: 400 };

    api.get.mockRejectedValueOnce(err);

    const result = await fetchWeatherAction(
      { cityName: 'Nowhere', stateName: '', countryName: '' },
    )(dispatch as any, getState as any, api as any);

    expect(toast.error).toHaveBeenCalledWith('No such city');
    expect(result.meta.requestStatus).toBe('rejected');
    expect(result.payload).toBe('No such city');

  });

  it('should reject with "Error while processing" for axios errors with non-400 status (equivalence: other status)', async () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    const err = new Error('server error') as any;
    err.response = { status: 500 };

    api.get.mockRejectedValueOnce(err);

    const result = await fetchWeatherAction(
      { cityName: 'Rome', stateName: '', countryName: '' },
    )(dispatch as any, getState as any, api as any);

    expect(toast.error).toHaveBeenCalledWith('Error while processing');
    expect(result.meta.requestStatus).toBe('rejected');
    expect(result.payload).toBe('Error while processing');
  });

  it('should reject with "Unknown error" when error is not axios (equivalence: non-axios error)', async () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    api.get.mockRejectedValueOnce(new Error('boom'));

    const result = await fetchWeatherAction(
      { cityName: 'Berlin', stateName: '', countryName: '' },
    )(dispatch as any, getState as any, api as any);

    expect(toast.error).toHaveBeenCalledWith('Unknown error');
    expect(result.meta.requestStatus).toBe('rejected');
    expect(result.payload).toBe('Unknown error');
  });

  it('should stop after first failed request (equivalence: failure early)', async () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    const err = new Error('bad') as any;
    err.response = { status: 400 };
    api.get.mockRejectedValueOnce(err);

    await fetchWeatherAction(
      { cityName: 'X', stateName: '', countryName: '' },
    )(dispatch as any, getState as any, api as any);

    expect(api.get).toHaveBeenCalledTimes(1);
  });
});
