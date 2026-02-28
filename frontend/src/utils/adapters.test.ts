import { describe, it, expect } from 'vitest';
import {
  extractWeatherInfoFromServer,
  extractForecastFromServer,
  formatTimeWithoutTZ,
} from './adapters';

describe('formatTimeWithoutTZ', () => {
  it('should cut timezone part and keep first 19 chars (equivalence class: iso with TZ)', () => {
    expect(formatTimeWithoutTZ('2025-03-09T12:00:00+03:00')).toBe('2025-03-09T12:00:00');
    expect(formatTimeWithoutTZ('2025-03-09T12:00:00Z')).toBe('2025-03-09T12:00:00');
  });

  it('should handle boundary length = 19 (boundary value)', () => {
    expect(formatTimeWithoutTZ('2025-03-09T12:00:00')).toBe('2025-03-09T12:00:00');
  });
});

describe('extractWeatherInfoFromServer', () => {
  it('should map server fields to WeatherInfo and format sunrise/sunset (equivalence mapping)', () => {
    const serverInfo = {
      wind_speed: 3.4,
      visibility: 10,
      pressure: 760,
      humidity: 40,
      sunrise: '2025-03-09T06:12:34+03:00',
      sunset: '2025-03-09T18:45:00Z',
    } as any;

    expect(extractWeatherInfoFromServer(serverInfo)).toEqual({
      'Wind speed': 3.4,
      Visibility: 10,
      Pressure: 760,
      Humidity: 40,
      Sunrise: '2025-03-09T06:12:34',
      Sunset: '2025-03-09T18:45:00',
    });
  });
});

describe('extractForecastFromServer', () => {
  it('should format date for each item and keep other fields unchanged (equivalence + boundary empty)', () => {
    const forecast = [
      { date: '2025-03-09T12:00:00+03:00', temperature: 20 },
      { date: '2025-03-10T12:00:00Z', temperature: 22 },
    ] as any;

    expect(extractForecastFromServer(forecast)).toEqual([
      { date: '2025-03-09T12:00:00', temperature: 20 },
      { date: '2025-03-10T12:00:00', temperature: 22 },
    ]);

    expect(extractForecastFromServer([] as any)).toEqual([]);
  });
});