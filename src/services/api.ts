import type { WeatherResponse } from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;
const BASE_URL = 'https://api.openweathermap.org';

export const fetchForecast = async (cityId: number): Promise<WeatherResponse> => {
  if (!API_KEY) throw new Error('Chybí VITE_OPENWEATHER_KEY v .env');

  const url = `${BASE_URL}/data/2.5/forecast?id=${cityId}&appid=${API_KEY}&units=metric&lang=cz`;

  const response = await fetch(url);
  if (!response.ok) {
    let msg = `Chyba HTTP: ${response.status}`;
    try {
      const errorData = await response.json();
      msg = errorData.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return (await response.json()) as WeatherResponse;
};