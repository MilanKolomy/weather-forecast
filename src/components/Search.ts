import type { City } from '../types';

// Inicializace datalistu (našeptávače).
export const renderCityOptions = (cities: City[]): string => {
     return cities
          .map(city => `<option value="${city.name}">${city.name} (${city.country})</option>`)
          .join('');
};

//Nastavení elementů vyhledávání.
export const setupSearch = (
     inputElement: HTMLInputElement,
     datalistElement: HTMLDataListElement,
     cities: City[]
): void => {

     const updateSuggestions = () => {
          const query = inputElement.value.trim().toLowerCase();

          //Našeptávat od 2 znaků
          if (query.length < 2) {
               datalistElement.innerHTML = '';
               return;
          }

          // filtr + limit
          const filtered = cities
               .filter(city => city.name.toLowerCase().includes(query))
               .slice(0, 10);

          datalistElement.innerHTML = renderCityOptions(filtered);
     };

     // Při psaní aktualizuj návrhy
     inputElement.addEventListener('input', updateSuggestions);

     // Při focusu znovu přepočítej (pokud už je něco napsané)
     inputElement.addEventListener('focus', updateSuggestions);
};

//validace - zadaný text odpovídá městu v seznamu.
export const findCityByName = (name: string, cities: City[]): City | undefined => {
     return cities.find(city => city.name.toLowerCase() === name.toLowerCase());
};