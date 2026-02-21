import './styles/main.scss';

import citiesRaw from './data/cz-city.list.json';
import type { City } from './types';
import { setupSearch, findCityByName } from './components/Search';

const citiesData = citiesRaw as City[];

// DOM
const cityInput = document.querySelector<HTMLInputElement>('#city-search');
const datalist = document.querySelector<HTMLDataListElement>('#cities-datalist');
const cityTitle = document.querySelector<HTMLElement>('#city');

// helpers
const setText = (el: HTMLElement | null, value: string) => {
  if (el) el.textContent = value;
};

// handler
const handleCityChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedCity = findCityByName(input.value, citiesData);
  if (selectedCity) setText(cityTitle, selectedCity.name);
};

const init = () => {
  if (!cityInput || !datalist) return;

  setupSearch(cityInput, datalist, citiesData);
  cityInput.addEventListener('input', handleCityChange);
};

init();