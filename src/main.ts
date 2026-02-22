import './styles/main.scss';

import citiesRaw from './data/cz-city.list.json';
import type { City } from './types';
import { setupSearch, findCityByName } from './components/Search';
import { renderForecastTable, renderError } from './components/Forecast';
import { fetchForecast } from './services/api';
import { getState, setState } from './state';
import type { AppState } from './state';

const citiesData = citiesRaw as City[];
const locale = navigator.language;

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

// filtr: 5 dní v poledne
const selectDailyAtNoon = <T extends { dt_txt: string }>(list: T[]) =>
     list.filter((item) => item.dt_txt.includes('12:00:00'));

// view
const viewHtml = (state: AppState): string => {
     if (state.isLoading) {
          return '<div class="loader">Načítám data z OpenWeather...</div>';
     }
     if (state.error) {
          return renderError(state.error);
     }
     if (state.forecast.length > 0) {
          return renderForecastTable(state.forecast, locale);
     }
     return '<p class="placeholder">Zadejte město pro zobrazení předpovědi na 5 dní.</p>';
};

const render = () => {
     if (!forecastContainer) return;
     setHtml(forecastContainer, viewHtml(getState()));
};

const loadForecastForCity = async (city: City) => {
     if (city.id === getState().selectedCityId) return;

     setState({ isLoading: true, error: null });

     try {
          const data = await fetchForecast(city.id);
          const dailyData = selectDailyAtNoon(data.list);

          setState({
               selectedCityId: city.id,
               forecast: dailyData,
               isLoading: false,
          });
     } catch (err) {
          const msg = err instanceof Error ? err.message : 'Neznámá chyba';
          setState({
               isLoading: false,
               error: msg,
          });
     }
};

// handler
const handleCityChange = async (event: Event) => {
     const input = event.target as HTMLInputElement;
     const selectedCity = findCityByName(input.value.trim(), citiesData);
     if (!selectedCity) return;

     setText(cityTitle, selectedCity.name);
     await loadForecastForCity(selectedCity);
};

// init
const init = () => {
     if (!cityInput || !datalist) return;

     setupSearch(cityInput, datalist, citiesData);
     cityInput.addEventListener('input', handleCityChange);

     document.addEventListener('stateUpdate', () => render());

     render();
};

init();