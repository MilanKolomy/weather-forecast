import './styles/main.scss';

import citiesRaw from './data/cz-city.list.json';
import type { City } from './types';
import { setupSearch, findCityByName } from './components/Search';
import { fetchForecast } from './services/api';

const citiesData = citiesRaw as City[];

// DOM
const cityInput = document.querySelector<HTMLInputElement>('#city-search');
const datalist = document.querySelector<HTMLDataListElement>('#cities-datalist');
const cityTitle = document.querySelector<HTMLElement>('#city');
const forecastContainer = document.querySelector<HTMLElement>('#forecast-container');

// helpers
const setText = (el: HTMLElement | null, value: string) => {
     if (el) el.textContent = value;
};

const setHtml = (el: HTMLElement | null, html: string) => {
  if (el) el.innerHTML = html;
};

// handler
const handleCityChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedCity = findCityByName(input.value, citiesData);
  if (!selectedCity) return;

  setText(cityTitle, selectedCity.name);
  setHtml(forecastContainer, '<div class="loader">Načítám data z OpenWeather...</div>');

  try {
    const data = await fetchForecast(selectedCity.id);
    setHtml(
      forecastContainer,
      `<p>OK: ${data.city.name} – záznamů: ${data.list.length}</p>`
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Neznámá chyba';
    setHtml(forecastContainer, `<p class="error">${msg}</p>`);
  }
};

const init = () => {
  if (!cityInput || !datalist) return;
  setupSearch(cityInput, datalist, citiesData);
  cityInput.addEventListener('input', handleCityChange);
};

init();