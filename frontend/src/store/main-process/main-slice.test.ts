import { describe, it, expect, vi, beforeEach } from 'vitest';
import mainSlice, {
  loadInfo,
  loadForecast,
  loadChartsData3Days,
  loadChartsData10Days,
  setLoadingStatus,
  changeCity,
  toggleTheme,
  setError,
} from './main-slice';

import { extractWeatherInfoFromServer, extractForecastFromServer } from '../../utils/adapters';

vi.mock('../../utils/adapters', () => ({
  extractWeatherInfoFromServer: vi.fn(),
  extractForecastFromServer: vi.fn(),
}));

describe('mainSlice reducer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state on unknown action (equivalence: unknown action)', () => {
    const state = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(state.activeCityName).toBe('Saint-Petersburg');
    expect(state.temperature).toBe(0);
    expect(state.darkTheme).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.isError).toBe(false);
    expect(state.forecast).toEqual([]);
    expect(state.chartsInfo3Days).toEqual([]);
    expect(state.chartsInfo10Days).toEqual([]);
  });

  it('should handle loadInfo and use adapter (equivalence: valid payload)', () => {
    const serverInfo = {
      temperature: 21,
      description: 'clear',
      icon: '01d',
      wind_speed: 3,
      visibility: 10,
      pressure: 760,
      humidity: 40,
      sunrise: '2025-03-09T06:12:34Z',
      sunset: '2025-03-09T18:45:00Z',
    } as any;

    (extractWeatherInfoFromServer as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      'Wind speed': 3,
      Visibility: 10,
      Pressure: 760,
      Humidity: 40,
      Sunrise: '2025-03-09T06:12:34',
      Sunset: '2025-03-09T18:45:00',
    });

    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    const next = mainSlice.reducer(prev, loadInfo(serverInfo));

    expect(extractWeatherInfoFromServer).toHaveBeenCalledWith(serverInfo);

    expect(next.temperature).toBe(21);
    expect(next.description).toBe('clear');
    expect(next.icon).toBe('01d');
    expect(next.weatherInfo).toEqual({
      'Wind speed': 3,
      Visibility: 10,
      Pressure: 760,
      Humidity: 40,
      Sunrise: '2025-03-09T06:12:34',
      Sunset: '2025-03-09T18:45:00',
    });

    expect(typeof next.date).toBe('string');
    expect(next.date.length).toBeGreaterThan(0);
  });

  it('should handle loadForecast and format dates via adapter (equivalence: forecast array)', () => {
    const forecastFromServer = [
      { date: '2025-03-09T12:00:00Z', temperature: 20 },
      { date: '2025-03-10T12:00:00Z', temperature: 22 },
    ] as any;

    const formatted = [
      { date: '2025-03-09T12:00:00', temperature: 20 },
      { date: '2025-03-10T12:00:00', temperature: 22 },
    ] as any;

    (extractForecastFromServer as unknown as ReturnType<typeof vi.fn>).mockReturnValue(formatted);

    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    const next = mainSlice.reducer(prev, loadForecast(forecastFromServer));

    expect(extractForecastFromServer).toHaveBeenCalledWith(forecastFromServer);
    expect(next.forecast).toEqual(formatted);
  });

  it('should handle loadForecast with empty array (boundary: empty)', () => {
    (extractForecastFromServer as unknown as ReturnType<typeof vi.fn>).mockReturnValue([]);

    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    const next = mainSlice.reducer(prev, loadForecast([] as any));

    expect(next.forecast).toEqual([]);
  });

  it('should set charts data for 3 days and 10 days (equivalence: arrays)', () => {
    const data3 = [{ date: '2025-03-01', temperature: 10 }] as any;
    const data10 = [{ date: '2025-03-01', temperature: 10 }, { date: '2025-03-02', temperature: 11 }] as any;

    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    const s1 = mainSlice.reducer(prev, loadChartsData3Days(data3));
    const s2 = mainSlice.reducer(s1, loadChartsData10Days(data10));

    expect(s1.chartsInfo3Days).toEqual(data3);
    expect(s2.chartsInfo10Days).toEqual(data10);
  });

  it('should setLoadingStatus true/false (boundary: false -> true)', () => {
    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });

    const s1 = mainSlice.reducer(prev, setLoadingStatus(false));
    expect(s1.isLoading).toBe(false);

    const s2 = mainSlice.reducer(s1, setLoadingStatus(true));
    expect(s2.isLoading).toBe(true);
  });

  it('should changeCity (equivalence: any string)', () => {
    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    const next = mainSlice.reducer(prev, changeCity('Paris'));
    expect(next.activeCityName).toBe('Paris');
  });

  it('should toggleTheme twice (boundary: false->true->false)', () => {
    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });

    const s1 = mainSlice.reducer(prev, toggleTheme());
    expect(s1.darkTheme).toBe(true);

    const s2 = mainSlice.reducer(s1, toggleTheme());
    expect(s2.darkTheme).toBe(false);
  });

  it('should setError (equivalence: flag becomes true)', () => {
    const prev = mainSlice.reducer(undefined, { type: 'UNKNOWN' });
    const next = mainSlice.reducer(prev, setError());
    expect(next.isError).toBe(true);
  });
});
