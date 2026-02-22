import type { WeatherInterval } from './types';

// Definice struktury stavu aplikace.
export interface AppState {
     readonly selectedCityId: number | null;
     readonly forecast: WeatherInterval[];
     readonly isLoading: boolean;
     readonly error: string | null;
}

// Počáteční stav (Initial State)
const initialState: AppState = {
     selectedCityId: null,
     forecast: [],
     isLoading: false,
     error: null
};

// Aktuální instance stavu
let currentState = initialState;

// Funkce pro získání aktuálního stavu
export const getState = (): AppState => currentState;

// Aktualizace stavu vytvořením nového objektu
export const setState = (newState: Partial<AppState>): void => {
     currentState = { ...currentState, ...newState };

     // Upozornění UI na změnu
     document.dispatchEvent(new CustomEvent('stateUpdate', { detail: currentState }));
};