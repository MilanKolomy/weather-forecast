import type { City } from '../types';
import { getState, setState } from '../state';
import { fetchForecast } from '../services/api';
import { setupSearch, findCityByName } from '../components/Search';

import { dom, render, setInput, setText } from './dom';
import { findNearestCity } from './geo';

// Načte předpověd pro vybrané město a uloží ji do state
export const createController = (citiesData: City[]) => {

     // Filtr 5 dní v poledne
     const selectDailyAtNoon = <T extends { dt_txt: string }>(list: T[]) =>
          list.filter((item) => item.dt_txt.includes('12:00:00'));

     const loadForecastForCity = async (city: City) => {

          if (city.id === getState().selectedCityId) return;

          setInput(dom.cityInput, city.name);
          setText(dom.cityTitle, city.name);

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

     // Reakce na změnu vstupního pole
     const handleCityChange = async (event: Event) => {
          const input = event.target as HTMLInputElement;
          const selectedCity = findCityByName(input.value.trim(), citiesData);
          if (selectedCity)
               await loadForecastForCity(selectedCity);
     };

     // Pokus o automatické načtení města podle geolokace
     const tryLoadForecastFromGeolocation = () => {
          if (!navigator.geolocation) return;

          navigator.geolocation.getCurrentPosition(
               async (pos) => {
                    const { latitude, longitude } = pos.coords;

                    const nearest = findNearestCity(latitude, longitude, citiesData);
                    if (nearest)
                         await loadForecastForCity(nearest);
               },
               () => {
                    // Geolokace není k dispozici
                    console.info('Geolokace není k dispozici nebo je zamítnuta.');
               },
               { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
          );
     };

     // Inicializace aplikace
     const init = () => {
          if (dom.cityInput && dom.datalist) {
               setupSearch(dom.cityInput, dom.datalist, citiesData);
               dom.cityInput.addEventListener('input', handleCityChange);
          }

          // Při změně stavu aplikace dojde k překreslení
          document.addEventListener('stateUpdate', () => render());

          // První vykreslení (placeholder)
          render();

          // Pokus o načtení podle geolokace
          tryLoadForecastFromGeolocation();
     };

     return { init };
}

