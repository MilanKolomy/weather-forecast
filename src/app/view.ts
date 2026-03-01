import type { AppState } from '../state';
import { renderForecastTable, renderError } from '../components/Forecast';

// Vytvoří HTML podle aktuálního stavu
export const viewHtml = (state: AppState, locale: string): string => {
     // Loader
     if (state.isLoading) {
          return '<div class="loader">Načítám data z OpenWeather...</div>';
     }
     // Error
     if (state.error) {
          return renderError(state.error);
     }
     // Tabulka počasí
     if (state.forecast.length > 0) {
          return `
               ${renderForecastTable(state.forecast, locale)}
               <div class="chart-wrap">
                    <canvas id="temp-chart"></canvas>
               </div>
          `;
     }

     return '<p class="placeholder">Zadejte město pro zobrazení předpovědi na 5 dní.</p>'

};