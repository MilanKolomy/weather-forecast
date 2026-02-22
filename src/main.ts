import './styles/main.scss';

import citiesRaw from './data/cz-city.list.json';
import type { City } from './types';
import { setupSearch, findCityByName } from './components/Search';
import { renderForecastTable, renderError } from './components/Forecast';
import { fetchForecast } from './services/api';
import { getState, setState } from './state';
import type { AppState } from './state';

// Načtení lokální databáze měst
const citiesData = citiesRaw as City[];

// Aktuální jazyk pro formátování dat
const locale = navigator.language;

// DOM elementy
const cityInput = document.querySelector<HTMLInputElement>('#city-search');
const datalist = document.querySelector<HTMLDataListElement>('#cities-datalist');
const cityTitle = document.querySelector<HTMLElement>('#city');
const forecastContainer = document.querySelector<HTMLElement>('#forecast-container');

// Pomocné funkce
const setText = (el: HTMLElement | null, value: string) => {
     if (el) el.textContent = value;
};

const setHtml = (el: HTMLElement | null, html: string) => {
     if (el) el.innerHTML = html;
};

// Filtr: 5 dní v poledne
const selectDailyAtNoon = <T extends { dt_txt: string }>(list: T[]) =>
     list.filter((item) => item.dt_txt.includes('12:00:00'));

// Převod stupňů na radiány
const toRad = (deg: number) => (deg * Math.PI) / 180;

// Výpočet vzdálenosti
const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
     const R = 6371;
     const dLat = toRad(lat2 - lat1);
     const dLon = toRad(lon2 - lon1);

     const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

     return 2 * R * Math.asin(Math.sqrt(a));
};

// Najde nejbližší město z lokální databáze
const findNearestCity = (lat: number, lon: number, cities: City[]): City | null => {
     if (!cities.length) return null;

     return cities.reduce((best, c) => {
          const bestDist = haversineKm(lat, lon, best.coord.lat, best.coord.lon);
          const d = haversineKm(lat, lon, c.coord.lat, c.coord.lon);
          return d < bestDist ? c : best;
     }, cities[0]);
};

// Vytvoří HTML podle aktuálního stavu
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

// Překreslí aplikaci podle aktuálního state
const render = () => {
     if (!forecastContainer) return;
     setHtml(forecastContainer, viewHtml(getState()));
};

// Načte předpověď pro vybrané město a uloží ji do state
const loadForecastForCity = async (city: City) => {

     // Zabrání opakovanému načítání stejného města
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

// Pokus o automatické načtení města podle geolokace
const tryLoadForecastFromGeolocation = () => {
     if (!navigator.geolocation) return;

     navigator.geolocation.getCurrentPosition(
          async (pos) => {
               const { latitude, longitude } = pos.coords;

               const nearest = findNearestCity(latitude, longitude, citiesData);
               if (!nearest) return;

               // Aktualizace UI + načtení dat
               setText(cityTitle, nearest.name);
               await loadForecastForCity(nearest);
          },
          () => {
               // Geolokace není k dispozici
               console.info('Geolokace není k dispozici nebo je zamítnuta.');
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
     );
};

// Reakce na změnu vstupního pole
const handleCityChange = async (event: Event) => {
     const input = event.target as HTMLInputElement;
     const selectedCity = findCityByName(input.value.trim(), citiesData);
     if (!selectedCity) return;

     setText(cityTitle, selectedCity.name);
     await loadForecastForCity(selectedCity);
};

// Inicializace aplikace
const init = () => {
     if (!cityInput || !datalist) return;

     setupSearch(cityInput, datalist, citiesData);
     cityInput.addEventListener('input', handleCityChange);

     // Při změně stavu aplikace dojde k překreslení
     document.addEventListener('stateUpdate', () => render());

     // První vykreslení (placeholder)
     render();

     // Pokus o načtení podle geolokace
     tryLoadForecastFromGeolocation();
};

init();