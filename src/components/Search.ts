import type { City } from '../types';

/**
 * Inicializace datalistu (našeptávače).
 */
export const renderCityOptions = (cities: City[]): string => {
     return cities
          .map(city => `<option value="${city.name}">${city.name} (${city.country})</option>`)
          .join('');
};

/**
 * Nastavení elementů vyhledávání.
 */
export const setupSearch = (
     inputElement: HTMLInputElement,
     datalistElement: HTMLDataListElement,
     cities: City[]
): void => {
     // Naplnění datalistu
     datalistElement.innerHTML = renderCityOptions(cities);

     // Vymazání po kliku
     inputElement.addEventListener('focus', () => {
          inputElement.value = '';
     });
};

/**
 * Funkce pro validaci, zda zadaný text odpovídá městu v seznamu.
 */
export const findCityByName = (name: string, cities: City[]): City | undefined => {
     return cities.find(city => city.name.toLowerCase() === name.toLowerCase());
};